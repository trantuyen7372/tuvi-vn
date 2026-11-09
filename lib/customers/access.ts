import {all,get,run,transaction} from '../commerce/db';
import {secret,hash} from '../commerce/security';
import {claimGuestOrders,paymentsEnabled,type Customer} from './auth';
import {readingIdentity,type BirthInput} from '../birth-input';
import {reserveReading,type Order} from '../commerce/store';
/** Tặng tối đa một lượt sau xác minh email; đặt 0 để tắt ưu đãi. */
export function freeReadingCredits(){
  const raw=process.env.FREE_READING_CREDITS?.trim();
  const n=raw?Number(raw):NaN;
  if(Number.isInteger(n))return Math.max(0,Math.min(1,n));
  return 1;
}
export function welcomeAccess(c:Customer){
  if(!c.verified)return;
  return transaction(()=>{
  if(get("SELECT id FROM orders WHERE customer_id=? AND product='welcome'",c.id))return;
  const id=secret().slice(0,24),code=Date.now()*1000+Math.floor(Math.random()*1000),now=Date.now();
  const quantity=freeReadingCredits();
  run("INSERT INTO orders(id,code,token_hash,email,product,amount,quantity,status,input,provider,created,expires,paid_at,customer_id) VALUES (?,?,?,?,?,0,?,'paid','{}','internal',?,?,?,?)",id,code,hash(secret()),c.email,'welcome',quantity,now,now,now,c.id);
  run('INSERT INTO credits VALUES (?,?,?)',id,c.email,quantity);
});}
export function customerDashboard(c:Customer){
  claimGuestOrders(c);
  return {customer:{email:c.email,verified:!!c.verified},paymentsEnabled:paymentsEnabled(),welcomeCredits:freeReadingCredits(),credits:get<{n:number}>("SELECT COALESCE(SUM(cr.remaining),0) n FROM credits cr JOIN orders o ON cr.order_id=o.id WHERE o.customer_id=? AND o.status='paid' AND (o.product!='welcome' OR ?=1)",c.id,c.verified)!.n,
    verificationDelivery:c.verified?null:get<{status:string;created:number}>("SELECT detail status,created FROM audit_log WHERE action='customer-email-verify' AND target=? ORDER BY created DESC,id DESC LIMIT 1",c.id)||null,
    profiles:all('SELECT id,label,input,created FROM birth_profiles WHERE customer_id=? ORDER BY created DESC',c.id),
    orders:all('SELECT id,code,product,amount,status,quantity,created FROM orders WHERE customer_id=? ORDER BY created DESC',c.id),
    readings:all('SELECT r.token,r.input,r.status,r.created FROM readings r JOIN orders o ON o.id=r.order_id WHERE o.customer_id=? ORDER BY r.created DESC',c.id)};
}
export function accountReading(c:Customer,input:BirthInput){return transaction(()=>{
  // Tra lại bài của cùng lá số trong mọi gói của chủ tài khoản trước khi dùng lượt.
  const fingerprint=hash(JSON.stringify(readingIdentity(input)));
  const existing=get<{id:string;token:string;status:string;input:string}>("SELECT r.id,r.token,r.status,r.input FROM readings r JOIN orders o ON o.id=r.order_id WHERE o.customer_id=? AND r.fingerprint=? AND o.status='paid' ORDER BY r.created LIMIT 1",c.id,fingerprint);
  if(existing){
    if(existing.status==='pending'&&input.reading){
      const nextInput=JSON.stringify(input);
      if(nextInput!==existing.input)run("UPDATE readings SET input=? WHERE id=? AND status='pending'",nextInput,existing.id);
    }
    return {token:existing.token};
  }
  const order=get<Order>("SELECT o.* FROM orders o JOIN credits c ON c.order_id=o.id WHERE o.customer_id=? AND o.status='paid' AND (o.product!='welcome' OR ?=1) AND c.remaining>0 AND (SELECT COALESCE(SUM(attempts),0) FROM readings WHERE order_id=o.id)<o.quantity*3 ORDER BY o.created LIMIT 1",c.id,c.verified);
  if(!order&&!c.verified)throw Error('Vui lòng xác minh email trong tài khoản để nhận lượt trải nghiệm miễn phí.');
  if(!order)throw Error(paymentsEnabled()?'Tài khoản đã hết lượt. Vui lòng chọn gói luận giải để mở bài.':'Tài khoản đã hết lượt trải nghiệm. Vui lòng liên hệ hỗ trợ.');
  // reserveReading dùng transaction riêng; không lồng transaction SQLite.
  return {order};
});}
export function reserveAccountReading(c:Customer,input:BirthInput){
  const found=accountReading(c,input);if('token' in found)return found;
  return reserveReading(found.order,input);
}
