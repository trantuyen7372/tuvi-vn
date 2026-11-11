import { get, run } from './db';
import { siteUrl } from './config';
import type { ReadingRow } from './store';
import {sendEmail} from '../email';
export async function emailReading(reading: ReadingRow) {
  const order = get<{ email: string }>('SELECT email FROM orders WHERE id=?', reading.order_id)!;
  const status=await sendEmail({to:order.email,subject:'Bản luận giải Tử Vi của bạn',
    text:`Đăng nhập tài khoản sở hữu để xem lại kết quả tại ${siteUrl()}/luan-giai/${reading.token}\n\n${reading.text}\n\nBản sao trong email có thông tin cá nhân; không chuyển tiếp nếu không muốn chia sẻ. Tử Vi mang tính tham khảo, giải trí.`},`reading-${reading.id}`);
  run('UPDATE readings SET email_status=? WHERE id=?',status,reading.id);
}
