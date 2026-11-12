'use client';
import {usePathname} from 'next/navigation';
import {useRef} from 'react';
import BrandLogo from './BrandLogo';
import CustomerNavigation from './CustomerNavigation';

const links=[
  {href:'/#lap-la-so',label:'Lập lá số',path:'/'},
  {href:'/bai-luan-mau',label:'Bài luận mẫu',path:'/bai-luan-mau'},
  {href:'/huong-dan',label:'Hướng dẫn',path:'/huong-dan'},
  {href:'/sao',label:'14 chính tinh',path:'/sao'},
];

export default function SiteHeader(){
  const pathname=usePathname();
  const menu=useRef<HTMLDetailsElement>(null);
  const current=(path:string)=>pathname===path||(path!=='/'&&pathname.startsWith(path+'/'));
  return <header className="site-header no-print">
    <div className="site-header-inner">
      <BrandLogo/>
      <nav aria-label="Điều hướng chính" className="site-navigation">
        <div className="site-nav-links">{links.map(link=><a key={link.href} href={link.href} aria-current={current(link.path)?'page':undefined}>{link.label}</a>)}</div>
        <details className="site-mobile-menu" ref={menu} onKeyDown={event=>{if(event.key==='Escape'&&menu.current){menu.current.open=false;menu.current.querySelector('summary')?.focus();}}}>
          <summary>Khám phá <span aria-hidden="true">⌄</span></summary>
          <div className="site-mobile-menu-links">{links.slice(1).map(link=><a key={link.href} href={link.href} aria-current={current(link.path)?'page':undefined} onClick={()=>{if(menu.current)menu.current.open=false;}}>{link.label}<span aria-hidden="true">↗</span></a>)}<a href="/phuong-phap">Phương pháp và nguồn <span aria-hidden="true">↗</span></a></div>
        </details>
        <span className="site-nav-account"><CustomerNavigation/></span>
      </nav>
    </div>
  </header>;
}
