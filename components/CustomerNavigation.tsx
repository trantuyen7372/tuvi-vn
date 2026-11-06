'use client';
import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import {AUTH_CHANGED,AUTH_STORAGE_KEY} from '@/lib/customers/client';

export default function CustomerNavigation({variant='navigation'}:{variant?:'navigation'|'home'}){
  const pathname=usePathname(),[signedIn,setSignedIn]=useState<boolean|null>(null);
  useEffect(()=>{
    let active=true,request:AbortController|undefined;
    async function refresh(){
      request?.abort();const controller=new AbortController();request=controller;
      try{
        const response=await fetch('/api/auth/me',{cache:'no-store',credentials:'same-origin',signal:controller.signal});
        if(!response.ok)return;
        const result=await response.json();
        if(active&&!controller.signal.aborted)setSignedIn(!!result.customer);
      }catch{/* Giữ trạng thái đang biết khi mất kết nối; không giả định đã đăng xuất. */}
    }
    const onVisible=()=>{if(document.visibilityState==='visible')void refresh();};
    const onStorage=(event:StorageEvent)=>{if(event.key===AUTH_STORAGE_KEY||event.key===null)void refresh();};
    const onRefresh=()=>{void refresh();};
    void refresh();
    window.addEventListener(AUTH_CHANGED,onRefresh);
    window.addEventListener('storage',onStorage);
    window.addEventListener('focus',onRefresh);
    window.addEventListener('pageshow',onRefresh);
    document.addEventListener('visibilitychange',onVisible);
    return()=>{active=false;request?.abort();window.removeEventListener(AUTH_CHANGED,onRefresh);window.removeEventListener('storage',onStorage);window.removeEventListener('focus',onRefresh);window.removeEventListener('pageshow',onRefresh);document.removeEventListener('visibilitychange',onVisible);};
  },[pathname]);
  if(signedIn===null)return <span aria-busy="true" className="text-[#8a7a62]">Tài khoản…</span>;
  if(variant==='home')return signedIn?<a href="/tai-khoan" className="btn">Vào tài khoản của tôi</a>:<><a className="btn" href="/dang-ky">Tạo tài khoản</a><a className="btn-outline" href="/dang-nhap">Đăng nhập</a></>;
  return signedIn?<a href="/tai-khoan" className="hover:text-son">Tài khoản</a>:<a href="/dang-nhap" className="hover:text-son">Đăng nhập</a>;
}
