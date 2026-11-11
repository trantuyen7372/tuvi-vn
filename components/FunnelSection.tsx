'use client';
import {useEffect,useRef,type ReactNode} from 'react';
import {trackFunnel} from '@/lib/funnel-client';
export default function FunnelSection({children,event,id,className,labelledBy}:{children:ReactNode;event:'pricing_view'|'preview_view';id?:string;className?:string;labelledBy?:string}) {
  const ref=useRef<HTMLElement>(null);
  useEffect(()=>{
    if(!ref.current||!('IntersectionObserver' in window))return;
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){void trackFunnel(event);observer.disconnect();}
    },{threshold:0.1});
    observer.observe(ref.current);return()=>observer.disconnect();
  },[event]);
  return <section ref={ref} id={id} className={className} aria-labelledby={labelledBy}>{children}</section>;
}
