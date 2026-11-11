'use client';
import {useEffect,useState,type ReactNode} from 'react';

const navigation=[
  {id:'admin-overview',label:'Tổng quan',path:'M3 3v18h18M7 15l4-5 4 2 6-7'},
  {id:'admin-orders',label:'Đơn hàng',path:'M6 5h12l2 16H4L6 5ZM9 6V4a3 3 0 0 1 6 0v2'},
  {id:'admin-payments',label:'Thanh toán',path:'M3 5h18v14H3V5Zm0 5h18M6 15h4'},
  {id:'admin-reconcile',label:'Đối soát',path:'M4 5h16v14H4V5Zm4 7 3 3 5-6'},
  {id:'admin-coupons',label:'Mã ưu đãi',path:'M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4V6Zm9 1v3m0 4v3'},
  {id:'admin-support',label:'Hỗ trợ & email',path:'M3 6h18v13H3V6Zm0 1 9 7 9-7'},
];
function Symbol({path}:{path:string}){return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={path}/></svg>;}

export default function AdminShell({children,signedIn,reviews=0,emailFailures=0,mfaRequired=false}:{children:ReactNode;signedIn:boolean;reviews?:number;emailFailures?:number;mfaRequired?:boolean}) {
  const [active,setActive]=useState('admin-overview');
  useEffect(()=>{
    if(!signedIn||!('IntersectionObserver' in window))return;
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];
      if(visible)setActive(visible.target.id);
    },{rootMargin:'-5% 0px -65% 0px'});
    navigation.forEach(item=>{const node=document.getElementById(item.id);if(node)observer.observe(node);});
    return()=>observer.disconnect();
  },[signedIn]);
  if(!signedIn)return <main className="admin-login admin-workspace"><div className="admin-login-grid"><aside className="admin-login-brand"><div className="admin-login-mark"><Symbol path="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Zm-4 9 3 3 5-6"/></div><p className="admin-eyebrow">Xem Tử Vi Online</p><h2>Mọi hoạt động,<br/>trong một nơi.</h2><p>Theo dõi doanh thu, quản lý đơn hàng và chăm sóc người dùng.</p><ul><li>Theo dõi từ lượt vào đến đơn trả tiền</li><li>Quản lý lượt và đối soát giao dịch</li><li>Theo dõi email và hỗ trợ khách hàng</li></ul><span className="admin-login-footnote">Khu vực dành riêng cho quản trị</span></aside><div className="admin-login-form"><p className="admin-eyebrow">Trung tâm điều hành</p>{children}<p className="admin-login-security">{mfaRequired?'Phiên quản trị được bảo vệ. Không chia sẻ mật khẩu hoặc mã xác thực.':'Phiên quản trị được bảo vệ. Không chia sẻ mật khẩu quản trị.'}<a href="/" className="mt-3 block text-son">← Về trang chủ</a></p></div></div></main>;
  return <main className="admin-workspace admin-dashboard"><aside className="admin-sidebar"><div className="admin-sidebar-heading"><span className="admin-sidebar-mark"><Symbol path={navigation[0].path}/></span><div><strong>Điều hành website</strong><p>Xem Tử Vi Online</p></div></div><nav aria-label="Điều hướng quản trị">{navigation.map(item=>{
    const count=item.id==='admin-reconcile'?reviews:item.id==='admin-support'?emailFailures:0;
    return <a key={item.id} href={`#${item.id}`} aria-current={active===item.id?'location':undefined} onClick={()=>setActive(item.id)}><Symbol path={item.path}/><span>{item.label}</span>{count>0&&<span className="admin-nav-count">{count}</span>}</a>;
  })}</nav><a className="admin-back-link" href="/">Mở website <span aria-hidden="true">↗</span></a><p className="admin-sidebar-note">Dữ liệu chỉ dành cho quản trị. Khi hỗ trợ, dùng mã đơn và giữ riêng thông tin khách hàng.</p></aside><div className="admin-content">{children}</div></main>;
}
