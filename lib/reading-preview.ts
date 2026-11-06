import type {ChartView} from './tuvi';
import {readingTiming} from './reading-timing';
import {selectReadingInsights} from './reading-insights';
import {readingOverview} from './personal-reading';
export function readingPreview(c:ChartView){
 const timing=readingTiming(c),insights=selectReadingInsights(c,timing),first=insights[0];
 const self=insights.find(i=>i.id!==first?.id&&(i.topic==='self'||i.topic==='body'));
 const current=timing.decades.find(p=>p.range&&p.range[0]<=c.nominalAge&&p.range[1]>=c.nominalAge);
 const pressure=c.palaces.find(p=>p.name!=='Tật Ách'&&(c.nominalAge>=18||!['Phu Thê','Tử Nữ'].includes(p.name))&&[...p.major,...p.minor].some(s=>s.mutagen==='Kỵ'));
 const questions=[pressure?`Hóa Kỵ bản mệnh tại ${pressure.name} cần được đọc cùng những yếu tố nào?`: 'Các sao tại Mệnh và Thân phối hợp với nhau thế nào?',current?`Đại hạn ${current.range!.join('–')} tuổi tại ${current.palace} và năm ${c.year} nhấn vào những chủ đề nào?`:`Năm ${c.year} có những chủ đề nào cần đối chiếu theo độ tuổi?`,...(timing.years.length>1?[`Các năm ${timing.years[1].year}–${timing.years.at(-1)!.year}: mặt thuận và điểm cần điều chỉnh khác nhau ra sao?`]:[])];
 return {text:readingOverview(c),excerpts:[first,self].filter((i):i is NonNullable<typeof i>=>!!i).map(i=>({title:i.title,text:i.summary})),questions};
}
