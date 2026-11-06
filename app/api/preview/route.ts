import { validateInput, buildChart } from '@/lib/tuvi';
import { hasReference } from '@/lib/dataset';
import { body, json, failure } from '@/lib/commerce/http';
import { sameOrigin, limit } from '@/lib/commerce/security';
import { clientKey } from '@/lib/customers/auth';
import {readingPreview} from '@/lib/reading-preview';
export const runtime='nodejs';
export async function POST(req:Request){
  try{
    sameOrigin(req);limit(`free-preview:${clientKey(req)}`,120,60000);
    const input=validateInput((await body(req)).input),chart=buildChart({...input,name:''});
    const reference=hasReference(chart.solarIso,input.hour,input.gender);
    return json(reference?readingPreview(chart):{text:'',excerpts:[],questions:[]});
  }catch(e){return failure(e);}
}
