import { validateInput, buildChart } from '@/lib/tuvi';
import { orderByToken, reserveReading } from '@/lib/commerce/store';
import { sameOrigin, limit } from '@/lib/commerce/security';
import { body, failure, json } from '@/lib/commerce/http';
export const runtime = 'nodejs';
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const b = await body(req), token = String(b.orderToken || '');
    const order = orderByToken(token), input = validateInput(b.input || JSON.parse(order.input));
    limit(`reserve:${order.id}`, 20, 60000);
    buildChart(input);
    const reading = reserveReading(order, input);
    return json({ token: reading.token, url: `/luan-giai/${reading.token}` });
  } catch (e) { return failure(e); }
}
