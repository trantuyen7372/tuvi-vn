import {createHash} from 'node:crypto';
import {get} from './db';

export function paymentWebhookUrl(){
  try{
    const url=new URL(process.env.SITE_URL||'');
    if(url.protocol!=='https:'||['localhost','127.0.0.1','[::1]'].includes(url.hostname)||url.username||url.password)return null;
    return new URL('/api/payments/payos',url.origin).href;
  }catch{return null;}
}
export function paymentChannelFingerprint(){
  return createHash('sha256').update(JSON.stringify([process.env.PAYOS_CLIENT_ID||'',paymentWebhookUrl()])).digest('hex');
}
/** Only field names and booleans may be returned to the authenticated admin. */
export function paymentConfiguration(){
  const webhookUrl=paymentWebhookUrl();
  const checks=[
    {field:'PAYOS_CLIENT_ID',label:'Client ID PayOS',configured:!!process.env.PAYOS_CLIENT_ID?.trim()},
    {field:'PAYOS_API_KEY',label:'API Key PayOS',configured:!!process.env.PAYOS_API_KEY?.trim()},
    {field:'PAYOS_CHECKSUM_KEY',label:'Checksum Key PayOS',configured:!!process.env.PAYOS_CHECKSUM_KEY?.trim()},
    {field:'SITE_URL',label:'Tên miền HTTPS công khai',configured:!!webhookUrl},
    {field:'ANTHROPIC_API_KEY',label:'Khóa dịch vụ luận giải để tạo bài sau thanh toán',configured:!!process.env.ANTHROPIC_API_KEY?.trim()},
    {field:'OPERATOR_NAME',label:'Tên đơn vị vận hành',configured:!!process.env.OPERATOR_NAME?.trim()},
    {field:'SUPPORT_EMAIL',label:'Email hỗ trợ',configured:/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.SUPPORT_EMAIL||'')},
  ];
  const verification=get<{created:number;detail:string}>("SELECT created,detail FROM audit_log WHERE action='payos-webhook-confirmed' ORDER BY id DESC LIMIT 1");
  let confirmedAt:number|null=null;
  if(verification){try{if(JSON.parse(verification.detail).channel===paymentChannelFingerprint())confirmedAt=verification.created;}catch{}}
  return {provider:process.env.PAYMENT_PROVIDER==='mock'?'mock':'payos',enabled:process.env.PAYMENTS_ENABLED==='1',
    configurationComplete:checks.every(check=>check.configured),checks,webhookUrl,confirmedAt,
    canConfirmWebhook:checks.slice(0,4).every(check=>check.configured)};
}
