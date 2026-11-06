import { privateHeaders } from './security';
export async function body(req: Request): Promise<Record<string, unknown>> {
  const reader = req.body?.getReader();
  if (!reader) throw new Error('Thiếu dữ liệu');
  let size = 0; const chunks: Uint8Array[] = [];
  for (;;) { const { value, done } = await reader.read(); if (done) break; size += value.length;
    if (size > 32768) { await reader.cancel(); throw new Error('Dữ liệu quá lớn'); } chunks.push(value); }
  return JSON.parse(Buffer.concat(chunks).toString());
}
export function json(value: unknown, status = 200) { return Response.json(value, { status, headers: privateHeaders }); }
export function failure(e: unknown, status = 400) { return json({ error: e instanceof Error ? e.message : 'Có lỗi, vui lòng thử lại' }, status); }
