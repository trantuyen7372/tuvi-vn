require('./register-server-only.cjs');
const fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true,resolveJsonModule:true}}).outputText,filename);
const Module=require('node:module'),original=Module._load;
Module._load=function(name,...args){return name==='server-only'?{}:original.call(this,name,...args);};
const {lookupReference}=require('../lib/dataset.ts');Module._load=original;
const {buildChart}=require('../lib/tuvi.ts'),{personalReading,READING_EDITION}=require('../lib/personal-reading.ts');
const {selectReadingInsights}=require('../lib/reading-insights.ts'),{readingTiming}=require('../lib/reading-timing.ts'),{careerBridge}=require('../lib/reading-career.ts');
const v5=process.argv.includes('--v5'),regression=process.argv.includes('--regression'),cases=require(v5&&!regression?'./reading-review-fixtures-v5.cjs':'./reading-review-fixtures.cjs'),phase=process.argv.includes('--before')?'before':'after',folder=process.env.READING_REVIEW_FOLDER||`outputs/${v5?'reading-editorial-v5':'reading-editorial'}/${regression?'regression':phase}`;
if(phase==='before'&&fs.existsSync(`${folder}/manifest.json`))throw Error('Đã có bản trước biên tập; không ghi đè bằng phiên bản mới.');
fs.mkdirSync(folder,{recursive:true});
function metrics(text){
  const paragraphs=text.split(/\n\s*\n/).map(s=>s.trim()).filter(s=>s&&!s.startsWith('#')&&!s.startsWith('<!--'));
  return {words:text.trim().split(/\s+/u).length,paragraphs:paragraphs.length,repeatedParagraphs:paragraphs.length-new Set(paragraphs).size,
    headings:(text.match(/^## /gm)||[]).length};
}
const manifest=[];
for(const fixture of cases){
  const {id,purpose,...birth}=fixture,input={...birth,name:''},chart=buildChart(input),reference=lookupReference(chart.solarIso,input.hour,input.gender);
  if(!reference)throw Error('Thiếu dữ liệu minh họa '+id);
  let text;
  try{text=personalReading(chart,reference);}catch(error){
    if(v5&&phase==='before'){manifest.push({id,purpose,input,age:chart.nominalAge,edition:READING_EDITION,error:error.message});console.log(JSON.stringify({id,error:error.message}));continue;}
    throw error;
  }
  const file=`${folder}/${id}.md`;
  fs.writeFileSync(file,text);
  const entry={id,purpose,input,age:chart.nominalAge,body:chart.palaces.find(p=>p.isBody)?.name,edition:READING_EDITION,file,...metrics(text),
    insights:selectReadingInsights(chart,readingTiming(chart)),careerRule:careerBridge(chart).id,
    palaces:chart.palaces.map(p=>({name:p.name,branch:p.branch,major:p.major,minor:p.minor,decadal:p.decadal,isDecadalNow:p.isDecadalNow}))};
  manifest.push(entry);console.log(JSON.stringify({id,age:entry.age,purpose,words:entry.words}));
}
fs.writeFileSync(`${folder}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');
