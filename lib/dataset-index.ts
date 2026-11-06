import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import nodeZlib from 'node:zlib';
const zlib=nodeZlib as unknown as {zstdDecompressSync:(buffer:Buffer,options:{maxOutputLength:number})=>Buffer};
type Entry=[number,number,number,string];
interface Index{version:1;month:string;data:{file:string;bytes:number;sha256:string};records:Record<string,Entry>}
function signature(stat:fs.Stats){return `${stat.dev}:${stat.ino}:${stat.size}:${stat.mtimeMs}:${stat.ctimeMs}`;}
const digest=(buffer:Buffer)=>createHash('sha256').update(buffer).digest('hex');
const MAX_RECORD=4*1024*1024;
/** Chỉ cache tối đa 16 index và 8 MiB bản ghi, không giữ tháng đã giải nén. */
export class IndexedDataset{
  private indexes=new Map<string,{signature:string;index:Index}>();
  private records=new Map<string,Buffer>();
  private recordBytes=0;
  private counters={indexReads:0,frameReads:0,frameBytes:0,frameDecompressions:0};
  constructor(private directory:string,private cacheBytes=8*1024*1024){}
  get stats(){return {...this.counters,indexes:this.indexes.size,recordCacheBytes:this.recordBytes};}
  private index(month:string){
    if(!/^\d{4}-\d{2}$/.test(month))throw Error('Invalid month');
    const indexFile=path.join(this.directory,month+'.index.json'),dataFile=path.join(this.directory,month+'.records.zst');
    const stat=fs.statSync(indexFile),dataStat=fs.statSync(dataFile),version=signature(stat)+':'+signature(dataStat);
    const existing=this.indexes.get(month);
    if(existing?.signature===version){this.indexes.delete(month);this.indexes.set(month,existing);return {index:existing.index,dataFile,version,dataSignature:signature(dataStat)};}
    this.indexes.delete(month);
    if(stat.size>512*1024)throw Error('Index too large');
    const parsed=JSON.parse(fs.readFileSync(indexFile,'utf8')) as Index;this.counters.indexReads++;
    if(parsed.version!==1||parsed.month!==month||parsed.data?.file!==month+'.records.zst'||parsed.data.bytes!==dataStat.size||!Number.isSafeInteger(parsed.data.bytes)||!/^[a-f0-9]{64}$/.test(parsed.data.sha256)||!parsed.records||typeof parsed.records!=='object'||Array.isArray(parsed.records))throw Error('Invalid index/data pair');
    const entries=Object.entries(parsed.records);if(entries.length>1000)throw Error('Too many index entries');
    let lastEnd=0;
    for(const [key,entry] of entries){
      if(!new RegExp('^'+month+'-\\d{2}-(?:[0-9]|1[01])-(?:male|female)$').test(key)||!Array.isArray(entry)||entry.length!==4)throw Error('Invalid index key');
      const [offset,length,rawBytes,hash]=entry;
      if(![offset,length,rawBytes].every(Number.isSafeInteger)||offset<lastEnd||length<=0||length>MAX_RECORD||rawBytes<=0||rawBytes>MAX_RECORD||offset+length>dataStat.size||!/^[a-f0-9]{64}$/.test(hash))throw Error('Invalid record bounds');
      lastEnd=offset+length;
    }
    this.indexes.set(month,{signature:version,index:parsed});
    while(this.indexes.size>16)this.indexes.delete(this.indexes.keys().next().value!);
    return {index:parsed,dataFile,version,dataSignature:signature(dataStat)};
  }
  has(month:string,key:string){const {index}=this.index(month);return Object.hasOwn(index.records,key);}
  read(month:string,key:string):Record<string,string>|null{
    const {index,dataFile,version,dataSignature}=this.index(month);
    if(!Object.hasOwn(index.records,key))return null;
    const [offset,length,rawBytes,hash]=index.records[key],cacheKey=month+':'+version+':'+key;
    let raw=this.records.get(cacheKey);
    if(raw){this.records.delete(cacheKey);this.records.set(cacheKey,raw);}
    else{
      const fd=fs.openSync(dataFile,'r');let compressed:Buffer;
      try{
        // Nếu tệp vừa thay sau stat, không đọc bằng offset của bản trước.
        if(signature(fs.fstatSync(fd))!==dataSignature)throw Error('Data changed during read');
        compressed=Buffer.allocUnsafe(length);let read=0;
        while(read<length){const count=fs.readSync(fd,compressed,read,length-read,offset+read);if(!count)throw Error('Truncated frame');read+=count;}
        this.counters.frameReads++;this.counters.frameBytes+=length;
      }finally{fs.closeSync(fd);}
      raw=zlib.zstdDecompressSync(compressed,{maxOutputLength:MAX_RECORD});this.counters.frameDecompressions++;
      if(raw.length!==rawBytes||digest(raw)!==hash)throw Error('Record checksum mismatch');
      if(raw.length<=this.cacheBytes){
        while(this.recordBytes+raw.length>this.cacheBytes&&this.records.size){const first=this.records.keys().next().value!;this.recordBytes-=this.records.get(first)!.length;this.records.delete(first);}
        this.records.set(cacheKey,raw);this.recordBytes+=raw.length;
      }
    }
    const record=JSON.parse(raw.toString('utf8'));
    if(record.k!==key||!record.c||typeof record.c!=='object'||Array.isArray(record.c)||!Object.values(record.c).every(v=>typeof v==='string')||!Object.values(record.c).some(v=>(v as string).trim()))throw Error('Invalid record payload');
    return record.c;
  }
}
