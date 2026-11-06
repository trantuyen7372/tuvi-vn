/** Cùng một quy tắc cho kiểm tra tồn tại và đọc bài, gồm Tý muộn qua tháng/năm. */
export function referenceKey(solarDate:string,hour:number,gender:'nam'|'nu'){
  if(!/^\d{4}-\d{1,2}-\d{1,2}$/.test(solarDate)||!Number.isInteger(hour)||hour<0||hour>12||!['nam','nu'].includes(gender))return null;
  let [y,m,d]=solarDate.split('-').map(Number);
  const date=new Date(Date.UTC(y,m-1,d));
  if(date.getUTCFullYear()!==y||date.getUTCMonth()+1!==m||date.getUTCDate()!==d)return null;
  if(hour===12){date.setUTCDate(date.getUTCDate()+1);[y,m,d]=[date.getUTCFullYear(),date.getUTCMonth()+1,date.getUTCDate()];hour=0;}
  const month=`${y}-${String(m).padStart(2,'0')}`;
  return {month,key:`${month}-${String(d).padStart(2,'0')}-${hour}-${gender==='nu'?'female':'male'}`};
}
