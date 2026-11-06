'use client';
import {useId,useState} from 'react';
import {READING_FOCUS,READING_SITUATIONS,type ReadingFocus,type ReadingPreferences as Preferences} from '@/lib/reading-preferences';
export default function ReadingPreferences({token,value,onSaved}:{token:string;value?:Preferences;onSaved:()=>Promise<unknown>}){
  const id=useId(),[focus,setFocus]=useState(value?.focus||''),[situation,setSituation]=useState(value?.situation||''),[note,setNote]=useState(value?.note||''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[message,setMessage]=useState('');
  async function save(e:React.FormEvent){e.preventDefault();setBusy(true);setError('');setMessage('');try{
    const response=await fetch('/api/account/readings/preferences',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,preferences:focus?{focus,situation,note}:null})}),data=await response.json();
    if(!response.ok)throw Error(data.error);await onSaved();setMessage('Đã cập nhật chủ đề trong bài, không dùng thêm lượt.');
  }catch(e){setError((e as Error).message);}finally{setBusy(false);}}
  return <details className="no-print mt-5 rounded-lg border border-[#d9c7a3] bg-[#fffaf0] p-4"><summary className="cursor-pointer font-bold">Chọn vấn đề bạn muốn đọc kỹ</summary><form onSubmit={save} className="mt-4 space-y-3">
    <p className="text-sm">Không bắt buộc. Lựa chọn giúp ưu tiên phần tổng hợp; bạn có thể đổi hoặc xóa mà không mất thêm lượt.</p>
    <label className="block text-sm" htmlFor={id+'-focus'}>Vấn đề quan tâm</label><select id={id+'-focus'} className="input" value={focus} onChange={e=>{setFocus(e.target.value);setSituation('');if(!e.target.value)setNote('');}}><option value="">Đọc tổng thể, không lưu hoàn cảnh</option>{Object.entries(READING_FOCUS).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select>
    {focus&&<><label className="block text-sm" htmlFor={id+'-situation'}>Hoàn cảnh hiện tại (tùy chọn)</label><select id={id+'-situation'} className="input" value={situation} onChange={e=>setSituation(e.target.value)}><option value="">Không cung cấp</option>{Object.entries(READING_SITUATIONS[focus as ReadingFocus]).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select>
      <label className="block text-sm" htmlFor={id+'-note'}>Điều muốn tìm hiểu (tùy chọn, tối đa 400 ký tự)</label><textarea id={id+'-note'} className="input" rows={3} maxLength={400} value={note} onChange={e=>setNote(e.target.value)}/><p className="text-xs">Ghi chú được lưu trong bài riêng để bạn đối chiếu. Không cần ghi thông tin nhạy cảm hoặc thông tin của người khác. Thông tin bạn cung cấp được phân biệt với căn cứ trên lá số.</p></>}
    <button className="btn-outline" disabled={busy}>{busy?'Đang cập nhật…':'Lưu chủ đề, không dùng thêm lượt'}</button>{error&&<p role="alert" className="text-sm text-son">{error}</p>}{message&&<p role="status" className="text-sm">{message}</p>}
  </form></details>;
}
