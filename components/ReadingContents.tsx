'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {headingAnchor} from './reading-format';
export default function ReadingContents({text,readingKey}:{text:string;readingKey?:string}){
  const titles=useMemo(()=>[...new Set([...text.matchAll(/^## (.+)$/gm)].map(m=>m[1].trim()).filter(t=>/^[\p{L}\p{N}]/u.test(t)))],[text]);
  const [active,setActive]=useState(''),[open,setOpen]=useState(false),[resume,setResume]=useState(''),[floating,setFloating]=useState(false);
  const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement>(null),contents=useRef<HTMLDetailsElement>(null);
  useEffect(()=>{
    let disposed=false,frame=0,key='',last='';
    const ids=titles.map(headingAnchor);
    setResume('');setActive('');
    if(readingKey&&globalThis.crypto?.subtle)void crypto.subtle.digest('SHA-256',new TextEncoder().encode(readingKey)).then(buffer=>{
      if(disposed)return;
      key='tuvi-reading-position:'+Array.from(new Uint8Array(buffer),b=>b.toString(16).padStart(2,'0')).join('');
      try{const saved=localStorage.getItem(key);if(saved&&ids.includes(saved)&&!location.hash)setResume(saved);}catch{/* Bộ nhớ riêng tư có thể bị tắt. */}
    }).catch(()=>{});
    function update(save:boolean){
      setFloating((contents.current?.getBoundingClientRect().bottom??Infinity)<0);
      const headings=ids.map(id=>document.getElementById(id)).filter((h):h is HTMLElement=>!!h);
      const current=[...headings].reverse().find(h=>h.getBoundingClientRect().top<=130)||headings[0];
      if(!current)return;
      setActive(current.id);
      if(save&&key&&current.id!==last){last=current.id;try{localStorage.setItem(key,current.id);}catch{}}
    }
    function scroll(){if(!frame)frame=requestAnimationFrame(()=>{frame=0;update(true);});}
    update(false);window.addEventListener('scroll',scroll,{passive:true});
    return()=>{disposed=true;cancelAnimationFrame(frame);window.removeEventListener('scroll',scroll);};
  },[titles,readingKey]);
  useEffect(()=>{if(open)dialog.current?.showModal();else dialog.current?.close();},[open]);
  function jump(id:string){setOpen(false);setResume('');location.hash=id;document.getElementById(id)?.focus({preventScroll:true});}
  const links=titles.map(t=>{const id=headingAnchor(t);return <a key={t} className={active===id?'font-bold text-son underline':'underline'} aria-current={active===id?'location':undefined} href={'#'+id} onClick={()=>{setOpen(false);setResume('');}}>{t}</a>;});
  if(titles.length<3)return null;
  return <>
    {resume&&<div className="no-print mt-4 rounded-lg border border-[#d9c7a3] bg-[#fffaf0] p-3 text-sm"><p>Lần trước bạn đang đọc: <strong>{titles.find(t=>headingAnchor(t)===resume)}</strong>.</p><button className="btn-outline mt-2" onClick={()=>jump(resume)}>Đọc tiếp vị trí đã lưu</button><button className="ml-3 underline" onClick={()=>setResume('')}>Bỏ qua</button></div>}
    <details ref={contents} className="no-print my-5 rounded-lg border border-[#d9c7a3] bg-[#fffaf0] p-4"><summary className="cursor-pointer font-bold">Mục lục bài luận</summary><nav aria-label="Mục lục bài luận" className="mt-3 grid gap-x-5 gap-y-2 text-sm sm:grid-cols-2">{links}</nav></details>
    <button hidden={!floating} ref={trigger} className="no-print fixed bottom-4 right-4 z-30 max-w-[calc(100vw-2rem)] rounded-xl border border-[#d9c7a3] bg-[#fffaf0] px-4 py-3 text-sm font-bold text-son shadow-lg" aria-haspopup="dialog" onClick={()=>setOpen(true)}>Mục lục · {Math.max(1,titles.findIndex(t=>headingAnchor(t)===active)+1)}/{titles.length}</button>
    <dialog ref={dialog} onCancel={()=>setOpen(false)} onClose={()=>{setOpen(false);trigger.current?.focus({preventScroll:true});}} aria-labelledby="reading-navigation-title" className="no-print max-h-[80dvh] w-[calc(100%-2rem)] max-w-xl rounded-xl border border-[#d9c7a3] bg-[#fffaf0] p-5 text-[#2b2118] backdrop:bg-black/40">
      <div className="mb-4 flex items-center justify-between gap-3"><h2 id="reading-navigation-title" className="font-bold">Chọn phần muốn đọc</h2><button className="btn-outline" onClick={()=>setOpen(false)}>Đóng</button></div>
      <nav aria-label="Điều hướng nhanh bài luận" className="grid gap-4 text-sm">{links}</nav>
    </dialog>
  </>;
}
