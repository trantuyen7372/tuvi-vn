require('./register-server-only.cjs');
const fs=require('node:fs'),path=require('node:path'),tar=require('node:child_process');
const root='outputs/reading-review-v7',participant=root+'/tai-lieu-doc-thu';fs.mkdirSync(participant,{recursive:true});
const mapping=[];
for(const phase of ['after','regression']){
 const rows=JSON.parse(fs.readFileSync(`outputs/reading-editorial-v7/${phase}/manifest.json`,'utf8'));
 for(const row of rows){
  const before=fs.readFileSync(`outputs/reading-editorial-v6/${phase}/${row.id}.md`,'utf8'),after=fs.readFileSync(row.file,'utf8');
  const versions=Number(row.id.slice(1))%2?[['A',after,'v7'],['B',before,'v6']]:[['A',before,'v6'],['B',after,'v7']];
  for(const [label,text,version] of versions){
   // Chỉ hồ sơ tổng hợp; bỏ ngày sinh đầu bài và dấu phiên bản khỏi bản đọc so sánh.
   const clean=text.replace(/^Ngày sinh dương lịch:.*\n\n/u,'').replace(/<!-- tuvi-reading:[^>]+ -->/g,'').trim();
   fs.writeFileSync(`${participant}/${row.id}-${label}.md`,`# Hồ sơ tổng hợp ${row.id} — bản ${label}\n\nTuổi đang xem: ${row.age} tuổi âm.\n\n${clean}\n`);
   mapping.push({case:row.id,label,version});
  }
 }
}
const protocol=fs.readFileSync('reports/PHIEU-DANH-GIA-BAI-LUAN.md','utf8');fs.writeFileSync(participant+'/HUONG-DAN-VA-PHIEU.md',protocol);
fs.writeFileSync(root+'/doi-chieu-phien-ban-noi-bo.json',JSON.stringify(mapping,null,2)+'\n');
const fixtures=[...require('./reading-review-fixtures.cjs'),...require('./reading-review-fixtures-v5.cjs')];
fs.writeFileSync(participant+'/THONG-SO-TONG-HOP.md','# Thông số hồ sơ tổng hợp dành cho người đối chiếu an sao\n\nĐây là thông số kiểm thử, không phải hồ sơ khách hàng. Giờ dùng chỉ số iztro 0–12; 12 là Tý muộn. Dùng quy ước Việt ngữ, an ngày Tý muộn sang hôm sau, tuổi âm.\n\n'+fixtures.map(f=>`- ${f.id}: ${f.calendar==='am'?'Âm':'Dương'} lịch ${f.date}, giờ chỉ số ${f.hour}, ${f.gender}, nhuận ${!!f.leap}, năm xem ${f.year}.`).join('\n')+'\n');
const ts=require('typescript'),Module=require('node:module');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);
const load=Module._load;Module._load=function(name,...args){return name==='server-only'?{}:load.call(this,name,...args);};
const {lookupReference}=require('../lib/dataset.ts');Module._load=load;
const {buildChart,validateInput}=require('../lib/tuvi.ts'),{personalReading}=require('../lib/personal-reading.ts');
const scenarios=[
 ['C01','S07',{focus:'career',situation:'changing',note:'Muốn đọc kỹ điều kiện thực hiện khi cân nhắc đổi hướng.'}],
 ['C02','S09',{focus:'relationship',situation:'single',note:'Muốn hiểu nhu cầu đồng hành, chưa đặt kế hoạch kết hôn.'}],
 ['C03','S11',{focus:'family',situation:'parents',note:'Quan tâm nền nếp và cách người lớn hỗ trợ.'}],
];
for(const [id,caseId,reading] of scenarios){
 const source=fixtures.find(f=>f.id===caseId),input=validateInput({...source,name:'',reading}),chart=buildChart(input);
 const text=personalReading(chart,lookupReference(chart.solarIso,input.hour,input.gender)).replace(/^Ngày sinh dương lịch:.*\n\n/u,'').replace(/<!-- tuvi-reading:[^>]+ -->/g,'').trim();
 fs.writeFileSync(`${participant}/${id}-CO-HOAN-CANH.md`,`# Ví dụ hoàn cảnh tự khai ${id} — nền hồ sơ ${caseId}\n\nThông tin và ghi chú hoàn toàn là ví dụ tổng hợp, không phải phản hồi khách hàng.\n\n${text}\n`);
}
tar.execFileSync('tar',['-czf',path.resolve(root+'/tai-lieu-doc-thu.tar.gz'),'-C',root,'tai-lieu-doc-thu'],{env:{...process.env,COPYFILE_DISABLE:'1'}});
console.log(JSON.stringify({cases:fixtures.length,versions:48,contextExamples:3,participantArchive:root+'/tai-lieu-doc-thu.tar.gz',realReviews:0}));
