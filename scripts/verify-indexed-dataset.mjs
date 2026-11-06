import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
const directory=path.resolve(process.argv[2]||'data/v5-indexed'),manifestFile=path.join(directory,'manifest.json'),manifestBytes=fs.readFileSync(manifestFile),manifest=JSON.parse(manifestBytes);
if(manifest.version!==1||!manifest.complete||!manifest.verified||manifest.months.length!==924)throw Error('Not a full verified catalog');
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
let records=0,bytes=0;const indexes={};
for(const month of manifest.months){
 const indexFile=path.join(directory,month.month+'.index.json'),indexBytes=fs.readFileSync(indexFile),index=JSON.parse(indexBytes),data=fs.readFileSync(path.join(directory,month.month+'.records.zst'));
 if(index.version!==1||index.sourceSha256!==month.sourceSha256||data.length!==index.data.bytes||hash(data)!==index.data.sha256)throw Error('File integrity mismatch '+month.month);
 let end=0;const sourceHash=crypto.createHash('sha256');
 for(const [key,[offset,length,rawBytes,sha]] of Object.entries(index.records)){
  if(offset!==end||length<=0||offset+length>data.length)throw Error('Invalid index range '+month.month);
  const raw=zlib.zstdDecompressSync(data.subarray(offset,offset+length),{maxOutputLength:4*1024*1024});
  const prefix=Buffer.from('{\"k\":'+JSON.stringify(key)+',');
  if(raw.length!==rawBytes||hash(raw)!==sha||!raw.subarray(0,prefix.length).equals(prefix))throw Error('Invalid record '+key);
  sourceHash.update(raw);end+=length;records++;
 }
 if(end!==data.length||sourceHash.digest('hex')!==month.sourceSha256)throw Error('Source bytes changed '+month.month);
 indexes[month.month]=hash(indexBytes);bytes+=data.length+indexBytes.length;
 if(Object.keys(indexes).length%50===0)console.log(JSON.stringify({verifiedMonths:Object.keys(indexes).length,records}));
}
if(records!==manifest.records)throw Error('Record count mismatch');
const report={format:'record-zstd-v1',verified:true,months:924,records,packedBytes:bytes,manifestSha256:hash(manifestBytes),indexSha256:indexes,finished:new Date().toISOString()};
fs.writeFileSync(path.join(directory,'verification.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,indexSha256:undefined}));
