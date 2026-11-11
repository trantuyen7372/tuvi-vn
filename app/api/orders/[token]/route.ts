import { orderByToken, orderView } from '@/lib/commerce/store';
import { json, failure } from '@/lib/commerce/http';
import QRCode from 'qrcode';
import {qrDetails} from '@/lib/commerce/qr-details';
import {authorizeOrder,privateCustomer} from '@/lib/customers/order-access';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(req: Request, ctx: { params: Promise<{ token: string }> }) {
  try {
    const owner=privateCustomer(req);
    const order = orderByToken((await ctx.params).token);
    authorizeOrder(order.id,owner);
    const qrImage = order.status === 'pending' && order.qr ? await QRCode.toDataURL(order.qr, { width: 280, margin: 2 }) : undefined;
    return json({ ...orderView(order), qrImage,transfer:order.status==='pending'&&order.provider==='payos'?qrDetails(order.qr):null });
  } catch(e) { return failure(e,404); }
}
