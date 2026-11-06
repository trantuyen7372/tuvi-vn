import {requireCustomer} from '@/lib/customers/auth';
import {reserveAccountReading, welcomeAccess} from '@/lib/customers/access';
import {body,json,failure} from '@/lib/commerce/http';
import {sameOrigin,limit} from '@/lib/commerce/security';
import {buildChart,validateInput} from '@/lib/tuvi';
import {hasReference} from '@/lib/dataset';
export const runtime='nodejs';
export async function POST(req:Request){try{sameOrigin(req);const c=requireCustomer(req);limit(`account-reading:${c.id}`,20,60000);const input=validateInput((await body(req)).input);const chart=buildChart(input);if((process.env.READING_ENGINE||'dataset')==='dataset'&&!hasReference(chart.solarIso,input.hour,input.gender))throw Error('Chưa có dữ liệu lời luận cho ngày giờ này (kho hỗ trợ 1950–2026). Lượt của bạn chưa bị trừ.');welcomeAccess(c);const r=reserveAccountReading(c,input);return json({url:`/luan-giai/${r.token}`});}catch(e){return failure(e);}}
