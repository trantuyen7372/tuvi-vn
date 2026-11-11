import { get } from '@/lib/commerce/db';
import type { ReadingRow } from '@/lib/commerce/store';
import { generate } from '@/lib/commerce/generate';
import { sameOrigin, limit } from '@/lib/commerce/security';
import { failure, json } from '@/lib/commerce/http';
import {upgradeLegacyReading} from '@/lib/commerce/upgrade-reading';
import {authorizeOrder,privateCustomer} from '@/lib/customers/order-access';
import {canPersonalize} from '@/lib/customers/reading-preferences';
export const runtime = 'nodejs';
export const maxDuration = 660;
export const dynamic = 'force-dynamic';
function lookup(token: string) {
  if (!/^[a-f0-9]{64}$/.test(token)) throw new Error('Không tìm thấy bài luận');
  const row = get<ReadingRow>('SELECT * FROM readings WHERE token=?', token);
  if (!row) throw new Error('Không tìm thấy bài luận');
  return row;
}
export async function GET(req: Request, ctx: { params: Promise<{ token: string }> }) {
  try { const owner=privateCustomer(req),row=lookup((await ctx.params).token);authorizeOrder(row.order_id,owner);
    const r = upgradeLegacyReading(row); return json({ status: r.status, text: r.text, input: JSON.parse(r.input), attempts: r.attempts, emailStatus: r.email_status,canPersonalize:canPersonalize(r,owner.id) }); }
  catch(e) { return failure(e,404); }
}
export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  try { sameOrigin(req); const owner=privateCustomer(req),token = (await ctx.params).token; const reading = lookup(token);authorizeOrder(reading.order_id,owner); limit(`generate:${reading.id}`, 12, 60000);
    await generate(reading.id); return json({ ok: true }); }
  catch (e) { return failure(e); }
}
