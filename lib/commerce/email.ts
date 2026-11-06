import { get, run } from './db';
import { siteUrl } from './config';
import type { ReadingRow } from './store';
export async function emailReading(reading: ReadingRow) {
  const key = process.env.RESEND_API_KEY, from = process.env.MAIL_FROM;
  if (!key || !from) { run("UPDATE readings SET email_status='not_configured' WHERE id=?", reading.id); return; }
  const order = get<{ email: string }>('SELECT email FROM orders WHERE id=?', reading.order_id)!;
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(15000),
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': `reading-${reading.id}` },
      body: JSON.stringify({ from, to: [order.email], subject: 'Bản luận giải Tử Vi của bạn',
        text: `Bạn có thể xem lại kết quả tại ${siteUrl()}/luan-giai/${reading.token}\n\n${reading.text}\n\nGiữ kín đường link vì có thông tin ngày giờ sinh. Tử Vi mang tính tham khảo, giải trí.` }),
    });
    if (!response.ok) throw new Error('Email provider error');
    run("UPDATE readings SET email_status='sent' WHERE id=?", reading.id);
  } catch { run("UPDATE readings SET email_status='failed' WHERE id=?", reading.id); }
}
