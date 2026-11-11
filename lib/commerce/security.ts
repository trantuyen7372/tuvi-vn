import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { get, run, transaction } from './db';
import { siteUrl } from './config';
import {adminSessionHash} from './admin-auth';
export const secret = () => randomBytes(32).toString('hex');
export const hash = (s: string) => createHash('sha256').update(s).digest('hex');
export function equal(a: string, b: string) { return timingSafeEqual(Buffer.from(hash(a)), Buffer.from(hash(b))); }
export function sameOrigin(req: Request) {
  if (req.headers.get('origin') !== siteUrl()) throw new Error('Yêu cầu không đúng nguồn');
}
let lastPrune = 0;
export function limit(key: string, max: number, windowMs: number) {
  transaction(() => {
    const now = Date.now();
    if (now - lastPrune > 5 * 60000) {
      lastPrune = now;
      run('DELETE FROM rate_limits WHERE reset<?', now);
    }
    const row = get<{ count: number; reset: number }>('SELECT * FROM rate_limits WHERE key=?', key);
    if (!row || row.reset < now) run('INSERT OR REPLACE INTO rate_limits VALUES (?,1,?)', key, now + windowMs);
    else {
      if (row.count >= max) throw new Error('Quá nhiều yêu cầu, vui lòng thử lại sau');
      run('UPDATE rate_limits SET count=count+1 WHERE key=?', key);
    }
  });
}
export function admin(req: Request) {
  if(!process.env.ADMIN_PASSWORD||process.env.ADMIN_PASSWORD.length<12)throw new Error('Cần cấu hình mật khẩu quản trị hợp lệ');
  const token = req.headers.get('cookie')?.split(';').map(v => v.trim()).find(v => v.startsWith('tuvi_admin='))?.slice(11);
  if (!token || !get('SELECT hash FROM admin_sessions WHERE hash=? AND expires>?', adminSessionHash(token), Date.now())) throw new Error('Cần đăng nhập quản trị');
}
export const privateHeaders = { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex, nofollow' };
