import {requireCustomer} from '@/lib/customers/auth';
import {body,json,failure} from '@/lib/commerce/http';
import {sameOrigin,secret,limit} from '@/lib/commerce/security';
import {run,get} from '@/lib/commerce/db';
import {buildChart,validateInput} from '@/lib/tuvi';
export const runtime='nodejs';
export async function POST(req:Request){try{
  sameOrigin(req);const c=requireCustomer(req);limit(`profiles:${c.id}`,30,3600000);const b=await body(req),input=validateInput(b.input);buildChart(input);
  if(get<{n:number}>('SELECT COUNT(*) n FROM birth_profiles WHERE customer_id=?',c.id)!.n>=50)throw Error('Tối đa 50 hồ sơ; hãy xóa hồ sơ không còn dùng');
  const id=secret().slice(0,24);run('INSERT INTO birth_profiles VALUES (?,?,?,?,?)',id,c.id,String(b.label||input.name||'Lá số của tôi').trim().slice(0,60),JSON.stringify(input),Date.now());return json({id},201);
}catch(e){return failure(e);}}
export async function DELETE(req:Request){try{sameOrigin(req);const c=requireCustomer(req),b=await body(req);run('DELETE FROM birth_profiles WHERE id=? AND customer_id=?',String(b.id||''),c.id);return json({ok:true});}catch(e){return failure(e);}}
