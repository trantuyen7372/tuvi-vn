'use client';
import { useEffect, useState } from 'react';
import type { BirthInput } from '@/lib/birth-input';
import FunnelSection from './FunnelSection';
export default function FreePreview({ input }: { input: BirthInput }) {
  const [excerpts,setExcerpts]=useState<{title:string;text:string}[]>([]),[questions,setQuestions]=useState<string[]>([]);
  const [text,setText]=useState(''),[error,setError]=useState(''),[loading,setLoading]=useState(true);
  useEffect(()=>{
    const controller=new AbortController();setLoading(true);setText('');setExcerpts([]);setQuestions([]);setError('');
    fetch('/api/preview',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({input}),signal:controller.signal})
      .then(async res=>{const data=await res.json();if(!res.ok)throw Error(data.error);return data;})
      .then(data=>{setText(data.text||'');setExcerpts(data.excerpts||[]);setQuestions(data.questions||[]);})
      .catch(e=>{if(!controller.signal.aborted)setError(e.message);})
      .finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    return()=>controller.abort();
  },[input]);
  return <FunnelSection event="preview_view" className="reading-panel">
    <div aria-busy={loading}>
    <div className="flex flex-wrap items-center gap-2"><h2 className="font-serif text-2xl font-bold text-son">Đọc thử theo lá số của bạn</h2><span className="rounded-full bg-white px-3 py-1 text-xs">Miễn phí · không dùng lượt</span></div>
    <p className="mt-3 text-sm leading-relaxed text-[#6b5b45]">Các đoạn dưới đây được chọn theo bố cục sao và cung vừa lập, giúp bạn xem cách website diễn giải trước khi chọn bài đầy đủ.</p>
    {loading?<p role="status" className="mt-3">Đang lấy nội dung tham khảo…</p>:text?<div className="mt-3 space-y-4">{excerpts.length?excerpts.map(e=><div key={e.title}><h3 className="font-bold">{e.title}</h3><p className="mt-2 leading-relaxed">{e.text}</p></div>):<p className="leading-relaxed">{text}</p>}{questions.length>0&&<div className="rounded-lg border border-[#d9c7a3] bg-white p-4"><h3 className="font-bold">Các câu hỏi để đọc tiếp theo lá số này</h3><ul className="mt-3 space-y-2 text-sm">{questions.map(q=><li key={q}>🔎 {q}</li>)}</ul></div>}</div>:<p className="mt-3">{error||'Chưa có đoạn tổng quan cho ngày giờ này. Bạn vẫn xem được lá số, sao và cách cục miễn phí ở trên.'}</p>}
    <div className="mt-5 rounded-lg border border-[#d9c7a3] bg-white p-4"><h3 className="font-bold text-son">Bài đầy đủ bổ sung những gì?</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed"><li>Diễn giải đủ 12 cung và cách các sao phối hợp, thay vì chỉ xem từng sao riêng lẻ.</li><li>Đối chiếu đại hạn, năm đang chọn và tối đa bốn năm tiếp theo.</li><li>Lưu trong tài khoản để đọc lại và in hoặc lưu PDF; đọc lại không mất thêm lượt.</li></ul><div className="mt-4 flex flex-wrap gap-3"><a href="#mo-bai-luan" className="btn">Xem gói phù hợp với tôi</a><a href="/bai-luan-mau" className="btn-outline">Đọc trọn bài minh họa</a></div></div>
    <p className="mt-3 text-xs text-[#6b5b45]">Đây là phần tổng quan tham khảo từ kho nội dung, không phải toàn bộ bài luận. Các nhận định không phải dự đoán chắc chắn.</p>
    </div>
  </FunnelSection>;
}
