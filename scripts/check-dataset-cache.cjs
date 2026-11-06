require('./register-server-only.cjs');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),ts=require('typescript'),{performance}=require('node:perf_hooks'),zlib=require('node:zlib');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);
const {DatasetMonthCache}=require('../lib/dataset-cache.ts');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'tuvi-cache-')),file=n=>path.join(dir,n),cache=new DatasetMonthCache(8);let reads=0;
const decode=f=>{reads++;return fs.readFileSync(f);};
try{
 for(const n of ['a','b','c'])fs.writeFileSync(file(n),n.repeat(4));
 assert.equal(cache.read(file('a'),decode).toString(),'aaaa');cache.read(file('b'),decode);cache.read(file('a'),decode);assert.equal(reads,2);
 cache.read(file('c'),decode);cache.read(file('b'),decode);assert.equal(reads,4);assert.ok(cache.sizeBytes<=8);
 fs.writeFileSync(file('b'),'BBBB');fs.utimesSync(file('b'),new Date(),new Date(Date.now()+2000));assert.equal(cache.read(file('b'),decode).toString(),'BBBB');assert.equal(reads,5);
 fs.writeFileSync(file('large'),'123456789');cache.read(file('large'),decode);cache.read(file('large'),decode);assert.equal(reads,7);assert.ok(cache.sizeBytes<=8);
 fs.unlinkSync(file('b'));assert.throws(()=>cache.read(file('b'),decode));
 let attempts=0;assert.throws(()=>cache.read(file('a'),()=>{attempts++;throw Error('broken');}));cache.read(file('a'),()=>{attempts++;return Buffer.from('aaaa');});assert.equal(attempts,2);
 const month=path.resolve('data/v4-vi/1992-04.jsonl.zst'),raw=f=>zlib.zstdDecompressSync(fs.readFileSync(f),{params:{[zlib.constants.ZSTD_d_windowLogMax]:27}});
 const hot=new DatasetMonthCache(),iterations=12,expected=raw(month);const uncached=[],cached=[];
 for(let i=0;i<iterations;i++){let t=performance.now();const actual=raw(month);uncached.push(performance.now()-t);assert.deepEqual(actual,expected);}
 assert.deepEqual(hot.read(month,raw),expected);
 for(let i=0;i<iterations;i++){let t=performance.now();const actual=hot.read(month,raw);cached.push(performance.now()-t);assert.deepEqual(actual,expected);}
 const median=a=>[...a].sort((x,y)=>x-y)[Math.floor(a.length/2)];
 const report={passed:true,checks:['warm hit','LRU eviction','changed file invalidation','oversized file bypass','deleted file rejection','failed decode retry','real month byte equivalence'],scope:'Đọc/giải nén tháng dữ liệu, không phải tốc độ toàn trang hay tải đồng thời',iterations,uncompressedUtf8Bytes:Buffer.byteLength(expected),cacheBudgetBufferBytes:64*1024*1024,uncachedMedianMs:+median(uncached).toFixed(3),warmCachedMedianMs:+median(cached).toFixed(3),finished:new Date().toISOString()};
 const Module=require('node:module'),load=Module._load;
 Module._load=function(name,...args){return name==='server-only'?{}:load.call(this,name,...args);};
 const {lookupReference}=require('../lib/dataset.ts');Module._load=load;
 const {polishTranslation}=require('../lib/translation.ts');
 function legacyLookup(date,hour,gender){
  let [y,m,d]=date.split('-').map(Number);
  if(hour===12){const next=new Date(Date.UTC(y,m-1,d+1));[y,m,d]=[next.getUTCFullYear(),next.getUTCMonth()+1,next.getUTCDate()];hour=0;}
  const text=raw(path.resolve(`data/v4-vi/${y}-${String(m).padStart(2,'0')}.jsonl.zst`)).toString('utf8');
  const key=`{"k":"${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}-${hour}-${gender==='nu'?'female':'male'}"`;
  const start=text.indexOf(key);if(start<0)return null;const end=text.indexOf('\n',start);
  const content=JSON.parse(text.slice(start,end<0?undefined:end)).c;
  return Object.fromEntries(Object.entries(content).map(([k,v])=>[k,polishTranslation(v)]));
 }
 const cases=[['1992-04-09',4,'nam'],['1992-04-09',5,'nu'],['1992-04-30',12,'nam'],['2008-02-06',12,'nam'],['2023-03-26',0,'nu']];
 for(const args of cases)assert.deepEqual(lookupReference(...args),legacyLookup(...args));
 const fullOld=[],fullWarm=[],args=cases[0],expectedReference=legacyLookup(...args);lookupReference(...args);
 for(let i=0;i<7;i++){
  let t=performance.now(),actual=legacyLookup(...args);fullOld.push(performance.now()-t);assert.deepEqual(actual,expectedReference);
  t=performance.now();actual=lookupReference(...args);fullWarm.push(performance.now()-t);assert.deepEqual(actual,expectedReference);
 }
 Object.assign(report,{lookupCasesEquivalent:cases.length,lookupIterations:7,lookupUncachedMedianMs:+median(fullOld).toFixed(3),lookupWarmMedianMs:+median(fullWarm).toFixed(3),scope:'Đọc/giải nén và tra lời luận trên máy local, không phải tốc độ toàn trang hay tải đồng thời'});
 fs.writeFileSync('reports/dataset-cache-checks.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}finally{fs.rmSync(dir,{recursive:true,force:true});}
