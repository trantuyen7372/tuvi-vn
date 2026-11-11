import { body, json, failure } from '@/lib/commerce/http';
import { equal, secret, limit, sameOrigin, privateHeaders } from '@/lib/commerce/security';
import { clientKey } from '@/lib/customers/auth';
import { run } from '@/lib/commerce/db';
import {adminMfaRequired,consumeAdminTotp,adminSessionHash} from '@/lib/commerce/admin-auth';
export const runtime = 'nodejs';
export async function POST(req: Request) {
  try {
    sameOrigin(req); limit(`admin-login:${clientKey(req)}`, 8, 15 * 60000);
    const configured = process.env.ADMIN_PASSWORD;
    if (!configured || configured.length < 12) return json({ error: 'Quản trị chưa được cấu hình mật khẩu tối thiểu 12 ký tự' }, 503);
    const required=adminMfaRequired();
    const credentials=await body(req);
    if (!equal(String(credentials.password || ''), configured)) return json({ error: required?'Mật khẩu hoặc mã xác thực không đúng':'Mật khẩu không đúng' }, 401);
    if(required&&!consumeAdminTotp(String(credentials.code||'')))return json({error:'Mật khẩu hoặc mã xác thực không đúng'},401);
    const token = secret();
    run('DELETE FROM admin_sessions WHERE expires<?', Date.now());
    run('INSERT INTO admin_sessions VALUES (?,?)', adminSessionHash(token), Date.now() + 8 * 3600000);
    const secure = process.env.SITE_URL?.startsWith('https://') ? '; Secure' : '';
    return Response.json({ ok: true }, { headers: { ...privateHeaders, 'Set-Cookie': `tuvi_admin=${token}; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=28800${secure}` } });
  } catch (e) { return failure(e); }
}
export async function DELETE(req: Request) {
  try {
    sameOrigin(req);
    const cookie = req.headers.get('cookie')?.match(/tuvi_admin=([a-f0-9]{64})/)?.[1];
    if (cookie) run('DELETE FROM admin_sessions WHERE hash=?', adminSessionHash(cookie));
    return Response.json({ ok: true }, { headers: { ...privateHeaders, 'Set-Cookie': 'tuvi_admin=; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=0' } });
  } catch (e) { return failure(e); }
}
