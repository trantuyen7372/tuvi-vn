import { validateInput, buildChart } from '@/lib/tuvi';
import { createOrder } from '@/lib/commerce/store';
import { gateway } from '@/lib/commerce/provider';
import { limit, sameOrigin } from '@/lib/commerce/security';
import { run } from '@/lib/commerce/db';
import { body, failure, json } from '@/lib/commerce/http';
import {paymentsEnabled,clientKey} from '@/lib/customers/auth';
import {privateCustomer,AccessError} from '@/lib/customers/order-access';
export const runtime = 'nodejs';
export async function POST(req: Request) {
  try {
    sameOrigin(req); limit(`new-orders:${clientKey(req)}`, 120, 3600000);
    if(!paymentsEnabled())return json({error:'Website đang mở trải nghiệm và chưa nhận thanh toán. Hãy đăng nhập tài khoản để dùng lượt trải nghiệm.'},503);
    const c=privateCustomer(req);
    if(!c.verified)throw new AccessError('Vui lòng xác minh email trong tài khoản trước khi đặt đơn.',403);
    const b = await body(req), input = validateInput(b.input);
    buildChart(input);
    const provider = process.env.PAYMENT_PROVIDER === 'mock' ? 'mock' : 'payos';
    const { order, token } = createOrder(c.email, String(b.product || ''), input, String(b.coupon || ''), provider);
    run('UPDATE orders SET customer_id=? WHERE id=?',c.id,order.id);
    if (order.amount > 0) {
      try {
        const link = await gateway().create({ code: order.code, amount: order.amount, expires: order.expires, token });
        run('UPDATE orders SET link_id=?,checkout_url=?,qr=? WHERE id=?', link.id, link.checkoutUrl, link.qrCode, order.id);
      } catch {
        run("UPDATE orders SET status='failed' WHERE id=?", order.id);
        return json({ error: 'Chưa tạo được thanh toán. Vui lòng thử lại sau hoặc liên hệ quản trị.' }, 503);
      }
    }
    return json({ token, url: `/don-hang/${token}` }, 201);
  } catch (e) { return failure(e); }
}
