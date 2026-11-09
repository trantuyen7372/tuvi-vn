import {demoMode} from './auth';
import {siteUrl} from '../commerce/config';
import {hash} from '../commerce/security';
import {authEmailContent,type AuthMailPurpose} from './email-template';
import {sendEmail} from '../email';
export type AuthMailDelivery = {status:'sent'|'failed'|'not_configured'} | {status:'demo';demoUrl:string};

export async function authMail(email:string,token:string,purpose:AuthMailPurpose,welcomeCredits=0):Promise<AuthMailDelivery>{
  const origin=siteUrl();
  const url=`${origin}/${purpose==='verify'?'xac-minh-email':'dat-lai-mat-khau'}?token=${token}`;
  if(demoMode())return {status:'demo',demoUrl:url};
  return {status:await sendEmail({to:email,...authEmailContent(url,purpose,welcomeCredits)},`auth-${purpose}-${hash(token)}`)};
}
