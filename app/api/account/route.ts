import {requireCustomer,sessionCookie,passwordMatches} from '@/lib/customers/auth';
import {customerDashboard,welcomeAccess} from '@/lib/customers/access';
import {body,json,failure} from '@/lib/commerce/http';
import {sameOrigin,privateHeaders,limit} from '@/lib/commerce/security';
import {run,get,transaction} from '@/lib/commerce/db';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(req:Request){try{const c=requireCustomer(req);welcomeAccess(c);return json(customerDashboard(c));}catch{return json({error:'Vui lòng đăng nhập'},401);}}
export async function DELETE(req:Request){try{
  sameOrigin(req);const c=requireCustomer(req);limit(`erase:${c.id}`,5,3600000);const b=await body(req);
  if(!await passwordMatches(String(b.password||''),c.password_hash))throw Error('Mật khẩu không đúng');
  transaction(()=>{
    if(get("SELECT r.id FROM readings r JOIN orders o ON o.id=r.order_id WHERE o.customer_id=? AND r.status='running' AND r.lease>?",c.id,Date.now()))throw Error('Bài đang xử lý, hãy đợi hoàn tất trước khi xóa tài khoản');
    run('DELETE FROM readings WHERE order_id IN(SELECT id FROM orders WHERE customer_id=?)',c.id);
    run("UPDATE credits SET email='da-xoa',remaining=0 WHERE order_id IN(SELECT id FROM orders WHERE customer_id=?)",c.id);
    run("UPDATE orders SET email='da-xoa',input='{}',status=CASE WHEN status='pending' THEN 'cancelled' ELSE status END WHERE customer_id=?",c.id);
    run('DELETE FROM birth_profiles WHERE customer_id=?',c.id);run('DELETE FROM customer_sessions WHERE customer_id=?',c.id);run('DELETE FROM customer_auth_tokens WHERE customer_id=?',c.id);
    run("UPDATE customers SET email=?,password_hash='',verified=0,status='deleted' WHERE id=?",`deleted-${c.id}@invalid.local`,c.id);
    run('INSERT INTO audit_log(action,target,detail,created) VALUES (?,?,?,?)','customer-erase',c.id,'{}',Date.now());
  });
  return Response.json({ok:true},{headers:{...privateHeaders,'Set-Cookie':sessionCookie('',0)}});
}catch(e){return failure(e);}}
