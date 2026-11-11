import { get,run,transaction } from '../commerce/db';
import { hash,secret } from '../commerce/security';
import { AUTH_TOKEN_MINUTES } from './email-template';
export {passwordHash,passwordMatches,passwordNeedsUpgrade} from './passwords';
export interface Customer {id:string;email:string;password_hash:string;verified:number;status:string;created:number}
export function normalizeEmail(raw:unknown){const email=String(raw||'').trim().toLowerCase();if(email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw Error('Email không hợp lệ');return email;}
export function checkPassword(raw:unknown){if(typeof raw!=='string'||raw.length<12||raw.length>128)throw Error('Mật khẩu cần từ 12 đến 128 ký tự');return raw;}
export function sessionCookie(token:string,maxAge=14*86400){const secure=process.env.SITE_URL?.startsWith('https://')?'; Secure':'';return `tuvi_customer=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`;}
export function createSession(id:string){const token=secret();run('INSERT INTO customer_sessions VALUES (?,?,?)',hash(token),id,Date.now()+14*86400000);return token;}
export function customer(req:Request):Customer|undefined{
  const token=req.headers.get('cookie')?.match(/(?:^|;\s*)tuvi_customer=([a-f0-9]{64})(?:;|$)/)?.[1];
  if(!token)return;
  return get<Customer>("SELECT c.* FROM customers c JOIN customer_sessions s ON s.customer_id=c.id WHERE s.hash=? AND s.expires>? AND c.status='active'",hash(token),Date.now());
}
export function requireCustomer(req:Request){const c=customer(req);if(!c)throw Error('Vui lòng đăng nhập tài khoản khách hàng');return c;}
export function revokeSession(req:Request){const token=req.headers.get('cookie')?.match(/(?:^|;\s*)tuvi_customer=([a-f0-9]{64})(?:;|$)/)?.[1];if(token)run('DELETE FROM customer_sessions WHERE hash=?',hash(token));}
export function demoMode(){return process.env.PAYMENT_PROVIDER==='mock'&&process.env.TUVI_ALLOW_TEST_PAYMENTS==='1'&&!process.env.ANTHROPIC_API_KEY&&!process.env.RESEND_API_KEY&&!process.env.SMTP_PASSWORD;}
export function paymentsEnabled(){return process.env.PAYMENTS_ENABLED==='1';}
export function clientKey(req:Request){return hash(process.env.TRUST_PROXY==='1'?(req.headers.get('x-real-ip')||'unknown-proxy'):'local');}
export function claimGuestOrders(c:Customer){if(!c.verified)return;run('UPDATE orders SET customer_id=? WHERE customer_id IS NULL AND email=?',c.id,c.email);}
export function issueAuthToken(id:string,purpose:'verify'|'reset'){const token=secret();run('INSERT INTO customer_auth_tokens VALUES (?,?,?,?,NULL)',hash(token),id,purpose,Date.now()+AUTH_TOKEN_MINUTES[purpose]*60000);return token;}
export function consumeAuthToken(token:string,purpose:'verify'|'reset',fn:(c:Customer)=>void){return transaction(()=>{
  const row=get<{customer_id:string}>('SELECT customer_id FROM customer_auth_tokens WHERE hash=? AND purpose=? AND used IS NULL AND expires>?',hash(token),purpose,Date.now());
  if(!row)throw Error('Link đã hết hạn hoặc đã được sử dụng');
  const c=get<Customer>("SELECT * FROM customers WHERE id=? AND status='active'",row.customer_id);if(!c)throw Error('Tài khoản không còn hiệu lực');
  run('UPDATE customer_auth_tokens SET used=? WHERE hash=?',Date.now(),hash(token));fn(c);return c;
});}
