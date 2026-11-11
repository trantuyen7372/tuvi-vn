import { randomInt } from 'node:crypto';
import {readingIdentity,type BirthInput} from '../birth-input';
import { all, get, run, transaction } from './db';
import { hash, secret } from './security';
import { ORDER_TTL, PRODUCTS } from './config';
import {milestone,safelyMeasure} from '../funnel';

export interface Order {
  id: string; code: number; token_hash: string; email: string; product: string; amount: number; quantity: number;
  status: string; input: string; coupon: string | null; provider: string; link_id: string | null; checkout_url: string | null;
  qr: string | null; created: number; expires: number; paid_at: number | null;
  funnel_visit?:string|null;
}
export interface ReadingRow { id: string; token: string; order_id: string; fingerprint: string; input: string; status: string; text: string; attempts: number; lease: number | null; created: number; email_status: string }
export function orderByToken(token: string) {
  if (!/^[a-f0-9]{64}$/.test(token)) throw new Error('Không tìm thấy đơn hàng');
  const order = get<Order>('SELECT * FROM orders WHERE token_hash=?', hash(token));
  if (!order) throw new Error('Không tìm thấy đơn hàng');
  if (order.status === 'pending' && order.expires <= Date.now()) {
    run("UPDATE orders SET status='expired' WHERE id=? AND status='pending'", order.id); order.status = 'expired';
  }
  return order;
}
export function credits(id: string) { return get<{ remaining: number }>('SELECT remaining FROM credits WHERE order_id=?', id)?.remaining || 0; }
export function createOrder(email: string, productId: string, input: BirthInput, couponInput: string, provider: string,visit?:string) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) throw new Error('Gói không hợp lệ');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new Error('Email không hợp lệ');
  return transaction(() => {
    const coupon = couponInput.trim().toUpperCase();
    let amount: number = product.price;
    if (coupon) {
      const c = get<{ percent: number; max_uses: number; expires: number }>('SELECT * FROM coupons WHERE code=?', coupon);
      const used = get<{ n: number }>("SELECT COUNT(*) n FROM orders WHERE coupon=? AND (status='paid' OR (status='pending' AND expires>?))", coupon, Date.now())!.n;
      if (!c || c.expires < Date.now() || used >= c.max_uses) throw new Error('Mã giảm giá không hợp lệ, đã hết hạn hoặc hết lượt');
      amount = Math.round(product.price * (100 - c.percent) / 100);
    }
    const token = secret(), id = secret().slice(0, 24), now = Date.now();
    const code = now * 1000 + randomInt(1000);
    run('INSERT INTO orders (id,code,token_hash,email,product,amount,quantity,input,coupon,provider,created,expires) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
      id, code, hash(token), email.toLowerCase(), product.id, amount, product.credits, JSON.stringify(input), coupon || null, provider, now, now + ORDER_TTL);
    if(visit)safelyMeasure(()=>{run('UPDATE orders SET funnel_visit=? WHERE id=?',visit,id);milestone(visit,'order_created');});
    if (amount === 0) grantOrder(id);
    return { token, order: get<Order>('SELECT * FROM orders WHERE id=?', id)! };
  });
}
function grantOrder(id: string) {
  const order = get<Order>('SELECT * FROM orders WHERE id=?', id)!;
  if (order.status === 'paid') return;
  run("UPDATE orders SET status='paid',paid_at=? WHERE id=?", Date.now(), id);
  run('INSERT INTO credits VALUES (?,?,?)', id, order.email, order.quantity);
  if(order.provider==='payos'&&order.amount>0)safelyMeasure(()=>milestone(order.funnel_visit,'purchase'));
}
export function receivePayment(p: { reference: string; orderCode: number; amount: number; paymentLinkId: string; code: string; currency: string }) {
  if (!p.reference || !Number.isSafeInteger(p.orderCode) || !Number.isInteger(p.amount) || p.amount < 0) throw new Error('Giao dịch không hợp lệ');
  return transaction(() => {
    if (get('SELECT id FROM payments WHERE id=?', p.reference)) return 'duplicate';
    const order = get<Order>('SELECT * FROM orders WHERE code=?', p.orderCode);
    const reason = p.code !== '00' || p.currency !== 'VND' ? 'unsuccessful' : !order ? 'unknown_order' :
      order.provider !== 'payos' || order.link_id !== p.paymentLinkId ? 'wrong_link' :
      order.amount !== p.amount ? 'wrong_amount' : order.expires < Date.now() ? 'expired' :
      order.status !== 'pending' ? 'order_not_pending' : '';
    run('INSERT INTO payments VALUES (?,?,?,?,?,?,?)', p.reference, p.orderCode, p.amount, p.paymentLinkId, reason ? 'review' : 'matched', Date.now(), reason || null);
    if (!reason) grantOrder(order!.id);
    return reason ? 'review' : 'matched';
  });
}
export function reserveReading(order: Order, input: BirthInput) {
  return transaction(() => {
    const current = get<Order>('SELECT * FROM orders WHERE id=?', order.id)!;
    if (current.status !== 'paid') throw new Error('Đơn chưa thanh toán hoặc đã hoàn tiền');
    const fingerprint = hash(JSON.stringify(readingIdentity(input)));
    const existing = get<ReadingRow>('SELECT * FROM readings WHERE order_id=? AND fingerprint=?', order.id, fingerprint);
    if (existing) {
      if (existing.status === 'pending' && input.reading) {
        const nextInput = JSON.stringify(input);
        if (nextInput !== existing.input) {
          run("UPDATE readings SET input=? WHERE id=? AND status='pending'", nextInput, existing.id);
          return { ...existing, input: nextInput };
        }
      }
      return existing;
    }
    const attempts = get<{n:number}>('SELECT SUM(attempts) n FROM readings WHERE order_id=?',order.id)!.n || 0;
    if (attempts >= current.quantity * 3) throw new Error('Đã đạt giới hạn xử lý của đơn. Vui lòng liên hệ hỗ trợ.');
    const result = run('UPDATE credits SET remaining=remaining-1 WHERE order_id=? AND remaining>0', order.id);
    if (!Number(result.changes)) throw new Error('Gói đã hết lượt');
    const id = secret().slice(0, 24), token = secret();
    run('INSERT INTO readings (id,token,order_id,fingerprint,input,created) VALUES (?,?,?,?,?,?)', id, token, order.id, fingerprint, JSON.stringify(input), Date.now());
    return get<ReadingRow>('SELECT * FROM readings WHERE id=?', id)!;
  });
}
export function orderView(order: Order) {
  return { id: order.id, code: order.code, email: order.email, product: order.product, amount: order.amount, status: order.status,
    input: JSON.parse(order.input), provider: order.provider, checkoutUrl: order.checkout_url, expires: order.expires,
    credits: credits(order.id), readings: all<{ token: string; status: string; input: string }>('SELECT token,status,input FROM readings WHERE order_id=? ORDER BY created DESC', order.id) };
}
