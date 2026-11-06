import { gateway } from '@/lib/commerce/provider';
import { receivePayment } from '@/lib/commerce/store';
import { body, json } from '@/lib/commerce/http';
export const runtime = 'nodejs';
export async function POST(req: Request) {
  try { const status = receivePayment(await gateway().verify(await body(req))); return json({ ok: true, status }); }
  catch { return json({ error: 'Webhook không hợp lệ' }, 400); }
}
