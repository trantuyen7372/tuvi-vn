import {body,failure,json} from '@/lib/commerce/http';
import {sameOrigin,limit,privateHeaders} from '@/lib/commerce/security';
import {clientKey} from '@/lib/customers/auth';
import {FUNNEL_SOURCES,measurementAllowed,startVisit,milestone,type FunnelSource,type FunnelEvent} from '@/lib/funnel';
export const runtime='nodejs';
const clientEvents=new Set(['visit','chart_created','preview_view','pricing_view']);

export async function POST(req:Request) {
  try {
    sameOrigin(req);
    if(!measurementAllowed(req))return new Response(null,{status:204,headers:privateHeaders});
    limit(`funnel:${clientKey(req)}`,300,60000);
    const data=await body(req);
    if(!data||Object.keys(data).some(key=>!['event','source'].includes(key))||typeof data.event!=='string'||!clientEvents.has(data.event)||!FUNNEL_SOURCES.includes(data.source as FunnelSource))return json({error:'Sự kiện không hợp lệ'},400);
    const visit=startVisit(req,data.source as FunnelSource);milestone(visit.id,data.event as FunnelEvent);
    return new Response(null,{status:204,headers:{...privateHeaders,'Set-Cookie':visit.cookie}});
  }catch(e){return failure(e);}
}
