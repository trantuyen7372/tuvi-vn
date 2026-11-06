require('./register-server-only.cjs');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true,resolveJsonModule:true}}).outputText,filename);
const {buildChart}=require('../lib/tuvi.ts');
const {readingTiming}=require('../lib/reading-timing.ts');
const {personalReading}=require('../lib/personal-reading.ts');
const {combinationReading}=require('../lib/reading-rules.ts');
const {surroundingPalaces,developmentConnections,periodOpportunity,periodLayers,periodRelations,yearlyOverview}=require('../lib/reading-connections.ts');
const {selectReadingInsights}=require('../lib/reading-insights.ts'),{careerBridge}=require('../lib/reading-career.ts');
const {transformationChange}=require('../lib/reading-transitions.ts');
const {astro}=require('iztro');
const input={name:'',gender:'nam',calendar:'duong',date:'1992-04-09',hour:4,leap:false,year:2026};
const reference={overview:'NỘI_DUNG_THÔ_KHÔNG_ĐƯỢC_CHÉP'};
const checks=[];function test(name,fn){fn();checks.push(name);console.log('PASS '+name);}
const chart=buildChart(input),timing=readingTiming(chart),text=personalReading(chart,reference);
test('Lá số đối chiếu: đúng cung, tuổi và khoảng năm của ba đại hạn',()=>{
  assert.deepEqual(timing.decades.map(p=>[p.palace,p.range,p.year,p.endYear]),[
    ['Điền Trạch',[33,42],2024,2033],['Quan Lộc',[43,52],2034,2043],['Nô Bộc',[53,62],2044,2053]]);
});
test('Tứ hóa đại hạn gắn đúng sao và cung gốc, không nhầm với bản mệnh',()=>{
  assert.deepEqual(timing.decades[0].transformations.map(t=>[t.star,t.type,t.palace]),[
    ['Phá Quân','Lộc','Tài Bạch'],['Cự Môn','Quyền','Phụ Mẫu'],['Thái Âm','Khoa','Huynh Đệ'],['Tham Lang','Kỵ','Mệnh']]);
  assert.match(text,/Thiên Lương.*hóa Lộc bản mệnh/);
  assert.match(text,/Thái Dương hóa Kỵ đại hạn tại Điền Trạch gốc/);
});
test('Từng năm 2026–2030 có tứ hóa riêng tại đúng cung',()=>{
  assert.deepEqual(timing.years.map(p=>[p.year,p.age,p.palace,p.transformations[3].star,p.transformations[3].palace]),[
    [2026,35,'Thiên Di','Liêm Trinh','Phu Thê'],[2027,36,'Tật Ách','Cự Môn','Phụ Mẫu'],[2028,37,'Tài Bạch','Thiên Cơ','Nô Bộc'],[2029,38,'Tử Nữ','Văn Khúc','Tài Bạch'],[2030,39,'Phu Thê','Thiên Đồng','Phụ Mẫu']]);
});
test('Đủ 12 cung có căn cứ và diễn giải tổ hợp, không chép nguyên kho cũ',()=>{
  for(const p of chart.palaces)assert.ok(text.includes(`Căn cứ: ${p.name} tại ${p.branch}:`),p.name);
  assert.match(text,/Khi Tham Lang đi cùng Kình Dương/);assert.match(text,/Thân cư Tài Bạch/);
  assert.ok(!text.includes(reference.overview));assert.ok(!text.includes('undefined'));assert.ok(!/[\u4e00-\u9fff]/.test(text));
  assert.match(text,/không xác định số con/);assert.match(text,/không gán bệnh cho bạn/);
});
test('Vô chính diệu ghi đúng sao đối cung và không biến thành tọa thủ',()=>{
  const children=text.split('## Con cái')[1].split('## Sức khỏe')[0];
  assert.match(children,/Đối cung là \*\*Điền Trạch tại Mão/);assert.match(children,/Thái Dương/);assert.match(children,/Thiên Lương/);
  assert.match(children,/không coi những sao ấy đang tọa thủ tại Tử Nữ/);
});
test('Quy tắc tổ hợp chỉ bật khi thật sự cùng cung',()=>{
  const p=chart.palaces.find(p=>p.name==='Mệnh');
  assert.match(combinationReading(p),/Tham Lang đi cùng Kình Dương/);
  assert.equal(combinationReading({...p,minor:[]}), '');
});
test('Tam phương tứ chính đúng vị trí; hội chiếu không bị ghi thành đồng cung',()=>{
  const menh=chart.palaces.find(p=>p.name==='Mệnh'),s=surroundingPalaces(chart,menh);
  assert.deepEqual(s.trine.map(p=>[p.name,p.branch]),[['Quan Lộc','Thìn'],['Tài Bạch','Thân']]);assert.equal(s.opposite.name,'Thiên Di');assert.equal(s.opposite.branch,'Ngọ');
  const prose=developmentConnections(chart);assert.match(prose,/không trở thành sao đồng cung/);assert.match(prose,/quy trình, dẫn nhóm/);
});
test('Kịch bản cơ hội/điểm vướng chỉ bật khi đủ hai cung đúng lớp hạn',()=>{
  assert.match(periodOpportunity(timing.decades[0]),/nhịp quyết định/);
  assert.match(periodOpportunity(timing.years[2]),/đội ngũ chưa đi cùng nhịp/);
  const changed={...timing.years[2],transformations:timing.years[2].transformations.filter(t=>t.type!=='Kỵ')};assert.equal(periodOpportunity(changed),'');
  const health={...timing.years[2],transformations:timing.years[2].transformations.map(t=>t.type==='Kỵ'?{...t,palace:'Tật Ách'}:t)};assert.equal(periodOpportunity(health),'');
});
test('Tách bản mệnh và lưu niên khi cùng sao nhận hóa khác nhau',()=>{
  const p=timing.years.find(p=>p.year===2030),prose=periodLayers(chart,p);
  assert.match(prose,/bản mệnh/);assert.match(prose,/lưu niên/);
  assert.match(prose,/Không coi hóa này xóa hóa kia/);
});
test('Không bỏ mất quan hệ đại hạn–lưu niên khi đã giải thích bản mệnh',()=>{
  const p=timing.years.find(p=>p.year===2029),prose=periodLayers(chart,p);
  assert.match(prose,/Vũ Khúc hóa Kỵ bản mệnh/);assert.match(prose,/Vũ Khúc hóa Lộc lưu niên/);
  assert.match(prose,/Phá Quân hóa Lộc đại hạn tại Tài Bạch gốc/);assert.match(prose,/Văn Khúc hóa Kỵ lưu niên tại Tài Bạch gốc/);
  assert.match(prose,/Không coi hóa này xóa hóa kia/);
});
test('Tóm tắt năm chỉ dùng kỳ đã tính và không xuất dự báo y khoa',()=>{
  const overview=yearlyOverview(timing.years);assert.match(overview,/2026 — 35 tuổi âm/);assert.match(overview,/2030 — 39 tuổi âm/);assert.ok(!overview.includes('2031'));
  assert.match(text,/## Đường phát triển và các mối liên hệ chính/);assert.match(text,/## Nhìn nhanh các năm sắp tới/);
});
test('3–5 điểm trọng tâm có căn cứ thật, không cố lấp đầy bằng ý chung',()=>{
  const insights=selectReadingInsights(chart,timing);assert.ok(insights.length>=3&&insights.length<=5);assert.equal(new Set(insights.map(i=>i.topic)).size,insights.length);
  assert.ok(insights.some(i=>i.id==='natal-support'&&i.palaces.includes('Thiên Di')));
  for(const i of insights)for(const e of i.evidence){const p=chart.palaces.find(p=>p.name===e.palace);assert.ok(p);const s=[...p.major,...p.minor].find(s=>s.name===e.star);assert.ok(s);if(e.brightness)assert.equal(e.brightness,s.brightness);if(e.layer==='bản mệnh'&&e.transformation)assert.equal(e.transformation,s.mutagen);}
});
test('Liên kết nghề nghiệp chỉ bật khi có đủ sao tại đúng hai cung',()=>{
  assert.equal(careerBridge(chart).id,'sat-pha');const changed={...chart,palaces:chart.palaces.map(p=>p.name==='Tài Bạch'?{...p,major:[]}:p)};assert.notEqual(careerBridge(changed).id,'sat-pha');
  const source=buildChart({...input,date:'1988-08-08',hour:10,gender:'nu'});assert.equal(careerBridge(source).id,'liem-sat-vu-pha');
});
test('Sao hỗ trợ không che mất cặp chính tinh đồng cung',()=>{
  const p={...chart.palaces.find(p=>p.name==='Tài Bạch'),major:[{name:'Vũ Khúc',kind:'chinh'},{name:'Phá Quân',kind:'chinh'}],minor:[{name:'Hữu Bật',kind:'phu'}]};
  const text=combinationReading(p);assert.match(text,/Vũ Khúc cần kết quả đo được/);assert.match(text,/sao hỗ trợ/);
});
test('Các lớp hạn có bằng chứng đúng nguồn, không coi lặp hóa là nhân đôi may/rủi',()=>{
  let count=0;
  for(const p of [...timing.decades,...timing.years])for(const r of periodRelations(chart,p)){
    count++;for(const e of r.evidence){const source=e.layer==='bản mệnh'?chart.palaces.find(p=>p.name===e.palace):undefined;
      if(source)assert.ok([...source.major,...source.minor].some(s=>s.name===e.star&&s.mutagen===e.transformation));
      else{const transforms=e.layer==='lưu niên'?p.transformations:p.range?p.transformations:p.contextDecade.transformations;assert.ok(transforms.some(t=>t.star===e.star&&t.palace===e.palace&&t.type===e.transformation));}
    }
  }assert.ok(count>0);
});
test('Không tạo bài khi không có dữ liệu hỗ trợ',()=>{assert.throws(()=>personalReading(chart,null));assert.throws(()=>personalReading(chart,{overview:''}));});
test('Năm cuối phạm vi không bịa thêm lưu niên ngoài 2100',()=>{
  const c=buildChart({...input,date:'2000-01-01',year:2100});assert.deepEqual(readingTiming(c).years.map(p=>p.year),[2100]);assert.doesNotThrow(()=>personalReading(c,reference));
});
test('Chuỗi năm đi qua ranh giới đại hạn chuyển đúng nền cho từng năm',()=>{
  const t=readingTiming(buildChart({...input,year:2032}));
  assert.equal(t.years.find(p=>p.year===2033).contextDecade.palace,'Điền Trạch');
  assert.equal(t.years.find(p=>p.year===2034).contextDecade.palace,'Quan Lộc');
  assert.deepEqual(t.years.find(p=>p.year===2034).contextDecade.range,[43,52]);
});
test('Trẻ chưa vào đại hạn không bị gán đại hạn đầu là hiện tại',()=>{
  const c=buildChart({...input,date:'2026-06-01',year:2026}),t=personalReading(c,reference);
  assert.match(t,/chưa có đại hạn tương ứng/);
  assert.equal(c.decadalNow,undefined);assert.ok(!c.palaces.some(p=>p.isDecadalNow));assert.ok(!t.split('## Những điểm')[0].includes('Đại hạn đang xét:'));
});
test('Ngoài tuổi có dữ liệu hạn và sát năm 2100 không bịa hạn/năm tiếp',()=>{
  const c=buildChart({...input,date:'1964-09-22',year:2100}),text=personalReading(c,reference);
  assert.equal(c.decadalNow,undefined);assert.match(text,/nằm ngoài các khoảng đại hạn/);assert.ok(!text.includes('## Các giai đoạn tiếp theo'));assert.ok(!text.includes('### Năm 2101'));
  const partial=personalReading(buildChart({...input,year:2099}),reference);assert.match(partial,/## Năm tiếp theo/);assert.ok(!partial.includes('## Bốn năm sau năm đang xem'));assert.ok(!partial.includes('### Năm 2101'));
});
test('Đổi hóa có ý nghĩa riêng, tách trách nhiệm khỏi chỗ cần tháo gỡ',()=>{
  const power=transformationChange('Lộc','Quyền','Tài Bạch',35),block=transformationChange('Lộc','Kỵ','Tài Bạch',35);
  assert.match(power,/quyền chủ động/);assert.match(block,/cần tháo gỡ/);assert.notEqual(power,block);
  const types=['Lộc','Quyền','Khoa','Kỵ'],unique=new Set();for(const from of types)for(const to of types)if(from!==to){const text=transformationChange(from,to,'Mệnh',35);assert.ok(text);unique.add(text);}assert.equal(unique.size,12);
  assert.equal(transformationChange('Lộc','Quyền','Tật Ách',35),'');assert.equal(transformationChange('Kỵ','Lộc','Phu Thê',10),'');
});
test('Giờ Tý muộn ở giao thừa có cùng lá số với Tý sớm hôm sau',()=>{
  const late=buildChart({...input,date:'2008-02-06',hour:12}),early=buildChart({...input,date:'2008-02-07',hour:0});
  assert.equal(late.nominalAge,early.nominalAge);assert.equal(late.lunarText,early.lunarText);
  assert.deepEqual(late.palaces.map(p=>[p.name,p.major,p.decadal]),early.palaces.map(p=>[p.name,p.major,p.decadal]));
  assert.deepEqual(readingTiming(late).decades,readingTiming(early).decades);
});
test('Trong cùng đại hạn đi qua tuổi trưởng thành, diễn giải dùng tuổi đang xem',()=>{
  let selected;
  for(let hour=0;hour<13;hour++){
    const c=buildChart({...input,date:'2007-03-10',hour,year:2026}),p=readingTiming(c).decades.find(p=>p.range[0]<=c.nominalAge&&p.range[1]>=c.nominalAge);
    const gain=p.transformations.find(t=>t.type==='Lộc'&&['Quan Lộc','Tài Bạch'].includes(t.palace));
    if(gain){selected={c,hour,gain};break;}
  }
  assert.ok(selected);assert.equal(selected.c.nominalAge,20);
  const adult=personalReading(selected.c,reference).split('## Đại hạn hiện tại')[1].split('## Các giai đoạn')[0];
  const teenChart=buildChart({...input,date:'2007-03-10',hour:selected.hour,year:2022}),teen=personalReading(teenChart,reference).split('## Đại hạn hiện tại')[1].split('## Các giai đoạn')[0];
  assert.equal(teenChart.nominalAge,16);assert.deepEqual(readingTiming(teenChart).decades[0].range,readingTiming(selected.c).decades[0].range);
  assert.match(adult,/có thể tạo điều kiện thuận cho/);
  assert.ok(!adult.includes('có thêm điều kiện hoặc hỗ trợ cho việc học và sinh hoạt'));
  assert.ok(teen.includes(selected.gain.palace==='Quan Lộc'?'có điều kiện khám phá khả năng và học thêm kỹ năng':'có thêm điều kiện hoặc hỗ trợ cho việc học và sinh hoạt'));
});
test('Lộc mang nghĩa riêng theo sao; phối hợp hóa đã giải thích không viết lại nguyên đoạn',()=>{
  const {gainEffect}=require('../lib/reading-effects.ts');
  assert.notEqual(gainEffect('Phá Quân','công việc',''),gainEffect('Thái Âm','công việc',''));
  assert.match(gainEffect('Phá Quân','công việc',''),/thay một cách làm/);
  const seen=new Map(),p=timing.years.find(p=>p.year===2029);
  const first=periodLayers(chart,p,seen),again=periodLayers(chart,{...p,year:2039},seen);
  assert.match(first,/Bản mệnh và thời điểm/);assert.match(again,/đã giải thích ở năm 2029/);
  assert.ok(!again.includes('Cách đọc ở'));assert.match(again,/Phá Quân hóa Lộc đại hạn/);
});
test('Tổng hợp giai đoạn chỉ dùng vị trí, sao và hóa của đúng kỳ',()=>{
  const {periodTrends}=require('../lib/reading-synthesis.ts');
  const fixtures=[...require('./reading-review-fixtures.cjs'),...require('./reading-review-fixtures-v5.cjs')];
  let checked=0;
  for(const fixture of fixtures){const c=buildChart({...fixture,name:''}),timing=readingTiming(c);
    for(const p of [...timing.decades,...timing.years]){
      const trends=periodTrends(c,p,'career');assert.ok(trends.length<=3);assert.equal(new Set(trends.map(t=>t.id)).size,trends.length);
      for(const t of trends){assert.ok(t.signals.some(s=>s.kind==='natal'));assert.ok(t.signals.some(s=>['timed','position'].includes(s.kind)));
        for(const s of t.signals){assert.notEqual(s.palace,'Tật Ách');const palace=c.palaces.find(p=>p.name===s.palace);assert.ok(palace);
          if(s.kind==='position')assert.equal(s.palace,p.palace);
          else if(s.kind==='natal')assert.ok(palace.major.some(star=>star.name===s.star&&star.mutagen===s.type&&star.brightness===s.brightness));
          else assert.ok((s.kind==='timed'?p.transformations:p.contextDecade.transformations).some(star=>star.star===s.star&&star.type===s.type&&star.palace===s.palace));
        }
      }
      checked++;
    }
  }assert.ok(checked>150);
});
test('Chủ đề và hoàn cảnh không đổi lá số, URL hoặc định danh lượt',()=>{
  const {validateInput,inputToQuery,readingIdentity}=require('../lib/tuvi.ts');
  const {preferencesText,validateReadingPreferences}=require('../lib/reading-preferences.ts');
  const {userPrompt,SYSTEM_PROMPT}=require('../lib/prompt.ts');
  const custom=validateInput({...input,reading:{focus:'career',situation:'changing',note:'## Ghi chú [link](https://example.com)'}});
  assert.deepEqual(readingIdentity(custom),readingIdentity(validateInput(input)));
  assert.equal(inputToQuery(custom),inputToQuery(input));
  assert.deepEqual(buildChart(custom).palaces,chart.palaces);
  assert.match(preferencesText(custom.reading,35),/chưa được xác minh/);
  assert.ok(!preferencesText(custom.reading,35).includes('## Ghi chú'));
  const customChart=buildChart(custom);
  assert.ok(!require('../lib/prompt.ts').chartToText(customChart).includes('example.com'));
  const promptWithPref=userPrompt(customChart,'');
  assert.match(promptWithPref,/<tam_su_nguoi_xem>/);
  assert.match(promptWithPref,/Công việc và nguồn lực/);
  assert.match(promptWithPref,/Đang cân nhắc đổi hướng/);
  assert.ok(!promptWithPref.includes('## Ghi chú'));
  assert.ok(!/\bAI\b/i.test(SYSTEM_PROMPT));
  assert.throws(()=>validateReadingPreferences({focus:'__proto__'}));
  assert.throws(()=>validateReadingPreferences({focus:'career',situation:'partnered'}));
  assert.throws(()=>validateReadingPreferences({focus:'career',note:'a'.repeat(401)}));
});
test('Lịch âm tháng nhuận dùng đúng cách lập lá số của thư viện',()=>{
  const c=buildChart({...input,calendar:'am',date:'2023-02-05',leap:true,gender:'nu'}),t=readingTiming(c);
  const a=astro.byLunar('2023-2-5',4,'女',true,true,'vi-VN'),h=a.horoscope(new Date('2026-07-01T12:00:00+07:00'),4);
  assert.equal(t.years[0].palace,a.palaces[h.yearly.index].name);assert.deepEqual(t.years[0].transformations.map(t=>t.star),h.yearly.mutagen);
});
test('Nâng bài kho cũ giữ token, lượt và số lần tạo; không ghi đè bản biên tập riêng',()=>{
  const os=require('node:os'),Module=require('node:module');
  process.env.TUVI_DB_PATH=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'tuvi-reading-')),'test.sqlite');
  process.env.READING_ENGINE='dataset';
  const originalLoad=Module._load;
  Module._load=function(name,...args){return name==='server-only'?{}:originalLoad.call(this,name,...args);};
  let upgradeLegacyReading;try{({upgradeLegacyReading}=require('../lib/commerce/upgrade-reading.ts'));}finally{Module._load=originalLoad;}
  const {get,run}=require('../lib/commerce/db.ts'),{createOrder,reserveReading,credits}=require('../lib/commerce/store.ts');
  const {LEGACY_READING_INTRO,READING_MARKER,V1_READING_INTRO}=require('../lib/personal-reading.ts');
  run('INSERT INTO coupons VALUES (?,?,?,?)','READINGTEST',100,1,Date.now()+60000);
  const {order}=createOrder('reading-test@example.com','single',input,'READINGTEST','payos');
  const row=reserveReading(order,input);run("UPDATE readings SET status='done',text=?,attempts=1 WHERE id=?",LEGACY_READING_INTRO+'\nBản cũ',row.id);
  const legacy=get('SELECT * FROM readings WHERE id=?',row.id),before=credits(order.id),upgraded=upgradeLegacyReading(legacy);
  assert.match(upgraded.text,/## Các giai đoạn tiếp theo/);assert.equal(upgraded.token,row.token);assert.equal(upgraded.attempts,1);assert.equal(credits(order.id),before);
  assert.equal(get('SELECT text FROM readings WHERE id=?',row.id).text,upgraded.text);
  assert.equal(upgradeLegacyReading(upgraded),upgraded);
  const v1=V1_READING_INTRO+'\n## Bốn năm sau năm đang xem\n## Kết luận về hướng phát triển';
  run('UPDATE readings SET text=? WHERE id=?','Ngày sinh dương lịch: **01/01/2000**\n'+v1,row.id);
  const oldRules=get('SELECT * FROM readings WHERE id=?',row.id),v2=upgradeLegacyReading(oldRules);assert.ok(v2.text.includes(READING_MARKER));assert.equal(credits(order.id),before);
  run('UPDATE readings SET text=? WHERE id=?','<!-- tuvi-reading:sao-cung-van-han-v3 -->',row.id);assert.ok(upgradeLegacyReading(get('SELECT * FROM readings WHERE id=?',row.id)).text.includes(READING_MARKER));assert.equal(credits(order.id),before);
  const future={...legacy,text:'<!-- tuvi-reading:sao-cung-van-han-v99 -->'};assert.equal(upgradeLegacyReading(future),future);
  const editorial={...legacy,text:'Bản đọc thử biên tập riêng'};assert.equal(upgradeLegacyReading(editorial),editorial);
  process.env.READING_ENGINE='anthropic';assert.equal(upgradeLegacyReading(legacy),legacy);process.env.READING_ENGINE='dataset';
});
let scanned=0,unique=new Set();
test('Quét 78 lá số khác ngày, giờ và giới tính: đối chiếu các kỳ với iztro độc lập',()=>{
  const dates=['1950-01-01','1976-02-01','1988-08-08','2000-01-01','2012-12-31','2026-06-01'];
  for(const date of dates)for(let hour=0;hour<=12;hour++){
    const gender=hour%2?'nu':'nam',c=buildChart({...input,date,hour,gender}),t=readingTiming(c),body=personalReading(c,reference);
    const a=astro.bySolar(date,hour,gender==='nu'?'女':'男',true,'vi-VN');
    for(const p of t.years){const h=a.horoscope(new Date(`${p.year}-07-01T12:00:00+07:00`),hour);
      assert.equal(p.palace,a.palaces[h.yearly.index].name);assert.deepEqual(p.transformations.map(t=>t.star),h.yearly.mutagen);
      for(const transform of p.transformations){const source=a.palaces.find(p=>[...p.majorStars,...p.minorStars].some(s=>s.name===transform.star));assert.equal(transform.palace,source?.name);}
    }
    for(const p of c.palaces)assert.ok(body.includes(`Căn cứ: ${p.name} tại ${p.branch}:`));
    assert.ok(!body.includes('undefined'));assert.ok(!body.includes(reference.overview));unique.add(body);scanned++;
  }
  assert.equal(unique.size,scanned);
});
fs.mkdirSync('outputs/reading-review',{recursive:true});fs.writeFileSync('outputs/reading-review/personal-reading.md',text);
fs.writeFileSync('reports/reading-tests.json',JSON.stringify({passed:checks.length,scanned,unique:unique.size,checks,finished:new Date().toISOString()},null,2)+'\n');
console.log(JSON.stringify({passed:checks.length,scanned,unique:unique.size}));
