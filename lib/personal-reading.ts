import type {ChartView,PalaceView} from './tuvi';
import {readingTiming,type ReadingPeriod,type Transformation} from './reading-timing';
import {PALACE_MEANINGS,STAR_MEANINGS,palaceEvidence,starReading,modifiersReading,combinationReading,starLabel} from './reading-rules';
import {developmentConnections,periodOpportunity,periodLayers,yearlyOverview} from './reading-connections';
import {selectReadingInsights,readingInsightsText,ageContext} from './reading-insights';
import {frictionEffect,gainEffect} from './reading-effects';
import {palaceForAge,deferredAtAge,missingDecadeText} from './reading-life-stage';
import {periodSynthesis,stageChange} from './reading-synthesis';
import {preferencesText} from './reading-preferences';

export const READING_REVISION=7;
export const READING_EDITION=`sao-cung-van-han-v${READING_REVISION}`;
export const READING_MARKER=`<!-- tuvi-reading:${READING_EDITION} -->`;
export const V1_READING_INTRO='Bài luận đối chiếu sao, cung và các lớp hạn trên lá số.';
export const LEGACY_READING_INTRO='Bản luận được tổng hợp từ lời luận tham khảo khớp với lá số này.';
const SECTIONS:[string,string][]=[['Mệnh','Tính cách'],['Quan Lộc','Công danh, sự nghiệp'],['Tài Bạch','Tài lộc'],['Phu Thê','Tình duyên, gia đạo'],['Điền Trạch','Nhà cửa'],['Thiên Di','Thiên Di — môi trường bên ngoài'],['Nô Bộc','Bạn bè và cộng sự'],['Phúc Đức','Phúc đức'],['Phụ Mẫu','Cha mẹ'],['Huynh Đệ','Anh chị em'],['Tử Nữ','Con cái']];
function byName(c:ChartView,name:string){return c.palaces.find(p=>p.name===name)!;}
function names(p:PalaceView){return p.major.length?p.major.map(starLabel).join(', '):'vô chính diệu';}

export function readingOverview(chart:ChartView){
  const menh=byName(chart,'Mệnh'),career=byName(chart,'Quan Lộc'),wealth=byName(chart,'Tài Bạch');
  const theme=menh.major.map(s=>STAR_MEANINGS[s.name]?.core).filter(Boolean).join('; '),current=chart.palaces.find(p=>p.isDecadalNow);
  const position=`Mệnh tại ${menh.branch} ${menh.major.length?'có ':''}${names(menh)}`;
  if(chart.nominalAge<18)return `${position}${theme?`, gợi nét ${theme}`:''}. Ở tuổi đang xem, đối chiếu qua cách học, sinh hoạt và tương tác phù hợp độ tuổi. Các cung công danh, nguồn lực và đồng hành được đọc như chủ đề dài hạn, không giả định người đọc đã đi làm hoặc có gia đình.`;
  return `${position}${theme?`, gợi nét ${theme}`:'; cần đọc thêm chính tinh đối cung'}. Quan Lộc ${career.major.length?'có ':''}${names(career)}, Tài Bạch ${wealth.major.length?'có ':''}${names(wealth)}: cần nối cách lựa chọn, vai trò nghề nghiệp và cách tạo thành quả. ${current?`Năm ${chart.year}, đại hạn ${current.decadal.join('–')} tuổi âm tại ${current.name} nhấn vào ${PALACE_MEANINGS[current.name].meaning}.`:''}`;
}

function palaceText(c:ChartView,p:PalaceView,detailed:boolean,bodyCovered:boolean){
  const theme=PALACE_MEANINGS[p.name],parts=[palaceEvidence(p)];
  if(deferredAtAge(p.name,c.nominalAge))return parts.join('\n\n')+'\n\n'+(p.name==='Phu Thê'?'Cung quan hệ đồng hành được ghi nhận như cấu trúc dài hạn, chưa luận quan hệ đôi lứa ở độ tuổi đang xem.':'Cung Tử Nữ được ghi nhận như cấu trúc dài hạn; phần này không xác định số con, giới tính hay khả năng sinh sản, và chưa mô tả chuyện con cái ở tuổi đang xem.');
  const youngWork=c.nominalAge<18&&['Quan Lộc','Tài Bạch'].includes(p.name);
  if(youngWork){
    if(p.major.length)parts.push(p.major.map(s=>`${s.name} gợi nét ${STAR_MEANINGS[s.name]?.core||'cần đọc cùng toàn cục'}`).join('; ')+'.');
    parts.push(p.name==='Quan Lộc'?'Các tính chất tại đây được đọc qua việc rèn kỹ năng và tham gia nhiệm vụ phù hợp độ tuổi; chưa gán một nghề hoặc chức vụ.':'Ở độ tuổi này, nguồn lực được đọc qua thời gian, đồ dùng và sự hỗ trợ đang có; chưa gán thu nhập hoặc thành quả nghề nghiệp.');
    return parts.join('\n\n');
  }
  if(p.major.length)parts.push(starReading(p,p.major,true));
  else{
    const opposite=c.palaces[(c.palaces.indexOf(p)+6)%12];
    parts.push(`Vô chính diệu không có nghĩa là thiếu lĩnh vực này. Đối cung là **${opposite.name} tại ${opposite.branch}, ${opposite.major.length?'có ':''}${names(opposite)}**. Đọc theo quan hệ chiếu sang, không coi những sao ấy đang tọa thủ tại ${p.name}.`);
    if(detailed&&opposite.major.length)parts.push(opposite.major.map(s=>`${s.name} bổ sung nét ${STAR_MEANINGS[s.name]?.core||'cần đọc cùng toàn cục'}`).join('; ')+'.');
  }
  const combo=combinationReading(p),modifiers=modifiersReading(p,detailed?3:2);
  if(combo)parts.push(combo);
  if(modifiers)parts.push(modifiers);
  if(detailed){
    if(c.nominalAge<18&&['Quan Lộc','Tài Bạch','Phu Thê'].includes(p.name))parts.push('Lĩnh vực này được đọc cho quá trình trưởng thành về sau, không gán một nghề, thu nhập hoặc quan hệ đôi lứa hiện tại.');
    else parts.push(`**Đối chiếu thực tế:** ${theme.scene[0].toLocaleUpperCase('vi')+theme.scene.slice(1)}.`);
  }
  if(p.isBody&&!bodyCovered)parts.push(`Thân cư ${p.name} làm lĩnh vực ${theme.meaning} trở thành một trọng tâm khi đọc quá trình trưởng thành.`);
  if(p.name==='Phu Thê')parts.push(c.nominalAge<18?'Đây là cung quan hệ đồng hành về sau; chưa dùng để suy ra tình trạng tình cảm ở độ tuổi đang xem.':'Nếu đã có gia đình, đối chiếu qua việc đang cùng gánh; nếu độc thân, đọc như nhu cầu gắn bó, không suy ra số lần kết hôn.');
  if(p.name==='Tử Nữ')parts.push('Phần này không xác định số con, giới tính, khả năng sinh sản hay kết quả của một lần mang thai. Nếu chưa có con, các nét trên chưa phải mô tả hoàn cảnh hiện tại.');
  return parts.join('\n\n');
}

function transformText(t:Transformation,layer:string,age:number){
  if(!t.palace)return `**${t.star} hóa ${t.type} ${layer}:** chưa đối chiếu được vị trí sao.`;
  if(t.palace==='Tật Ách')return `**${t.star} hóa ${t.type} ${layer} tại Tật Ách gốc:** chỉ ghi nhận vị trí an sao.`;
  if(deferredAtAge(t.palace,age))return `**${t.star} hóa ${t.type} ${layer} tại ${t.palace} gốc:** ghi nhận cấu trúc dài hạn, chưa diễn giải chuyện đôi lứa hoặc con cái ở độ tuổi này.`;
  const theme=palaceForAge(t.palace,age),effect=t.type==='Lộc'?(age<18?theme.gain:gainEffect(t.star,theme.meaning,theme.gain)):t.type==='Quyền'?theme.power:t.type==='Khoa'?theme.craft:frictionEffect(t.star,theme.meaning,theme.friction);
  return `**${t.star} hóa ${t.type} ${layer} tại ${t.palace} gốc:** ${effect}.`;
}
function periodText(c:ChartView,p:ReadingPeriod,layer:string,explained:Map<string,string>){
  // Đại hạn lưu tuổi đầu kỳ, nhưng phần diễn giải dùng tuổi đang xem nếu đã ở giữa kỳ.
  const interpretation=p.range&&p.range[0]<=c.nominalAge&&p.range[1]>=c.nominalAge?{...p,age:c.nominalAge}:p;
  const base=byName(c,p.palace),lines=[`**${p.stem} ${p.branch}; ${p.range?`đại hạn ${p.range.join('–')} tuổi âm`:`${p.age} tuổi âm, Lưu niên Mệnh`}, tại cung gốc ${p.palace}.** Cung này ${base.major.length?'có ':''}**${names(base)}**.`];
  if(p.range&&p.age<18&&p.range[1]>=18)lines.push('Đầu giai đoạn này còn thuộc tuổi đi học; các chủ đề nghề nghiệp và nguồn lực chỉ được đọc như định hướng về sau.');
  lines.push(p.transformations.map(t=>'- '+transformText(t,layer,interpretation.age)).join('\n'));
  if(p.contextDecade)lines.push(`Năm ${p.year} thuộc đại hạn **${p.contextDecade.range.join('–')} tuổi tại ${p.contextDecade.palace}**, đặt nền cho ${palaceForAge(p.contextDecade.palace,p.age).meaning}.${p.age===p.contextDecade.range[0]?' Đây là năm đầu của đại hạn mới theo tuổi âm.':''}`);
  const opportunity=periodOpportunity(interpretation),layers=periodLayers(c,interpretation,explained);
  if(opportunity)lines.push(opportunity);
  if(layers)lines.push(layers);
  return lines.join('\n\n');
}

export function personalReading(chart:ChartView,reference:Record<string,string>|null){
  if(!reference||!Object.values(reference).some(v=>v.trim()))throw Error('Kho lời luận hiện hỗ trợ ngày sinh dương lịch từ 1950 đến 2026. Ngày giờ này chưa có dữ liệu; bạn vẫn có thể xem lá số miễn phí.');
  const timing=readingTiming(chart),insights=selectReadingInsights(chart,timing),explained=new Map<string,string>();
  const stages=timing.decades.length?timing.decades:timing.years.slice(0,1);
  const explainedTrends=new Set<string>();
  const menh=byName(chart,'Mệnh'),wealth=byName(chart,'Tài Bạch'),career=byName(chart,'Quan Lộc'),body=chart.palaces.find(p=>p.isBody),current=chart.palaces.find(p=>p.isDecadalNow);
  const focus=new Set([...(chart.nominalAge<18?['Mệnh','Phụ Mẫu']:['Mệnh','Quan Lộc','Tài Bạch']),...insights.map(i=>i.palaces[0])]);
  const missing=missingDecadeText(chart.nominalAge,chart.palaces.map(p=>p.decadal));
  const firstAge=Math.min(...chart.palaces.map(p=>p.decadal[0])),lastAge=Math.max(...chart.palaces.map(p=>p.decadal[1]));
  const missingSummary=chart.nominalAge<firstAge?`Chưa vào đại hạn đầu, bắt đầu từ ${firstAge} tuổi âm.`:chart.nominalAge>lastAge?'Tuổi đang xem nằm ngoài phạm vi đại hạn hiện có.':'Chưa đối chiếu được đại hạn hiện tại.';
  const context=ageContext(chart),lines=[`Ngày sinh dương lịch: **${chart.solarDate}** · Âm lịch: **${chart.lunarText}** · ${chart.time} (${chart.timeRange}) · ${chart.input.gender==='nu'?'Nữ':'Nam'} · Năm xem **${chart.year}**, ${chart.nominalAge} tuổi âm.`,
    `${V1_READING_INTRO} Đây là diễn giải Tử Vi truyền thống, mang tính tham khảo; tình huống là khả năng để đối chiếu, không xác nhận sự kiện đã hoặc chắc chắn sẽ xảy ra. Tuổi dùng tuổi âm; khoảng năm của đại hạn quy đổi theo năm âm lịch.`,
    `## Tổng quan bản mệnh\n\n**Mệnh ${names(menh)} — Tài Bạch ${names(wealth)} — Quan Lộc ${names(career)}.** ${body?`Thân cư **${body.name}**; `:''}Cục **${chart.cuc}**.\n\n${current?`Đại hạn đang xét: **${current.decadal.join('–')} tuổi tại ${current.name}**.`:missingSummary}${context?'\n\n'+context:''}${chart.input.hour===12?'\n\nVới giờ Tý muộn (23h–24h), cách an sao đang dùng quy ước chuyển sang ngày tiếp theo. Ngày âm dùng để lập lá số có thể khác khi đổi sang canh giờ trước đó.':''}`,
    `## Những điểm cần đọc kỹ nhất\n\n${readingInsightsText(insights)}`,
    `## Xu hướng chính theo từng giai đoạn\n\n${preferencesText(chart.input.reading,chart.nominalAge)}${chart.input.reading?'\n\n':''}Các xu hướng dưới đây nối các yếu tố cùng chủ đề, không phải các sự kiện đã được xác nhận hoặc thứ hạng về khả năng xảy ra.\n\n${stages.map((p,index)=>`### ${p.range?`${p.range.join('–')} tuổi âm — khoảng ${p.year}–${p.endYear}`:`Năm ${p.year}`}\n\n${index&&stageChange(chart,stages[index-1],p)?stageChange(chart,stages[index-1],p)+'\n\n':''}${periodSynthesis(chart,p,chart.input.reading?.focus,explainedTrends)}`).join('\n\n')}`,
    `## Đường phát triển và các mối liên hệ chính\n\n${developmentConnections(chart)}`,
    'Trong các phần cung bên dưới, miếu/vượng/đắc là trạng thái được truyền thống đánh giá có điều kiện phát huy sở trường; hãm/bất nhấn vào mặt khó phát huy. Trạng thái sáng không làm mất tác động của sao đi kèm, và một sao khó không quyết định toàn bộ cung.'];
  for(const [palace,title]of SECTIONS)lines.push(`## ${title}\n\n${palaceText(chart,byName(chart,palace),focus.has(palace),insights.some(i=>i.id==='body-'+palace))}`);
  lines.push(`## Sức khỏe\n\n${palaceEvidence(byName(chart,'Tật Ách'))}\n\nVị trí sao không đủ cơ sở để chẩn đoán bệnh, dự báo tai nạn hoặc tuổi thọ; bài không gán bệnh cho bạn. Sức khỏe thực tế cần được đánh giá qua triệu chứng, thăm khám và người có chuyên môn y tế.`);
  const now=timing.decades.find(p=>p.range&&p.range[0]<=chart.nominalAge&&p.range[1]>=chart.nominalAge),next=timing.decades.filter(p=>p!==now);
  lines.push(`## Đại hạn hiện tại\n\n${now?`Khoảng **${now.year}–${now.endYear}**.\n\n${periodText(chart,now,'đại hạn',explained)}`:missing}`);
  if(next.length)lines.push(`## Các giai đoạn tiếp theo\n\n${next.map(p=>`### ${p.range!.join('–')} tuổi âm — khoảng ${p.year}–${p.endYear}\n\n${periodText(chart,p,'đại hạn',explained)}`).join('\n\n')}`);
  lines.push(`## Nhìn nhanh các năm sắp tới\n\n${yearlyOverview(timing.years)}`);
  lines.push(`## Vận năm ${chart.year}\n\n${periodText(chart,timing.years[0],'lưu niên',explained)}`);
  const futureHeading=['','Năm tiếp theo','Hai năm tiếp theo','Ba năm tiếp theo','Bốn năm sau năm đang xem'][timing.years.length-1];
  if(timing.years.length>1)lines.push(`## ${futureHeading}\n\n${timing.years.slice(1).map(p=>`### Năm ${p.year} — ${p.age} tuổi âm\n\n${periodText(chart,p,'lưu niên',explained)}`).join('\n\n')}`);
  lines.push(`## Kết luận về hướng phát triển\n\n${timing.decades.length?timing.decades.map(p=>`**${p.range!.join('–')} tuổi:** ${PALACE_MEANINGS[p.palace].meaning}`).join('; ')+'.':'Chưa có đại hạn tương ứng để nối thành chuỗi giai đoạn.'}\n\nĐọc các chặng trên cùng những điểm trọng tâm ở đầu bài. Mốc hạn thay đổi chủ đề cần khảo sát, không tự tạo ra chức vụ, tài sản hoặc một biến cố gia đình. Chưa xét lưu nguyệt, lưu nhật hay hoàn cảnh đang diễn ra để định một sự kiện cụ thể.\n\nTử Vi mang tính tham khảo, cuộc sống do chính mình quyết định.`);
  return lines.join('\n\n')+'\n\n'+READING_MARKER;
}
