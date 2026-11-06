import type {ChartView,PalaceView} from './tuvi';
import type {ReadingPeriod,Transformation} from './reading-timing';
import {PALACE_MEANINGS,STAR_MEANINGS,starLabel} from './reading-rules';
import {careerBridgeText} from './reading-career';
import {frictionEffect} from './reading-effects';
export {periodOpportunity,periodLayers,periodRelations} from './reading-periods';

function names(p:PalaceView){return p.major.length?p.major.map(starLabel).join(', '):'vô chính diệu';}
export function surroundingPalaces(c:ChartView,p:PalaceView){
  const index=c.palaces.indexOf(p);
  if(index<0||c.palaces.length!==12)throw Error('Không đủ cấu trúc 12 cung');
  return {trine:[c.palaces[(index+4)%12],c.palaces[(index+8)%12]],opposite:c.palaces[(index+6)%12]};
}
export function developmentConnections(c:ChartView){
  const menh=c.palaces.find(p=>p.name==='Mệnh')!,{trine,opposite}=surroundingPalaces(c,menh);
  const placement=(p:PalaceView)=>`${p.name} tại ${p.branch}, ${p.major.length?'có ':''}${names(p)}`;
  const parts=[`**Tam phương tứ chính của Mệnh:** hai cung tam hợp là **${trine.map(placement).join('** và **')}**; đối cung là **${placement(opposite)}**. Đây là quan hệ hội chiếu; các sao ở những cung này không trở thành sao đồng cung với Mệnh.`];
  if(c.nominalAge>=18)parts.push(careerBridgeText(c));
  else parts.push('Ở tuổi đang xem, trục nghề nghiệp–nguồn lực được đọc như định hướng dài hạn. Phần gần hơn để đối chiếu là cách học, thích nghi và sự hỗ trợ từ môi trường.');
  const di=opposite.major.map(s=>STAR_MEANINGS[s.name]?.work).filter(Boolean).join('; ');
  if(di&&c.nominalAge>=18)parts.push(`**Khi ra môi trường bên ngoài:** ${opposite.name} có ${names(opposite)}, gợi cách ${di}. Đối chiếu lúc tự làm với lúc phối hợp trong một nhóm: cùng một năng lực có thể được sử dụng khác nhau theo vai trò và môi trường.`);
  return parts.join('\n\n');
}
export function yearlyOverview(periods:ReadingPeriod[]){
  return periods.map(p=>{
    const gain=p.transformations.find(t=>t.type==='Lộc'),friction=p.transformations.find(t=>t.type==='Kỵ');
    const describe=(t:Transformation|undefined,good:boolean)=>!t?.palace?'Chưa xác định':t.palace==='Tật Ách'?'Chỉ ghi nhận vị trí an sao':`${t.palace}: ${good?PALACE_MEANINGS[t.palace].gain:frictionEffect(t.star,PALACE_MEANINGS[t.palace].meaning,PALACE_MEANINGS[t.palace].friction)}`;
    if(p.age<18)return `**${p.year} — ${p.age} tuổi âm:** lưu niên tại ${p.palace}. Đọc trong sinh hoạt, học tập và quan hệ phù hợp độ tuổi; phần căn cứ tứ hóa nằm bên dưới.`;
    return `**${p.year} — ${p.age} tuổi âm:** ${PALACE_MEANINGS[p.palace].meaning}.\n\n- Mặt thuận để đối chiếu — ${describe(gain,true)}.\n- Điểm cần tháo gỡ — ${describe(friction,false)}.`;
  }).join('\n\n');
}
