import { get, run } from './db';
import { siteUrl } from './config';
import type { ReadingRow } from './store';
import {sendEmail} from '../email';
export async function emailReading(reading: ReadingRow) {
  const order = get<{ email: string }>('SELECT email FROM orders WHERE id=?', reading.order_id)!;
  const status=await sendEmail({to:order.email,subject:'Bản luận giải Tử Vi của bạn',
    text:`Bạn có thể xem lại kết quả tại ${siteUrl()}/luan-giai/${reading.token}\n\n${reading.text}\n\nGiữ kín đường link vì có thông tin ngày giờ sinh. Tử Vi mang tính tham khảo, giải trí.`},`reading-${reading.id}`);
  run('UPDATE readings SET email_status=? WHERE id=?',status,reading.id);
}
