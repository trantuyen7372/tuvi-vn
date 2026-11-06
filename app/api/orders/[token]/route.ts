import { orderByToken, orderView } from '@/lib/commerce/store';
import { json, failure } from '@/lib/commerce/http';
import QRCode from 'qrcode';
import {qrDetails} from '@/lib/commerce/qr-details';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  try {
    const order = orderByToken((await ctx.params).token);
    const qrImage = order.status === 'pending' && order.qr ? await QRCode.toDataURL(order.qr, { width: 280, margin: 2 }) : undefined;
    return json({ ...orderView(order), qrImage,transfer:order.status==='pending'&&order.provider==='payos'?qrDetails(order.qr):null });
  } catch { return failure(new Error('Không tìm thấy đơn hàng'), 404); }
}
