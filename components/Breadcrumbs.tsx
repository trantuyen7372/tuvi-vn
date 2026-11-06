import StructuredData from './StructuredData';
import {breadcrumbData} from '@/lib/seo';
export default function Breadcrumbs({items}:{items:{name:string;path:string}[]}){
  return <><nav aria-label="Đường dẫn" className="mb-4 text-sm text-[#6b5b45]"><ol className="flex flex-wrap gap-x-2 gap-y-1">{items.map((item,index)=><li key={item.path} className="flex gap-2">{index>0&&<span aria-hidden="true">/</span>}{index===items.length-1?<span aria-current="page">{item.name}</span>:<a className="underline hover:text-son" href={item.path}>{item.name}</a>}</li>)}</ol></nav><StructuredData data={breadcrumbData(items)}/></>;
}
