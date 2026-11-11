'use client';
import {usePathname} from 'next/navigation';
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
  return <header className="site-header no-print">
    <div className="site-header-inner">
      <BrandLogo/>
      <nav aria-label="Điều hướng chính" className="site-navigation">
        <div className="site-nav-links">{links.map(link=><a key={link.href} href={link.href} aria-current={pathname===link.path||(link.path!=='/'&&pathname.startsWith(link.path+'/'))?'page':undefined}>{link.label}</a>)}</div>
        <span className="site-nav-account"><CustomerNavigation/></span>
      </nav>
    </div>
  </header>;
}
