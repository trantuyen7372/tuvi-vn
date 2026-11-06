import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import nodeZlib from 'node:zlib';
import {polishTranslation} from './translation';
import {DatasetMonthCache} from './dataset-cache';
import {IndexedDataset} from './dataset-index';
import {referenceKey} from './dataset-key';
import {createHash} from 'node:crypto';
const zlib=nodeZlib as unknown as {zstdDecompressSync:(b:Buffer,o?:{params?:Record<number,number>})=>Buffer;constants:Record<string,number>};
const indexedDefault=path.join(process.cwd(),'data','v5-indexed');
function ready(directory:string){try{const bytes=fs.readFileSync(path.join(directory,'manifest.json')),m=JSON.parse(bytes.toString('utf8')),v=JSON.parse(fs.readFileSync(path.join(directory,'verification.json'),'utf8'));return m.format==='record-zstd-v1'&&m.complete===true&&m.verified===true&&m.months.length===924&&v.verified===true&&v.months===924&&v.manifestSha256===createHash('sha256').update(bytes).digest('hex');}catch{return false;}}
const DIR=process.env.TUVI_DATASET_DIR||(ready(indexedDefault)?indexedDefault:path.join(process.cwd(),'data','v4-vi'));
const indexed=fs.existsSync(path.join(DIR,'manifest.json'));
const packageReady=!indexed||ready(DIR);
const indexStore=new IndexedDataset(DIR),legacyCache=new DatasetMonthCache();
export const DIM_LABEL:Record<string,string>={overview:'Tổng quan',personality:'Tính cách',love:'Tình duyên',career:'Sự nghiệp',wealth:'Tài lộc',health:'Sức khoẻ',family:'Anh em',children:'Con cái',move:'Di chuyển',friends:'Bạn bè',home:'Nhà đất',spirit:'Phúc đức',parents:'Cha mẹ'};
function legacy(month:string,key:string):Record<string,string>|null{
  const file=path.join(DIR,month+'.jsonl.zst');
  if(!fs.existsSync(file))return null;
  const buffer=legacyCache.read(file,file=>zlib.zstdDecompressSync(fs.readFileSync(file),{params:{[zlib.constants.ZSTD_d_windowLogMax]:27}}));
  const start=buffer.indexOf(`{"k":"${key}"`);if(start<0)return null;
  const end=buffer.indexOf('\n',start);return JSON.parse(buffer.toString('utf8',start,end<0?undefined:end)).c;
}
/** Index xác nhận bản ghi tồn tại; việc đọc thật vẫn kiểm tra checksum/payload. */
export function hasReference(date:string,hour:number,gender:'nam'|'nu'){
  const key=referenceKey(date,hour,gender);if(!key||!packageReady)return false;
  try{return indexed?indexStore.has(key.month,key.key):!!legacy(key.month,key.key);}catch{return false;}
}
export function lookupReference(date:string,hour:number,gender:'nam'|'nu'):Record<string,string>|null{
  const key=referenceKey(date,hour,gender);if(!key||!packageReady)return null;
  try{
    const content=indexed?indexStore.read(key.month,key.key):legacy(key.month,key.key);
    return content?Object.fromEntries(Object.entries(content).map(([k,v])=>[k,polishTranslation(v)])):null;
  }catch{return null;}
}
export function datasetDiagnostics(){return {format:indexed?'record-zstd-v1':'legacy-month-zstd',ready:packageReady,...indexStore.stats};}
