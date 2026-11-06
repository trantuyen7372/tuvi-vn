import {demoMode} from './auth';
import {siteUrl} from '../commerce/config';
export async function authMail(email:string,token:string,purpose:'verify'|'reset'){
  const url=`${siteUrl()}/${purpose==='verify'?'xac-minh-email':'dat-lai-mat-khau'}?token=${token}`;
  if(demoMode())return {status:'demo',demoUrl:url};
  if(!process.env.RESEND_API_KEY||!process.env.MAIL_FROM)return {status:'not_configured'};
  try{const r=await fetch('https://api.resend.com/emails',{method:'POST',signal:AbortSignal.timeout(15000),headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`auth-${token}`},body:JSON.stringify({from:process.env.MAIL_FROM,to:[email],subject:purpose==='verify'?'Xác minh email tài khoản Tử Vi':'Đặt lại mật khẩu Tử Vi',text:`${purpose==='verify'?'Xác nhận địa chỉ email của bạn':'Đặt lại mật khẩu của bạn'} tại ${url}\nLink chỉ dùng một lần. Nếu bạn không yêu cầu, hãy bỏ qua email này.`})});return {status:r.ok?'sent':'failed'};}catch{return {status:'failed'};}
}
