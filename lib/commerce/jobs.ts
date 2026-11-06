import { get, run, transaction } from './db';
import { MAX_RETRIES } from './config';
import type { ReadingRow, Order } from './store';

function refundReservedCredit(row: ReadingRow) {
  run("UPDATE credits SET remaining=remaining+1 WHERE order_id=? AND EXISTS(SELECT 1 FROM orders WHERE id=? AND status='paid')", row.order_id, row.order_id);
}
export function claimReading(id: string) {
  return transaction(() => {
    const row = get<ReadingRow>('SELECT * FROM readings WHERE id=?', id);
    if (!row) throw new Error('Không tìm thấy bài luận');
    const order = get<Order>('SELECT * FROM orders WHERE id=?', row.order_id)!;
    if (order.status !== 'paid') throw new Error('Đơn không còn hiệu lực');
    if (row.status === 'done') return { state: 'done' as const };
    if (row.status === 'running' && (row.lease || 0) > Date.now()) return { state: 'busy' as const };
    if (row.attempts >= MAX_RETRIES) {
      // Tiến trình có thể chết ở lần thử cuối. Chuyển trạng thái và trả lượt
      // trong cùng giao dịch để các yêu cầu sau không trả lượt lần thứ hai.
      if (row.status === 'running') {
        run("UPDATE readings SET status='error',lease=NULL WHERE id=?", id);
        refundReservedCredit(row);
      }
      return { state: 'exhausted' as const };
    }
    const total = get<{ n: number }>('SELECT SUM(attempts) n FROM readings WHERE order_id=?', order.id)!.n || 0;
    if (total >= order.quantity * MAX_RETRIES) throw new Error('Đã đạt giới hạn xử lý của đơn. Vui lòng liên hệ hỗ trợ.');
    const lease = Date.now() + 12 * 60000;
    run("UPDATE readings SET status='running',attempts=attempts+1,lease=? WHERE id=?", lease, id);
    return { state: 'claimed' as const, reading: { ...row, attempts: row.attempts + 1, lease } };
  });
}
export function finishReading(row: ReadingRow, text: string) {
  return Number(run("UPDATE readings SET status='done',text=?,lease=NULL,completed=? WHERE id=? AND status='running' AND lease=?", text, Date.now(), row.id, row.lease).changes) === 1;
}
export function failReading(row: ReadingRow) {
  return transaction(() => {
    const changed = Number(run("UPDATE readings SET status='error',lease=NULL WHERE id=? AND status='running' AND lease=?", row.id, row.lease).changes) === 1;
    if (changed && row.attempts === MAX_RETRIES) refundReservedCredit(row);
    return changed;
  });
}
