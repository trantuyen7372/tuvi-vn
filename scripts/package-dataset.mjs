import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
const dir='outputs/server-data/v4-vi';fs.mkdirSync(dir,{recursive:true});
let bytes=0,count=0;
for(const name of fs.readdirSync('data/v4-vi').filter(f=>/^\d{4}-\d{2}\.jsonl\.zst$/.test(f)).sort()){
  const target=path.join(dir,name);
  if(fs.existsSync(target)){bytes+=fs.statSync(target).size;count++;continue;}
  const raw=zlib.zstdDecompressSync(fs.readFileSync(path.join('data/v4-vi',name)));
  const compressed=zlib.zstdCompressSync(raw,{params:{[zlib.constants.ZSTD_c_compressionLevel]:9,[zlib.constants.ZSTD_c_windowLog]:27}});
  if(!zlib.zstdDecompressSync(compressed).equals(raw))throw Error('Nội dung sau nén không khớp: '+name);
  fs.writeFileSync(target+'.tmp',compressed);fs.renameSync(target+'.tmp',target);bytes+=compressed.length;count++;
  if(count%100===0)console.log(`${count}/924 tệp đã nén và đối chiếu nguyên vẹn`);
}
if(count!==924)throw Error('Thiếu dữ liệu tháng');
console.log(JSON.stringify({files:count,bytes,MiB:Math.round(bytes/1024**2)}));
