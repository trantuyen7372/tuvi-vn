import {body,json,failure} from '@/lib/commerce/http';
import {sameOrigin,limit,secret,hash,privateHeaders} from '@/lib/commerce/security';
import {get,run,transaction} from '@/lib/commerce/db';
import {normalizeEmail,checkPassword,passwordHash,passwordMatches,createSession,sessionCookie,customer,requireCustomer,revokeSession,issueAuthToken,consumeAuthToken,claimGuestOrders,paymentsEnabled,demoMode,clientKey,type Customer} from '@/lib/customers/auth';
import {welcomeAccess,freeReadingCredits} from '@/lib/customers/access';
import {authMail} from '@/lib/customers/mail';
import {mailConfigured} from '@/lib/email';
export const runtime='nodejs';
export const dynamic='force-dynamic';
function signed(value:unknown,token:string){return Response.json(value,{headers:{...privateHeaders,'Set-Cookie':sessionCookie(token,token?14*86400:0)}});}
async function sendAuthMail(c:Customer,purpose:'verify'|'reset'){
  const delivery=await authMail(c.email,issueAuthToken(c.id,purpose),purpose,freeReadingCredits());
  run('INSERT INTO audit_log(action,target,detail,created) VALUES (?,?,?,?)',`customer-email-${purpose}`,c.id,delivery.status,Date.now());
  return delivery;
}
export async function GET(req:Request,ctx:{params:Promise<{action:string}>}){
  if((await ctx.params).action!=='me')return json({error:'Không tìm thấy'},404);
  const c=customer(req);
  return json({customer:c?{email:c.email,verified:!!c.verified}:null,paymentsEnabled:paymentsEnabled(),emailEnabled:mailConfigured(),demo:demoMode()});
}
export async function POST(req:Request,ctx:{params:Promise<{action:string}>}){
  try{
    sameOrigin(req);const action=(await ctx.params).action;
    if(action==='logout'){revokeSession(req);return signed({ok:true},'');}
    const b=await body(req);
    if(action==='signup'){
      limit(`customer-signup:${clientKey(req)}`,30,3600000);const email=normalizeEmail(b.email),password=checkPassword(b.password);
      if(get('SELECT id FROM customers WHERE email=?',email))throw Error('Không thể đăng ký email này. Hãy đăng nhập hoặc dùng chức năng quên mật khẩu.');
      const id=secret().slice(0,24),encoded=await passwordHash(password);
      run('INSERT INTO customers(id,email,password_hash,created) VALUES (?,?,?,?)',id,email,encoded,Date.now());
      const c=get<Customer>('SELECT * FROM customers WHERE id=?',id)!;welcomeAccess(c);
      const delivery=await sendAuthMail(c,'verify');
      return signed({ok:true,verification:delivery},createSession(id));
    }
    if(action==='login'){
      limit(`customer-login-ip:${clientKey(req)}`,60,15*60000);const email=normalizeEmail(b.email);
      limit(`customer-login:${hash(email)}`,10,15*60000);
      const c=get<Customer>("SELECT * FROM customers WHERE email=? AND status='active'",email);
      const valid=await passwordMatches(String(b.password||''),c?.password_hash||'');
      if(!c||!valid)return json({error:'Email hoặc mật khẩu không đúng'},401);
      welcomeAccess(c);claimGuestOrders(c);return signed({ok:true},createSession(c.id));
    }
    if(action==='forgot'){
      limit(`customer-reset-ip:${clientKey(req)}`,30,3600000);const email=normalizeEmail(b.email);limit(`customer-reset:${hash(email)}`,3,3600000);
      const c=get<Customer>("SELECT * FROM customers WHERE email=? AND status='active'",email);
      const delivery=c?await sendAuthMail(c,'reset'):undefined;
      // Production không tiết lộ email có tồn tại hay không.
      return json({ok:true,message:'Nếu email có tài khoản và dịch vụ thư sẵn sàng, bạn sẽ nhận được link đặt lại mật khẩu.',...(delivery&&'demoUrl' in delivery?{demoUrl:delivery.demoUrl}:{})});
    }
    if(action==='verify'){
      limit(`customer-verify:${clientKey(req)}`,120,3600000);
      const token=String(b.token||'');if(!/^[a-f0-9]{64}$/.test(token))throw Error('Link không hợp lệ');
      const c=consumeAuthToken(token,'verify',c=>{run('UPDATE customers SET verified=1 WHERE id=?',c.id);claimGuestOrders({...c,verified:1});});
      welcomeAccess({...c,verified:1});
      return json({ok:true});
    }
    if(action==='resend'){
      const c=requireCustomer(req);limit(`verify:${c.id}`,3,3600000);
      if(c.verified)return json({ok:true,status:'verified'});
      return json(await sendAuthMail(c,'verify'));
    }
    if(action==='reset'){
      limit(`customer-reset-confirm:${clientKey(req)}`,60,3600000);const token=String(b.token||'');if(!/^[a-f0-9]{64}$/.test(token))throw Error('Link không hợp lệ');
      const encoded=await passwordHash(checkPassword(b.password));
      const c=consumeAuthToken(token,'reset',c=>{run('UPDATE customers SET password_hash=?,verified=1 WHERE id=?',encoded,c.id);run('DELETE FROM customer_sessions WHERE customer_id=?',c.id);run('UPDATE customer_auth_tokens SET used=? WHERE customer_id=? AND purpose=\'reset\'',Date.now(),c.id);claimGuestOrders({...c,verified:1});});
      welcomeAccess({...c,verified:1});
      return signed({ok:true},createSession(c.id));
    }
    if(action==='password'){
      const c=requireCustomer(req);limit(`password:${c.id}`,5,3600000);
      if(!await passwordMatches(String(b.oldPassword||''),c.password_hash))throw Error('Mật khẩu hiện tại không đúng');
      const encoded=await passwordHash(checkPassword(b.password));transaction(()=>{run('UPDATE customers SET password_hash=? WHERE id=?',encoded,c.id);run('DELETE FROM customer_sessions WHERE customer_id=?',c.id);});
      return signed({ok:true},createSession(c.id));
    }
    return json({error:'Không tìm thấy chức năng'},404);
  }catch(e){return failure(e);}
}
