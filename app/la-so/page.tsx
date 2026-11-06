import ChartResult from '@/components/ChartResult';
import {buildChart} from '@/lib/tuvi';
import {queryToInput} from '@/lib/birth-input';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const raw=await searchParams,query=new URLSearchParams();
  for(const [key,value]of Object.entries(raw))if(value!==undefined)query.set(key,Array.isArray(value)?value[0]:value);
  try{return <ChartResult chart={buildChart(queryToInput(query))}/>;}
  catch(e){return <main className="mx-auto max-w-xl px-4 py-16 text-center"><p className="text-son">{(e as Error).message}</p><a className="btn mt-6" href="/">Nhập lại</a></main>;}
}
