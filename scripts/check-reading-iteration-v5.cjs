require('./register-server-only.cjs');
const fs=require('node:fs'),assert=require('node:assert/strict'),ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true,resolveJsonModule:true}}).outputText,filename);
const {buildChart}=require('../lib/tuvi.ts'),{readingTiming}=require('../lib/reading-timing.ts'),{periodRelations}=require('../lib/reading-periods.ts');
const {transformationChange}=require('../lib/reading-transitions.ts'),{deferredAtAge}=require('../lib/reading-life-stage.ts'),{READING_EDITION}=require('../lib/personal-reading.ts');
const folder=process.env.READING_REVIEW_FOLDER||'outputs/reading-editorial-v5',baseline=process.env.READING_BASELINE_FOLDER||folder+'/before',before=JSON.parse(fs.readFileSync(baseline+'/manifest.json','utf8'));
const next=JSON.parse(fs.readFileSync(folder+'/after/manifest.json','utf8')),regression=JSON.parse(fs.readFileSync(folder+'/regression/manifest.json','utf8'));
assert.equal(next.length,12);assert.equal(regression.length,12);
const all=[...next,...regression],articles=new Set(),shown=new Set(),available=new Set(),examples={};
for(const r of all){
  assert.equal(r.edition,READING_EDITION);const text=fs.readFileSync(r.file,'utf8'),c=buildChart(r.input),timing=readingTiming(c);
  assert.ok(r.insights.length>=3&&r.insights.length<=5,r.id);assert.equal(r.repeatedParagraphs,0,r.id);assert.ok(!articles.has(text));articles.add(text);
  assert.ok(!/undefined|NaN|có vô chính diệu|^\.$/m.test(text),r.id);
  const current=c.palaces.filter(p=>p.isDecadalNow);assert.ok(current.length<=1);
  for(const p of current)assert.ok(p.decadal[0]<=c.nominalAge&&p.decadal[1]>=c.nominalAge,r.id);
  if(!current.length)assert.equal(c.decadalNow,undefined);
  for(const i of r.insights){
    if(i.configuration){const cfg=i.configuration,p=c.palaces.find(p=>p.name===cfg.palace);assert.equal(p.branch,cfg.branch);assert.ok(cfg.type==='body'?p.isBody:p.major.length===0);}
    assert.ok(i.evidence.length||i.configuration,r.id+': điểm thiếu căn cứ');
    for(const e of i.evidence){const p=c.palaces.find(p=>p.name===e.palace),s=[...p.major,...p.minor].find(s=>s.name===e.star);assert.ok(s,r.id);
      if(e.brightness)assert.equal(e.brightness,s.brightness);
      if(e.layer==='bản mệnh'&&e.transformation)assert.equal(e.transformation,s.mutagen);
      if(e.layer==='đại hạn'){const d=timing.decades.find(d=>d.range[0]<=c.nominalAge&&d.range[1]>=c.nominalAge);assert.ok(d.transformations.some(t=>t.star===e.star&&t.type===e.transformation&&t.palace===e.palace));}
    }
  }
  for(const p of c.palaces)assert.ok(text.includes(`Căn cứ: ${p.name} tại ${p.branch}:`));
  for(const originalPeriod of [...timing.decades,...timing.years]){
    const period=originalPeriod.range&&originalPeriod.range[0]<=c.nominalAge&&originalPeriod.range[1]>=c.nominalAge?{...originalPeriod,age:c.nominalAge}:originalPeriod;
    for(const t of period.transformations){
      if(!t.palace||t.palace==='Tật Ách'||deferredAtAge(t.palace,period.age))continue;
      const p=c.palaces.find(p=>p.name===t.palace),s=[...p.major,...p.minor].find(s=>s.name===t.star);
      if(s?.mutagen&&s.mutagen!==t.type){const key=s.mutagen+'>'+t.type;available.add(key);assert.ok(transformationChange(s.mutagen,t.type,t.palace,period.age));}
    }
    for(const relation of periodRelations(c,period)){
      for(const e of relation.evidence){
        if(e.layer==='bản mệnh'){const p=c.palaces.find(p=>p.name===e.palace);assert.ok([...p.major,...p.minor].some(s=>s.name===e.star&&s.mutagen===e.transformation));}
        else{const t=e.layer==='lưu niên'?period.transformations:period.range?period.transformations:period.contextDecade.transformations;assert.ok(t.some(t=>t.star===e.star&&t.type===e.transformation&&t.palace===e.palace));}
      }
      if(relation.id==='natal-change'){const [a,b]=relation.evidence,key=a.transformation+'>'+b.transformation;shown.add(key);if(!examples[key])examples[key]={case:r.id,year:period.year,age:period.age,text:relation.text};}
    }
  }
  console.log(JSON.stringify({id:r.id,age:r.age,points:r.insights.length,repeatedParagraphs:r.repeatedParagraphs}));
}
const baby=next.find(r=>r.id==='S11'),babyText=fs.readFileSync(baby.file,'utf8'),oldBaby=fs.readFileSync(before.find(r=>r.id==='S11').file,'utf8');
assert.match(oldBaby,/Đại hạn đang xét: \*\*2–11/);assert.ok(!babyText.split('## Những điểm')[0].includes('Đại hạn đang xét:'));assert.match(babyText,/Chưa vào đại hạn đầu/);
const limit=fs.readFileSync(next.find(r=>r.id==='S12').file,'utf8');assert.match(limit,/nằm ngoài các khoảng đại hạn/);assert.ok(!limit.includes('### Năm 2101'));assert.ok(!limit.includes('## Các giai đoạn tiếp theo'));
const late=fs.readFileSync(next.find(r=>r.id==='S10').file,'utf8');assert.match(late,/quy ước chuyển sang ngày tiếp theo/);
const result={passed:true,newCases:next.length,regressionCases:regression.length,uniqueArticles:articles.size,availableTransitions:[...available].sort(),displayedTransitions:[...shown].sort(),examples,finished:new Date().toISOString()};
fs.writeFileSync(process.env.READING_CHECK_REPORT||'reports/reading-v5-checks.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({...result,examples:undefined}));
