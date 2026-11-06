require('./register-server-only.cjs');
const fs=require('node:fs'),ts=require('typescript'),assert=require('node:assert/strict'),crypto=require('node:crypto');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);
process.env.TUVI_DATASET_DIR='data/v5-indexed';
const {hasReference,lookupReference,datasetDiagnostics}=require('../lib/dataset.ts');
const local=JSON.parse(fs.readFileSync('data/v5-indexed/verification.json')),server=JSON.parse(fs.readFileSync('outputs/server-indexed-verification.json'));
assert.equal(local.records,674976);assert.equal(server.records,local.records);assert.deepEqual(local.indexSha256,server.indexSha256);
assert.equal(datasetDiagnostics().format,'record-zstd-v1');assert.equal(datasetDiagnostics().ready,true);
let checked=0;
for(let year=1950;year<=2026;year++)for(let month=1;month<=12;month++){assert.equal(hasReference(`${year}-${month}-1`,0,'nam'),true);checked++;}
assert.equal(hasReference('2026-12-31',12,'nam'),false);assert.equal(hasReference('1999-02-29',0,'nam'),false);
const existence=datasetDiagnostics();assert.equal(existence.frameReads,0);assert.equal(existence.frameDecompressions,0);
const sample=lookupReference('1992-04-09',4,'nam');assert.ok(sample.overview);assert.ok(datasetDiagnostics().frameBytes<4*1024*1024);
const report={passed:true,monthsMatched:924,recordsMatched:local.records,indexHashesMatchAcrossLocalAndServer:true,existenceChecks:checked,hasReferenceFrameReads:existence.frameReads,hasReferenceDecompressions:existence.frameDecompressions,storeAfterLookup:datasetDiagnostics(),finished:new Date().toISOString()};
fs.writeFileSync('reports/indexed-integration-checks.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
