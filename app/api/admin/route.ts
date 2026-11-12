import { admin, sameOrigin, privateHeaders, secret, hash } from '@/lib/commerce/security';
import { body, json, failure } from '@/lib/commerce/http';
import { all, get, run, transaction } from '@/lib/commerce/db';
import { type Order, type ReadingRow } from '@/lib/commerce/store';
import { emailReading } from '@/lib/commerce/email';
import {paymentConfiguration,paymentChannelFingerprint} from '@/lib/commerce/payment-setup';
import {gateway} from '@/lib/commerce/provider';
import {funnelReport,milestone,safelyMeasure} from '@/lib/funnel';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
function filters(req: Request) {
  const q = new URL(req.url).searchParams;
  const status = q.get('status') || '';
  const from = q.get('from') || '', to = q.get('to') || '';
  const start = from ? Date.parse(from + 'T00:00:00+07:00') : 0;
  const end = to ? Date.parse(to + 'T23:59:59.999+07:00') : Date.now();
  if (!Number.isFinite(start) || !Number.isFinite(end)) throw new Error('Ngày lọc không hợp lệ');
  return { status, start, end, csv: q.get('format') === 'csv' };
}
export async function GET(req: Request) {
  try {
    admin(req);
    run("UPDATE orders SET status='expired' WHERE status='pending' AND expires<?", Date.now());
    const { status, start, end, csv } = filters(req);
    const orders = all<Order & { remaining: number; reading_tokens: string | null }>(`SELECT o.*,COALESCE(c.remaining,0) remaining,
      (SELECT GROUP_CONCAT(token) FROM readings WHERE order_id=o.id) reading_tokens
      FROM orders o LEFT JOIN credits c ON c.order_id=o.id WHERE (?='' OR o.status=?) AND o.created BETWEEN ? AND ? ORDER BY o.created DESC ${csv ? '' : 'LIMIT 200'}`, status, status, start, end);
    if (csv) {
      const cell = (v: unknown) => '"' + String(v ?? '').replace(/^[=+@-]/, "'$&").replace(/"/g, '""') + '"';
      const rows = [['Mã đơn','Email','Gói','Số tiền','Trạng thái','Lượt còn','Tạo lúc'], ...orders.map(o => [o.code,o.email,o.product,o.amount,o.status,o.remaining,new Date(o.created).toISOString()])];
      return new Response('\ufeff' + rows.map(r => r.map(cell).join(',')).join('\r\n'), { headers: { ...privateHeaders, 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="tuvi-orders.csv"' } });
    }
    const revenue = all(`SELECT strftime('%Y-%m-%d',paid_at/1000,'unixepoch','+7 hours') day,SUM(amount) revenue,COUNT(*) orders FROM orders WHERE status='paid' AND provider='payos' AND amount>0 AND paid_at BETWEEN ? AND ? GROUP BY day ORDER BY day DESC`, start, end);
    const monthly = all(`SELECT strftime('%Y-%m',paid_at/1000,'unixepoch','+7 hours') month,SUM(amount) revenue FROM orders WHERE status='paid' AND provider='payos' AND amount>0 AND paid_at BETWEEN ? AND ? GROUP BY month ORDER BY month DESC`, start, end);
    const usage = get('SELECT COUNT(*) calls,COALESCE(SUM(cost_vnd),0) known_cost,SUM(CASE WHEN cost_vnd IS NULL THEN 1 ELSE 0 END) unknown_cost_calls FROM ai_usage WHERE created BETWEEN ? AND ?', start, end);
    let funnel:ReturnType<typeof funnelReport>|null=null;safelyMeasure(()=>{funnel=funnelReport(start,end);});
    return json({ orders: orders.map(({ token_hash: _, qr: _q, funnel_visit:_f, ...o }) => o), revenue, monthly, usage,funnel,paymentConfiguration:paymentConfiguration(),
      payments: all("SELECT * FROM payments WHERE status='review' ORDER BY created DESC LIMIT 100"),
      coupons: all('SELECT * FROM coupons ORDER BY expires DESC LIMIT 100'),
      emailFailures: all("SELECT id,order_id,email_status FROM readings WHERE status='done' AND email_status<>'sent' LIMIT 100") });
  } catch (e) { return failure(e, 401); }
}
export async function POST(req: Request) {
  try {
    sameOrigin(req); admin(req); const b = await body(req), action = String(b.action || ''), id = String(b.orderId || '');
    if(action==='confirm-payos-webhook'){
      const configuration=paymentConfiguration();
      if(configuration.provider!=='payos'||!configuration.canConfirmWebhook)throw Error('Cần đủ ba khóa PayOS và SITE_URL HTTPS công khai để đăng ký webhook');
      try{await gateway().confirmWebhook();}catch{return json({error:'PayOS chưa xác minh được webhook. Kiểm tra khóa của kênh, SITE_URL và khả năng truy cập endpoint từ Internet.'},503);}
      run('INSERT INTO audit_log(action,target,detail,created) VALUES (?,?,?,?)','payos-webhook-confirmed',paymentChannelFingerprint(),JSON.stringify({channel:paymentChannelFingerprint(),webhookUrl:configuration.webhookUrl}),Date.now());
      return json({ok:true,message:'PayOS đã xác minh và đăng ký webhook cho tên miền này. Thanh toán vẫn giữ trạng thái bật/tắt hiện tại.'});
    }
    if (action === 'recover-link') {
      const token=secret();
      transaction(()=>{
        const order=get<Order>('SELECT * FROM orders WHERE id=?',id);
        if(!order||order.status!=='paid'||order.email==='da-xoa'||!String(b.reason||'').trim())throw new Error('Cần đơn đã thanh toán và lý do xác minh chủ sở hữu');
        run('UPDATE orders SET token_hash=? WHERE id=?',hash(token),id);
        run('INSERT INTO audit_log(action,target,detail,created) VALUES (?,?,?,?)',action,id,JSON.stringify({reason:String(b.reason)}),Date.now());
      });
      return json({ok:true,url:`/don-hang/${token}`});
    }
    if (action === 'resend') {
      const r = get<ReadingRow>('SELECT * FROM readings WHERE id=? AND status=\'done\'', String(b.readingId || ''));
      if (!r) throw new Error('Không tìm thấy bài luận');
      await emailReading(r); return json({ ok: true });
    }
    transaction(() => {
      if (action === 'coupon') {
        const code = String(b.code || '').trim().toUpperCase(), percent = Number(b.percent), max = Number(b.maxUses), days = Number(b.days);
        if (!/^[A-Z0-9_-]{3,32}$/.test(code) || !Number.isInteger(percent) || percent < 1 || percent > 100 || !Number.isInteger(max) || max < 1 || max > 10000 || !Number.isInteger(days) || days < 1 || days > 365) throw new Error('Thông tin mã giảm giá không hợp lệ');
        run('INSERT INTO coupons VALUES (?,?,?,?)', code, percent, max, Date.now() + days * 86400000);
      } else {
        const o = get<Order>('SELECT * FROM orders WHERE id=?', id);
        if (!o) throw new Error('Không tìm thấy đơn');
        if (action === 'grant') {
          const count = Number(b.count);
          if (o.status !== 'paid' || !Number.isInteger(count) || count < 1 || count > 20) throw new Error('Chỉ tặng 1–20 lượt cho đơn đã mở');
          run('UPDATE credits SET remaining=remaining+? WHERE order_id=?', count, id);
          // Tặng lượt đồng thời tăng hạn mức AI của đơn.
          run('UPDATE orders SET quantity=quantity+? WHERE id=?', count, id);
        } else if (action === 'refund') {
          if (o.status !== 'paid' || !String(b.reason || '').trim()) throw new Error('Cần đơn đã thanh toán và lý do hoàn tiền');
          run("UPDATE orders SET status='refunded',refunded_at=? WHERE id=?", Date.now(), id);
          run('UPDATE credits SET remaining=0 WHERE order_id=?', id);
        } else if (action === 'confirm-test' || action === 'reconcile') {
          if (o.status === 'paid' || o.status === 'refunded') throw new Error('Đơn đã được xử lý');
          if (action === 'confirm-test') {
            if (o.provider !== 'mock' || process.env.TUVI_ALLOW_TEST_PAYMENTS !== '1' || process.env.ANTHROPIC_API_KEY) throw new Error('Chỉ xác nhận đơn thử, không dùng khóa dịch vụ luận giải thật');
          } else {
            const p = get<{ amount: number; order_code: number; status: string; reason: string; link_id: string }>('SELECT * FROM payments WHERE id=?', String(b.paymentId || ''));
            if (!p || p.status !== 'review' || p.amount !== o.amount || p.order_code !== o.code || p.link_id !== o.link_id || o.provider !== 'payos' || !['expired','order_not_pending'].includes(p.reason) || !String(b.reason || '').trim()) throw new Error('Cần giao dịch thành công đúng mã đơn, link và số tiền; chỉ chấp nhận giao dịch đến muộn hoặc đơn đã đổi trạng thái');
            run("UPDATE payments SET status='reconciled' WHERE id=?", String(b.paymentId));
          }
          run("UPDATE orders SET status='paid',paid_at=? WHERE id=?", Date.now(), id);
          run('INSERT INTO credits VALUES (?,?,?)', id, o.email, o.quantity);
          if(o.provider==='payos'&&o.amount>0)safelyMeasure(()=>milestone(o.funnel_visit,'purchase'));
        } else if (action === 'erase') {
          if (!String(b.reason || '').trim()) throw new Error('Cần lý do xóa thông tin cá nhân');
          if (get("SELECT id FROM readings WHERE order_id=? AND status='running' AND lease>?",id,Date.now())) throw new Error('Bài luận đang xử lý, vui lòng đợi hoàn tất rồi xóa dữ liệu');
          run('DELETE FROM readings WHERE order_id=?', id);
          run("UPDATE orders SET email='da-xoa',input='{}',status=CASE WHEN status='pending' THEN 'cancelled' ELSE status END WHERE id=?", id);
          run("UPDATE credits SET email='da-xoa',remaining=0 WHERE order_id=?", id);
        } else throw new Error('Thao tác không hợp lệ');
      }
      run('INSERT INTO audit_log(action,target,detail,created) VALUES (?,?,?,?)', action, id || String(b.code), JSON.stringify({ reason: String(b.reason || ''), count: b.count ?? null }), Date.now());
    });
    return json({ ok: true });
  } catch (e) { return failure(e); }
}
