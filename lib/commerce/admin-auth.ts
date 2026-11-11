import {createHmac} from 'node:crypto';
import {get,run,transaction} from './db';
import {siteUrl} from './config';

export function adminTotpSecret() {
  const secret=(process.env.ADMIN_TOTP_SECRET||'').replace(/\s/g,'').toUpperCase();
  if(secret && !/^[A-Z2-7]{32,128}$/.test(secret))throw Error('Cấu hình xác thực hai lớp quản trị không hợp lệ');
  return secret;
}

export function adminMfaRequired() {
  const host=new URL(siteUrl()).hostname;
  return !['localhost','127.0.0.1','[::1]'].includes(host) || !!adminTotpSecret();
}

export function adminAuthFingerprint() {
  // Bind existing sessions to both factors. Password/secret rotation invalidates old sessions.
  return createHmac('sha256',process.env.ADMIN_PASSWORD||'').update(adminTotpSecret()).digest('hex');
}

export function adminSessionHash(token:string) {
  return createHmac('sha256',adminAuthFingerprint()).update(token).digest('hex');
}

function decodeBase32(value:string) {
  const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits=0,accumulator=0;const bytes:number[]=[];
  for(const char of value){
    const digit=alphabet.indexOf(char);if(digit<0)throw Error('Invalid Base32');
    accumulator=(accumulator<<5)|digit;bits+=5;
    if(bits>=8){bits-=8;bytes.push((accumulator>>>bits)&255);}
  }
  return Buffer.from(bytes);
}

/** RFC 6238, SHA-1, 30-second steps; eight digits are supported for RFC test vectors. */
export function totpAt(secret:string,step:number,digits=6) {
  const counter=Buffer.alloc(8);counter.writeBigUInt64BE(BigInt(step));
  const digest=createHmac('sha1',decodeBase32(secret)).update(counter).digest();
  const offset=digest[digest.length-1]&15;
  return String((digest.readUInt32BE(offset)&0x7fffffff)%10**digits).padStart(digits,'0');
}

export function consumeAdminTotp(code:string,now=Date.now()) {
  const secret=adminTotpSecret();
  if(!secret||!/^\d{6}$/.test(code))return false;
  const step=Math.floor(now/30000),match=[step-1,step,step+1].find(value=>value>=0&&totpAt(secret,value)===code);
  if(match===undefined)return false;
  return transaction(()=>{
    const fingerprint=adminAuthFingerprint();
    const previous=get<{step:number}>('SELECT step FROM admin_totp_steps WHERE fingerprint=?',fingerprint);
    if(previous&&previous.step>=match)return false;
    run('INSERT OR REPLACE INTO admin_totp_steps VALUES (?,?)',fingerprint,match);
    return true;
  });
}
