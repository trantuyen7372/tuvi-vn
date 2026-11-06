import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import {Worker,isMainThread,parentPort} from 'node:worker_threads';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function writeAll(fd,buffer){let n=0;while(n<buffer.length){const wrote=fs.writeSync(fd,buffer,n,buffer.length-n);if(!wrote)throw Error('Short write');n+=wrote;}}
function pack({source,target,month,level}){
 const input=path.join(source,month+'.jsonl.zst'),dataFile=month+'.records.zst',indexFile=path.join(target,month+'.index.json');
 const raw=zlib.zstdDecompressSync(fs.readFileSync(input),{maxOutputLength:128*1024*1024,params:{[zlib.constants.ZSTD_d_windowLogMax]:27}}),sourceHash=sha(raw);
 if(fs.existsSync(indexFile)){
  const old=JSON.parse(fs.readFileSync(indexFile,'utf8')),existing=path.join(target,dataFile);
  if(old.version!==1||old.sourceSha256!==sourceHash||old.level!==level||sha(fs.readFileSync(existing))!==old.data.sha256)throw Error('Existing output does not match source: '+month);
  return {month,records:Object.keys(old.records).length,sourceBytes:fs.statSync(input).size,dataBytes:old.data.bytes,indexBytes:fs.statSync(indexFile).size,sourceSha256:sourceHash,reused:true};
 }
 const disk=fs.statfsSync(target);if(disk.bavail*disk.bsize<1024*1024*1024)throw Error('Còn dưới 1 GiB trống; dừng trước khi ghi thêm');
 const tmp=path.join(target,dataFile+'.tmp-'+process.pid),fd=fs.openSync(tmp,'wx'),records={},digest=crypto.createHash('sha256');let offset=0,start=0;
 try{
  while(start<raw.length){const newline=raw.indexOf(10,start),end=newline<0?raw.length:newline+1,line=raw.subarray(start,end);start=end;
   const row=JSON.parse(line.toString('utf8'));
   if(typeof row.k!=='string'||!new RegExp('^'+month+'-\\d{2}-(?:[0-9]|1[01])-(?:male|female)$').test(row.k)||Object.hasOwn(records,row.k))throw Error('Invalid/duplicate source key in '+month);
   if(!row.c||typeof row.c!=='object'||Array.isArray(row.c)||!Object.values(row.c).every(v=>typeof v==='string')||!Object.values(row.c).some(v=>v.trim()))throw Error('Invalid/empty content in '+month);
   if(line.length>4*1024*1024)throw Error('Record exceeds 4 MiB');
   const compressed=zlib.zstdCompressSync(line,{params:{[zlib.constants.ZSTD_c_compressionLevel]:level,[zlib.constants.ZSTD_c_checksumFlag]:1}});
   const restored=zlib.zstdDecompressSync(compressed,{maxOutputLength:4*1024*1024});if(!line.equals(restored))throw Error('Roundtrip mismatch');
   records[row.k]=[offset,compressed.length,line.length,sha(line)];writeAll(fd,compressed);digest.update(compressed);offset+=compressed.length;
  }
  fs.fsyncSync(fd);
 }finally{fs.closeSync(fd);}
 const index={version:1,month,level,sourceSha256:sourceHash,data:{file:dataFile,bytes:offset,sha256:digest.digest('hex')},records};
 const indexTmp=indexFile+'.tmp-'+process.pid;fs.writeFileSync(indexTmp,JSON.stringify(index)+'\n',{flag:'wx'});
 fs.renameSync(tmp,path.join(target,dataFile));fs.renameSync(indexTmp,indexFile);
 return {month,records:Object.keys(records).length,sourceBytes:fs.statSync(input).size,dataBytes:offset,indexBytes:fs.statSync(indexFile).size,sourceSha256:sourceHash,reused:false};
}
if(!isMainThread){parentPort.on('message',job=>{try{parentPort.postMessage({ok:true,result:pack(job)});}catch(e){parentPort.postMessage({ok:false,error:e.message});}});}
else{
 const args=process.argv.slice(2),get=(k,f)=>{const i=args.indexOf(k);return i<0?f:args[i+1];};
 const source=path.resolve(get('--source','data/v4-vi')),target=path.resolve(get('--target','data/v5-indexed')),level=Number(get('--level','6')),concurrency=Number(get('--workers','3'));
 if(source===target||!Number.isInteger(level)||level<1||level>19||!Number.isInteger(concurrency)||concurrency<1||concurrency>4)throw Error('Invalid output/level/workers');
 fs.mkdirSync(target,{recursive:true});if(fs.existsSync(path.join(target,'verification.json')))throw Error('Kho đã được niêm phong; chọn thư mục mới để đóng gói lại');const wanted=get('--months','');
 const months=wanted?wanted.split(','):fs.readdirSync(source).filter(n=>/^\d{4}-\d{2}\.jsonl\.zst$/.test(n)).map(n=>n.slice(0,7)).sort();
 if(!months.length||months.some(m=>!/^\d{4}-\d{2}$/.test(m))||new Set(months).size!==months.length)throw Error('Invalid month list');
 if(!wanted&&months.length!==924)throw Error('Full source must contain 924 months');
 const results=[],started=Date.now();let next=0;
 await Promise.all(Array.from({length:Math.min(concurrency,months.length)},()=>new Promise((resolve,reject)=>{
  const worker=new Worker(new URL(import.meta.url)),dispatch=()=>{if(next>=months.length){worker.terminate().then(resolve,reject);return;}worker.postMessage({source,target,month:months[next++],level});};
  worker.on('error',reject);worker.on('message',message=>{if(!message.ok){worker.terminate();reject(Error(message.error));return;}
   results.push(message.result);if(results.length%20===0||results.length===months.length)console.log(JSON.stringify({done:results.length,total:months.length,seconds:Math.round((Date.now()-started)/1000)}));dispatch();});dispatch();
 })));
 results.sort((a,b)=>a.month.localeCompare(b.month));
 const manifest={version:1,format:'record-zstd-v1',complete:!wanted&&results.length===924,verified:true,level,records:results.reduce((n,r)=>n+r.records,0),sourceCompressedBytes:results.reduce((n,r)=>n+r.sourceBytes,0),packedBytes:results.reduce((n,r)=>n+r.dataBytes+r.indexBytes,0),months:results,finished:new Date().toISOString(),seconds:(Date.now()-started)/1000};
 const temp=path.join(target,'manifest.json.tmp');fs.writeFileSync(temp,JSON.stringify(manifest,null,2)+'\n');fs.renameSync(temp,path.join(target,'manifest.json'));
 console.log(JSON.stringify({...manifest,months:results.length}));
}
