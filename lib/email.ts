import 'server-only';
import nodemailer from 'nodemailer';
import {createHash} from 'node:crypto';
import {siteUrl} from './commerce/config';

export type EmailStatus = 'sent' | 'failed' | 'not_configured';
interface Message {to:string;subject:string;text:string;html?:string}
export function mailProvider(){return process.env.MAIL_PROVIDER||(process.env.RESEND_API_KEY?'resend':'gmail');}
export function mailConfigured(){
  if(!process.env.MAIL_FROM)return false;
  return mailProvider()==='gmail'
    ? !!process.env.SMTP_USER&&!!process.env.SMTP_PASSWORD
    : mailProvider()==='resend'&&!!process.env.RESEND_API_KEY;
}
export async function sendEmail(message:Message,idempotencyKey:string):Promise<EmailStatus>{
  if(!mailConfigured())return 'not_configured';
  try{
    const site=new URL(siteUrl()),local=['localhost','127.0.0.1'].includes(site.hostname);
    const testSMTP=mailProvider()==='gmail'?process.env.TUVI_SMTP_TEST_PORT:undefined;
    const testHTTP=mailProvider()==='resend'?process.env.TUVI_RESEND_BASE_URL:undefined;
    if((testSMTP||testHTTP)&&!local)return 'not_configured';
    if(!testSMTP&&!testHTTP&&(!process.env.SITE_URL||site.protocol!=='https:'||local))return 'not_configured';
    if(mailProvider()==='gmail'){
      const port=testSMTP?Number(testSMTP):465;
      if(!Number.isInteger(port)||port<1||port>65535)return 'not_configured';
      const transport=nodemailer.createTransport({
        host:testSMTP?'127.0.0.1':'smtp.gmail.com',port,secure:!testSMTP,
        auth:{user:process.env.SMTP_USER!,pass:process.env.SMTP_PASSWORD!.replace(/\s/g,'')},
        connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000,
        tls:{minVersion:'TLSv1.2'},disableFileAccess:true,disableUrlAccess:true,
      });
      try{
        const result=await transport.sendMail({
          from:process.env.MAIL_FROM!,to:message.to,replyTo:process.env.SUPPORT_EMAIL||process.env.SMTP_USER,
          subject:message.subject,text:message.text,...(message.html?{html:message.html}:{}),
          messageId:`<${createHash('sha256').update(idempotencyKey).digest('hex')}@${site.hostname}>`,
        });
        return result.accepted.length>0&&result.rejected.length===0?'sent':'failed';
      }finally{transport.close();}
    }
    let endpoint='https://api.resend.com/emails';
    if(testHTTP){
      const url=new URL(testHTTP);
      if(url.protocol!=='http:'||url.hostname!=='127.0.0.1')return 'not_configured';
      endpoint=new URL('/emails',url).href;
    }
    const response=await fetch(endpoint,{
      method:'POST',signal:AbortSignal.timeout(15000),
      headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':idempotencyKey},
      body:JSON.stringify({from:process.env.MAIL_FROM,to:[message.to],subject:message.subject,text:message.text,...(message.html?{html:message.html}:{})}),
    });
    if(!response.ok)return 'failed';
    const result=await response.json();return typeof result?.id==='string'&&result.id.length>0?'sent':'failed';
  }catch{return 'failed';}
}
