import type {Metadata} from 'next';

// URL xuất bản đã được chủ website xác nhận; không lấy URL preview localhost.
export const SITE_ORIGIN='https://xemtuvionline.vn';
export const SITE_NAME='Xem Tử Vi Online';
export function publicMetadata(path:string,title:string,description:string):Metadata{
  const url=new URL(path,SITE_ORIGIN).href;
  return {title,description,alternates:{canonical:url},
    openGraph:{type:'website',locale:'vi_VN',siteName:SITE_NAME,url,title,description},
    twitter:{card:'summary',title,description}};
}
export function breadcrumbData(items:{name:string;path:string}[]){
  return {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map((item,index)=>({
    '@type':'ListItem',position:index+1,name:item.name,item:new URL(item.path,SITE_ORIGIN).href,
  }))};
}
