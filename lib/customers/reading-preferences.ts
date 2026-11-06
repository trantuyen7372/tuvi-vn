import {get,run} from '../commerce/db';
import type {ReadingRow} from '../commerce/store';
import {validateInput,buildChart} from '../tuvi';
import {lookupReference} from '../dataset';
import {personalReading,READING_REVISION} from '../personal-reading';
import {validateReadingPreferences} from '../reading-preferences';

export function canPersonalize(row:ReadingRow,customerId?:string){
  if(!customerId||(process.env.READING_ENGINE||'dataset')!=='dataset'||row.status!=='done')return false;
  const revision=Number(row.text.match(/<!-- tuvi-reading:sao-cung-van-han-v(\d+) -->/)?.[1]||0);
  return revision>0&&revision<=READING_REVISION&&!!get('SELECT id FROM orders WHERE id=? AND customer_id=?',row.order_id,customerId)&&!get('SELECT reading_id FROM ai_usage WHERE reading_id=? LIMIT 1',row.id);
}
export function personalizeReading(customerId:string,token:string,raw:unknown){
  const preferences=validateReadingPreferences(raw);
  const row=get<ReadingRow>('SELECT * FROM readings WHERE token=?',token);
  if(!row||!canPersonalize(row,customerId))throw Error('Chỉ chủ tài khoản có thể cập nhật chủ đề cho bài luận này');
  const input=validateInput(JSON.parse(row.input));
  if(preferences)input.reading=preferences;else delete input.reading;
  const serialized=JSON.stringify(input);
  if(serialized===row.input)return;
  const chart=buildChart({...input,name:''}),text=personalReading(chart,lookupReference(chart.solarIso,input.hour,input.gender));
  const result=run("UPDATE readings SET input=?,text=?,email_status='not_sent' WHERE id=? AND status='done' AND input=? AND text=?",serialized,text,row.id,row.input,row.text);
  if(!Number(result.changes))throw Error('Bài vừa thay đổi ở phiên khác. Hãy tải lại trước khi lưu');
}
