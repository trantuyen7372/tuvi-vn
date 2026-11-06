import {buildChart,validateInput} from '../tuvi';
import {lookupReference} from '../dataset';
import {LEGACY_READING_INTRO,V1_READING_INTRO,READING_MARKER,READING_REVISION,personalReading} from '../personal-reading';
import {get,run} from './db';
import type {ReadingRow} from './store';

/** Nâng bản kho cũ khi xem lại, giữ token/lượt và không đụng bản biên tập riêng. */
export function upgradeLegacyReading(row:ReadingRow):ReadingRow{
  if((process.env.READING_ENGINE||'dataset')!=='dataset'||row.status!=='done'||row.text.includes(READING_MARKER))return row;
  const previous=row.text.match(/<!-- tuvi-reading:sao-cung-van-han-v(\d+) -->/),revision=previous?Number(previous[1]):0;
  if(revision>=READING_REVISION)return row;
  const isV1=row.text.startsWith('Ngày sinh dương lịch: **')&&row.text.includes(V1_READING_INTRO)&&row.text.includes('## Bốn năm sau năm đang xem')&&row.text.includes('## Kết luận về hướng phát triển');
  if(!row.text.includes(LEGACY_READING_INTRO)&&!isV1&&!revision)return row;
  if(get('SELECT reading_id FROM ai_usage WHERE reading_id=? LIMIT 1',row.id))return row;
  try{
    const input=validateInput(JSON.parse(row.input)),chart=buildChart({...input,name:''});
    const text=personalReading(chart,lookupReference(chart.solarIso,input.hour,input.gender));
    const updated=run("UPDATE readings SET text=? WHERE id=? AND status='done' AND text=?",text,row.id,row.text);
    return Number(updated.changes)?{...row,text}:row;
  }catch{
    // Không làm mất bài đang đọc nếu kho chưa sẵn sàng; không gọi dịch vụ bên ngoài.
    return row;
  }
}
