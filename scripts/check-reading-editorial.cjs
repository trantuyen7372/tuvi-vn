require('./register-server-only.cjs');
const fs=require('node:fs'),assert=require('node:assert/strict'),ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true,resolveJsonModule:true}}).outputText,filename);
const {buildChart}=require('../lib/tuvi.ts'),{readingTiming}=require('../lib/reading-timing.ts'),{periodRelations}=require('../lib/reading-periods.ts');
const {READING_EDITION}=require('../lib/personal-reading.ts');
const before=JSON.parse(fs.readFileSync('outputs/reading-editorial/before/manifest.json','utf8'));
const after=JSON.parse(fs.readFileSync('outputs/reading-editorial/after/manifest.json','utf8'));
assert.equal(after.length,12);const seen=new Set(),relations=new Set(),rules=new Set();let beforeChars=0,afterChars=0;
for(const r of after){
  assert.equal(r.edition,READING_EDITION,'Cần sinh lại bản sau khi thay cách luận');
  const text=fs.readFileSync(r.file,'utf8'),chart=buildChart(r.input),timing=readingTiming(chart),current=timing.decades.find(p=>p.range&&p.range[0]<=chart.nominalAge&&p.range[1]>=chart.nominalAge);
  assert.ok(r.insights.length>=3&&r.insights.length<=5,r.id);assert.equal(new Set(r.insights.map(i=>i.topic)).size,r.insights.length,r.id);
  for(const insight of r.insights){assert.ok(insight.summary.trim());assert.ok(insight.palaces.length);
    for(const e of insight.evidence){const palace=chart.palaces.find(p=>p.name===e.palace);assert.ok(palace,r.id);const star=[...palace.major,...palace.minor].find(s=>s.name===e.star);assert.ok(star,r.id);
      if(e.brightness)assert.equal(e.brightness,star.brightness,r.id);
      if(e.layer==='bản mệnh'&&e.transformation)assert.equal(e.transformation,star.mutagen,r.id);
      if(e.layer==='đại hạn')assert.ok(current.transformations.some(t=>t.star===e.star&&t.type===e.transformation&&t.palace===e.palace),r.id);
    }
  }
  for(const palace of chart.palaces)assert.ok(text.includes(`Căn cứ: ${palace.name} tại ${palace.branch}:`),r.id);
  assert.ok(!/undefined|NaN|có vô chính diệu|^\.$/m.test(text),r.id);
  assert.equal(r.repeatedParagraphs,0,'Còn đoạn lặp nguyên văn: '+r.id);assert.ok(!seen.has(text));seen.add(text);
  if(chart.nominalAge<18){
    assert.ok(!r.insights.some(i=>i.id.startsWith('career-')),r.id);
    const years=text.split('## Vận năm')[1].split('## Kết luận')[0];assert.ok(!/khai thác năng lực nghề nghiệp|thu nhập|trách nhiệm nghề nghiệp|được bổ nhiệm/.test(years),r.id);
  }
  if(chart.nominalAge>=65)assert.ok(text.includes('không giả định người đọc đang làm việc hay đã nghỉ hưu'),r.id);
  for(const period of [...timing.decades,...timing.years])for(const relation of periodRelations(chart,period)){
    relations.add(relation.id);for(const e of relation.evidence){
      if(e.layer==='bản mệnh'){const palace=chart.palaces.find(p=>p.name===e.palace);assert.ok([...palace.major,...palace.minor].some(s=>s.name===e.star&&s.mutagen===e.transformation),r.id);}
      else{const source=e.layer==='lưu niên'?period.transformations:period.range?period.transformations:period.contextDecade.transformations;assert.ok(source.some(t=>t.star===e.star&&t.palace===e.palace&&t.type===e.transformation),r.id);}
    }
  }
  const old=before.find(b=>b.id===r.id);beforeChars+=fs.readFileSync(old.file,'utf8').length;afterChars+=text.length;rules.add(r.careerRule);
  console.log(JSON.stringify({id:r.id,points:r.insights.length,careerRule:r.careerRule,repeatedParagraphs:r.repeatedParagraphs,beforeWords:old.words,afterWords:r.words}));
}
const r1=after.find(r=>r.id==='R01');assert.ok(!r1.insights.some(i=>i.id==='natal-pressure'),'Không đếm trùng một Kỵ lặp đúng ở đại hạn');
const r3=fs.readFileSync(after.find(r=>r.id==='R03').file,'utf8').split('## Tính cách')[1].split('## Công danh')[0];assert.match(r3,/sự chần chừ/);assert.ok(!r3.includes('sốt ruột'));
assert.equal(after.find(r=>r.id==='R09').careerRule,'vu-phu-tu-tuong');
const result={cases:after.length,passed:true,uniqueArticles:seen.size,careerLinksObserved:rules.size,periodRelationsObserved:[...relations],beforeCharacters:beforeChars,afterCharacters:afterChars,shorterPercent:Math.round((1-afterChars/beforeChars)*1000)/10,finished:new Date().toISOString()};
fs.mkdirSync('reports',{recursive:true});fs.writeFileSync('reports/reading-editorial-checks.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
