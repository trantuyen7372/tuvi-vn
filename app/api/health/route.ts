import {get} from '@/lib/commerce/db';
import {hasReference} from '@/lib/dataset';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(){
  try{
    get('SELECT 1');
    const dataset=hasReference('2000-01-01',0,'nam');
    return Response.json({ok:dataset},{status:dataset?200:503,headers:{'Cache-Control':'no-store'}});
  }catch{return Response.json({ok:false},{status:503,headers:{'Cache-Control':'no-store'}});}
}
