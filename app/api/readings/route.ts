import { validateInput, buildChart } from '@/lib/tuvi';
import { orderByToken, reserveReading } from '@/lib/commerce/store';
import { sameOrigin, limit } from '@/lib/commerce/security';
import { body, failure, json } from '@/lib/commerce/http';
import {authorizeOrder,privateCustomer} from '@/lib/customers/order-access';
export const runtime = 'nodejs';
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const owner=privateCustomer(req);
    const b = await body(req), token = String(b.orderToken || '');
    const order = orderByToken(token);authorizeOrder(order.id,owner);
    const input = validateInput(b.input || JSON.parse(order.input));
    limit(`reserve:${order.id}`, 20, 60000);
    buildChart(input);
    const reading = reserveReading(order, input);
    return json({ token: reading.token, url: `/luan-giai/${reading.token}` });
  } catch (e) { return failure(e); }
}
