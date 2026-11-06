'use client';
import { useEffect, useState } from 'react';
import type { BirthInput } from '@/lib/birth-input';
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
  return <section className="rounded-xl border border-[#d9c7a3] bg-[#fffaf0] p-5" aria-busy={loading}>
    <div className="flex flex-wrap items-center gap-2"><h2 className="font-serif text-2xl font-bold text-son">Tổng quan miễn phí</h2><span className="rounded-full bg-white px-3 py-1 text-xs">Không dùng lượt</span></div>
    {loading?<p role="status" className="mt-3">Đang lấy nội dung tham khảo…</p>:text?<div className="mt-3 space-y-4">{excerpts.length?excerpts.map(e=><div key={e.title}><h3 className="font-bold">{e.title}</h3><p className="mt-2 leading-relaxed">{e.text}</p></div>):<p className="leading-relaxed">{text}</p>}{questions.length>0&&<div className="rounded-lg border border-[#d9c7a3] bg-white p-4"><div aria-hidden="true" className="pointer-events-none mb-3 space-y-2 opacity-40 blur-[2px]"><div className="h-2 rounded bg-[#d9c7a3]"/><div className="h-2 w-4/5 rounded bg-[#d9c7a3]"/></div><h3 className="font-bold">Những phần có trong bài đầy đủ</h3><ul className="mt-3 space-y-2 text-sm">{questions.map(q=><li key={q}>🔎 {q}</li>)}</ul><a href="#mo-bai-luan" className="btn-outline mt-4">Xem cách mở bài luận của tôi</a></div>}</div>:<p className="mt-3">{error||'Chưa có đoạn tổng quan cho ngày giờ này. Bạn vẫn xem được lá số, sao và cách cục miễn phí ở trên.'}</p>}
    <p className="mt-3 text-xs text-[#6b5b45]">Đây là phần tổng quan tham khảo. Bản luận giải đầy đủ sẽ đi sâu vào từng chủ đề; các nhận định không phải dự đoán chắc chắn. <a className="underline" href="/bai-luan-mau">Xem bài mẫu và cách đọc →</a></p>
  </section>;
}
