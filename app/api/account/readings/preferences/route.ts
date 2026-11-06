import {requireCustomer} from '@/lib/customers/auth';
import {personalizeReading} from '@/lib/customers/reading-preferences';
import {sameOrigin,limit} from '@/lib/commerce/security';
import {body,json,failure} from '@/lib/commerce/http';
export const runtime='nodejs';
export async function POST(req:Request){try{
  sameOrigin(req);const customer=requireCustomer(req);limit(`reading-preferences:${customer.id}`,15,60000);
  const data=await body(req);
  if(typeof data.token!=='string'||!/^[a-f0-9]{64}$/.test(data.token))throw Error('Không tìm thấy bài luận');
  if(!Object.hasOwn(data,'preferences'))throw Error('Thiếu lựa chọn chủ đề');
  personalizeReading(customer.id,data.token,data.preferences);return json({ok:true});
}catch(e){return failure(e);}}
