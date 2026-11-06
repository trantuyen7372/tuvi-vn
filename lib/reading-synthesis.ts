import type {ChartView} from './tuvi';
import type {ReadingPeriod,Transformation} from './reading-timing';
import type {ReadingFocus} from './reading-preferences';
import {palaceForAge,deferredAtAge} from './reading-life-stage';
import {gainEffect,frictionEffect} from './reading-effects';
import {STAR_MEANINGS} from './reading-rules';

const GROUPS=[
  {id:'career',palaces:['Quan Lộc','Tài Bạch'],title:'Vai trò và cách tạo thành quả',young:'Rèn kỹ năng và sử dụng sự hỗ trợ',meaning:'nối việc đảm nhận với kết quả và nguồn lực có thể duy trì',condition:'Vai trò, điều kiện thực hiện và cách ghi nhận công sức cần đi cùng nhau; mở rộng trách nhiệm chỉ có ý nghĩa khi khả năng theo việc đáp ứng được.'},
  {id:'relationship',palaces:['Phu Thê'],title:'Sự đồng hành và quyết định chung',young:'',meaning:'điều chỉnh nhu cầu gắn bó và cách cùng gánh việc lâu dài',condition:'Nếu có người đồng hành, điểm quyết định là cách trao đổi và chia trách nhiệm; nếu độc thân, đây là nhu cầu cần tìm hiểu, chưa phải một sự kiện hôn nhân.'},
  {id:'home',palaces:['Điền Trạch'],title:'Nơi ở và nền sinh hoạt',young:'Nền nếp sinh hoạt',meaning:'sắp xếp nền sinh hoạt phù hợp với các trách nhiệm thực tế',condition:'Nhu cầu về nơi chốn cần phù hợp thời gian, nguồn lực và thỏa thuận trong nhà; chỉ từ chủ đề cung chưa xác định việc mua bán hoặc chuyển chỗ ở.'},
  {id:'network',palaces:['Thiên Di','Nô Bộc'],title:'Môi trường và người cùng tham gia',young:'Môi trường học tập và hoạt động chung',meaning:'chọn môi trường và cách phối hợp giúp năng lực được sử dụng',condition:'Cơ hội từ bên ngoài cần được kiểm tra qua phần việc, tiêu chuẩn kết quả và cam kết của từng bên; quan hệ thuận lúc đầu vẫn cần cách phối hợp rõ.'},
  {id:'family',palaces:['Phụ Mẫu','Huynh Đệ','Tử Nữ'],title:'Vai trò giữa các thế hệ',young:'Sự hướng dẫn và chia sẻ trong gia đình',meaning:'làm rõ sự hỗ trợ, kỳ vọng và phần trách nhiệm trong gia đình, nếu có liên quan',condition:'Chỉ đọc những quan hệ có trong hoàn cảnh thực tế; mức hỗ trợ cần phù hợp khả năng và quyền tự quyết của mỗi người, không suy ra số con hay biến cố của người thân.'},
  {id:'self',palaces:['Mệnh','Phúc Đức'],title:'Cách tự quyết và nhịp sống',young:'Cách thích nghi và hình thành nền nếp',meaning:'điều chỉnh lựa chọn để phù hợp điều thực sự muốn duy trì',condition:'Sức bật khi bắt đầu cần đi cùng nền nếp có thể giữ được; kết quả bên ngoài và cảm giác an ổn là hai mặt cần đối chiếu riêng.'},
] as const;
export interface TrendSignal{kind:'position'|'natal'|'timed'|'decade';palace:string;star?:string;type?:string;brightness?:string}
export interface PeriodTrend{id:string;title:string;signals:TrendSignal[];direction:string;condition:string;focus:boolean}
const relevant=(id:string,focus?:ReadingFocus)=>id===focus||(focus==='family'&&id==='home');
export function periodTrends(c:ChartView,p:ReadingPeriod,focus?:ReadingFocus):PeriodTrend[]{
  const age=p.range&&p.range[0]<=c.nominalAge&&p.range[1]>=c.nominalAge?c.nominalAge:p.age;
  const candidates=GROUPS.map(g=>{
    const palaces=c.palaces.filter(palace=>(g.palaces as readonly string[]).includes(palace.name)&&!deferredAtAge(palace.name,age));
    const contains=(name:string|undefined)=>palaces.some(p=>p.name===name);
    const timed=p.transformations.filter(t=>contains(t.palace));
    const position=contains(p.palace),natal=palaces.flatMap(palace=>palace.major.map(s=>({kind:'natal' as const,palace:palace.name,star:s.name,type:s.mutagen,brightness:s.brightness})));
    // Không đủ căn cứ thì không ép đủ ba xu hướng. Nhu cầu khách chọn không thêm bằng chứng.
    if(!palaces.length||(!position&&!timed.length)||!natal.length)return undefined;
    const decade=p.contextDecade?.transformations.filter(t=>contains(t.palace))||[];
    const signals:TrendSignal[]=[...(position?[{kind:'position' as const,palace:p.palace}]:[]),...natal,
      ...timed.map(t=>({kind:'timed' as const,palace:t.palace!,star:t.star,type:t.type})),
      ...decade.map(t=>({kind:'decade' as const,palace:t.palace!,star:t.star,type:t.type}))];
    const effect=(t:Transformation)=>{const theme=palaceForAge(t.palace!,age);return t.type==='Lộc'?(age<18?theme.gain:gainEffect(t.star,theme.meaning,theme.gain)):t.type==='Quyền'?theme.power:t.type==='Khoa'?theme.craft:frictionEffect(t.star,theme.meaning,theme.friction);};
    const gain=timed.find(t=>t.type==='Lộc')||timed.find(t=>t.type==='Quyền')||timed.find(t=>t.type==='Khoa'),friction=timed.find(t=>t.type==='Kỵ');
    const foundation=natal.find(s=>s.palace===gain?.palace)||natal.find(s=>s.palace===p.palace)||natal[0];
    const star=STAR_MEANINGS[foundation.star!],nature=foundation.palace==='Quan Lộc'?star?.work:foundation.palace==='Tài Bạch'?star?.money:foundation.palace==='Phu Thê'?star?.bond:star?.core;
    const natalPressure=!friction?natal.find(s=>s.type==='Kỵ'):undefined;
    const weak=natal.find(s=>['Hãm','Bất'].includes(s.brightness||''));
    const direction=age<18?`Đọc qua ${palaces.map(p=>palaceForAge(p.name,age).meaning).join('; ')}.${timed.length?` Trong kỳ này, ${timed.map(t=>`${t.star} hóa ${t.type} tại ${t.palace}: ${effect(t)}`).join('; ')}.`:` Cung hạn tại ${p.palace} đặt trọng tâm cho hoạt động phù hợp độ tuổi.`}`:
      `Các yếu tố cùng chủ đề gợi hướng ${g.meaning}.${nature?` Nền bản mệnh có ${foundation.star} tại ${foundation.palace}, ${['Quan Lộc','Tài Bạch','Phu Thê'].includes(foundation.palace)?'gợi cách':'mang nét'} ${nature}.`:''}${gain?` Ở thời điểm này, ${gain.star} hóa ${gain.type} tại ${gain.palace}: ${effect(gain)}.`:''}${friction?` Điểm cần tháo gỡ nằm ở ${friction.palace}: ${effect(friction)}.`:''}${natalPressure?` Đồng thời, ${natalPressure.star} hóa Kỵ bản mệnh tại ${natalPressure.palace} là nét nền cần đọc cùng: ${frictionEffect(natalPressure.star!,palaceForAge(natalPressure.palace,age).meaning,palaceForAge(natalPressure.palace,age).friction)}; hóa của thời điểm chưa xóa nét nền này.`:''}`;
    const condition=age<18?'Điều cần đối chiếu là nhịp thích nghi, sự hướng dẫn và khả năng tham gia phù hợp độ tuổi; không đổi các dấu hiệu này thành nghề nghiệp, thu nhập hay sự kiện gia đình của người lớn.':
      (age>=65&&g.id==='career'?'Đặt trong hoạt động thực tế nếu còn tham gia, không mặc định đang đi làm hoặc đã nghỉ hưu. ':'')+g.condition+(weak?` ${weak.star} ở thế ${weak.brightness} tại ${weak.palace} cũng đòi hỏi đọc mặt khó phát huy, không chỉ nhìn các hóa thuận.`:'');
    return {id:g.id,title:age<18?g.young:g.title,signals,direction,condition,focus:relevant(g.id,focus),score:timed.length*3+Number(position)*3+Math.min(decade.length,2)+Number(relevant(g.id,focus))*2};
  }).filter((t):t is NonNullable<typeof t>=>!!t);
  return candidates.sort((a,b)=>b.score-a.score).slice(0,3).map(({score:_,...t})=>t);
}
export function periodSynthesis(c:ChartView,p:ReadingPeriod,focus?:ReadingFocus,explained=new Set<string>()){
  const trends=periodTrends(c,p,focus),layer=p.range?`đại hạn ${p.range.join('–')} tuổi`:`lưu niên ${p.year}`;
  if(!trends.length)return 'Chưa có đủ yếu tố cùng chủ đề để chọn xu hướng tổng hợp; xem các vị trí an sao trong phần chi tiết, không tự điền một dự báo.';
  const text=trends.map(t=>{
    const basis=t.signals.map(s=>s.kind==='position'?`${layer} tại ${s.palace}`:`${s.star}${s.brightness?` (${s.brightness})`:''}${s.type?` hóa ${s.type}`:''} tại ${s.palace} (${s.kind==='natal'?'bản mệnh':s.kind==='decade'?`đại hạn ${p.contextDecade!.range.join('–')} tuổi`:layer})`).join('; ');
    const key='condition:'+t.condition,first=!explained.has(key);explained.add(key);
    const directionKey='direction:'+t.direction,freshDirection=!explained.has(directionKey);explained.add(directionKey);
    return `**${t.title}${t.focus?' — liên quan chủ đề bạn chọn':''}.**${freshDirection?' '+t.direction:''}\n\n*Căn cứ tổng hợp:* ${basis}.${first?`\n\n*Điều kiện và giới hạn:* ${t.condition}`:''}`;
  }).join('\n\n');
  return text+(focus&&!trends.some(t=>t.focus)?'\n\nChủ đề bạn chọn chưa nằm trong các xu hướng có đủ yếu tố để ưu tiên ở kỳ này. Xem phần cung và hạn chi tiết; không tự thêm một dự báo chỉ để khớp mong muốn.':'');
}

export function stageChange(c:ChartView,before:ReadingPeriod|undefined,after:ReadingPeriod){
  if(!before||before.palace===after.palace)return '';
  const age=after.range&&after.range[0]<=c.nominalAge&&after.range[1]>=c.nominalAge?c.nominalAge:after.age;
  if(deferredAtAge(before.palace,age)||deferredAtAge(after.palace,age))return '';
  return `So với chặng trước đặt tại ${before.palace}, chặng này chuyển trọng tâm cung hạn sang ${after.palace}, tức ${palaceForAge(after.palace,age).meaning}. Đây là thay đổi chủ đề theo cách an hạn, chưa xác nhận hoàn cảnh đời sống đã thay đổi.`;
}
