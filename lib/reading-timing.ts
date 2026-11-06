import {astro} from 'iztro';
import type {ChartView, PalaceView} from './tuvi';

export const TRANSFORMATIONS = ['Lộc', 'Quyền', 'Khoa', 'Kỵ'] as const;
export interface Transformation {
  type: typeof TRANSFORMATIONS[number];
  star: string;
  /** Vị trí trên lá số gốc, không phải tên cung đã xoay theo hạn. */
  palace?: string;
}
export interface ReadingPeriod {
  year: number; age: number; stem: string; branch: string; palace: string;
  range?: [number, number]; endYear?: number; transformations: Transformation[];
  contextDecade?: {palace:string;range:[number,number];transformations:Transformation[]};
}
export interface ReadingTiming {decades: ReadingPeriod[]; years: ReadingPeriod[]}
function locate(palaces: PalaceView[], stars: string[]): Transformation[] {
  return stars.map((star, i) => ({type: TRANSFORMATIONS[i], star,
    palace: palaces.find(p => [...p.major, ...p.minor].some(s => s.name === star))?.name}));
}
/** Tính từng kỳ thực tế bằng iztro; không dùng tứ hóa năm hiện tại cho năm sau. */
export function readingTiming(chart: ChartView): ReadingTiming {
  const i=chart.input, [y,m,d]=i.date.split('-').map(Number), date=`${y}-${m}-${d}`;
  const a=i.calendar==='am'
    ? astro.byLunar(date,i.hour,i.gender==='nu'?'女':'男',i.leap,true,'vi-VN')
    : astro.bySolar(date,i.hour,i.gender==='nu'?'女':'男',true,'vi-VN');
  const birthYear=a.rawDates.lunarDate.lunarYear;
  const at=(year:number)=>a.horoscope(new Date(`${year}-07-01T12:00:00+07:00`),i.hour);
  const years: ReadingPeriod[]=[];
  for(let year=chart.year;year<=Math.min(chart.year+4,2100);year++){
    const h=at(year);
    const decade=chart.palaces[h.decadal.index];
    years.push({year,age:h.age.nominalAge,stem:h.yearly.heavenlyStem,branch:h.yearly.earthlyBranch,
      palace:chart.palaces[h.yearly.index]?.name||'',transformations:locate(chart.palaces,h.yearly.mutagen),
      contextDecade:decade&&decade.decadal[0]<=h.age.nominalAge&&decade.decadal[1]>=h.age.nominalAge?{palace:decade.name,range:decade.decadal,transformations:locate(chart.palaces,h.decadal.mutagen)}:undefined});
  }
  const decades: ReadingPeriod[]=[];
  const upcoming=chart.palaces.filter(p=>p.decadal[1]>=chart.nominalAge)
    .sort((a,b)=>a.decadal[0]-b.decadal[0]).slice(0,3);
  for(const p of upcoming){
    const year=birthYear+p.decadal[0]-1,endYear=birthYear+p.decadal[1]-1;
    if(year>2100)continue;
    const h=at(year), actual=chart.palaces[h.decadal.index];
    if(!actual||actual.name!==p.name||!actual.decadal.every((v,n)=>v===p.decadal[n]))throw Error('Không đối chiếu được đại hạn với lá số');
    decades.push({year,endYear,age:p.decadal[0],range:p.decadal,stem:h.decadal.heavenlyStem,
      branch:h.decadal.earthlyBranch,palace:p.name,transformations:locate(chart.palaces,h.decadal.mutagen)});
  }
  return {decades,years};
}
export function timingToText(timing: ReadingTiming): string {
  return [...timing.decades,...timing.years].map(p=>
    `${p.range?`Đại hạn ${p.range.join('–')} tuổi âm, khoảng ${p.year}–${p.endYear}`:`Năm ${p.year}, ${p.age} tuổi âm`}: ${p.stem} ${p.branch}, tại cung gốc ${p.palace}; `+
    p.transformations.map(t=>`${t.star} hóa ${t.type} tại cung gốc ${t.palace||'chưa xác định'}`).join('; ')
  ).join('\n');
}
