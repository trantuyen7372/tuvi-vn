import fs from 'node:fs';
import path from 'node:path';
import {randomBytes} from 'node:crypto';

const target=process.argv[2]||'storage/admin-mfa-enrollment.json';
const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
let bits=0,value=0,secret='';
for(const byte of randomBytes(20)){
  value=(value<<8)|byte;bits+=8;
  while(bits>=5){bits-=5;secret+=alphabet[(value>>>bits)&31];}
}
fs.mkdirSync(path.dirname(target),{recursive:true,mode:0o700});
const uri='otpauth://totp/'+encodeURIComponent('Xem Tu Vi Online:admin')+'?secret='+secret+'&issuer='+encodeURIComponent('Xem Tu Vi Online')+'&algorithm=SHA1&digits=6&period=30';
fs.writeFileSync(target,JSON.stringify({ADMIN_TOTP_SECRET:secret,otpauthUrl:uri},null,2)+'\n',{flag:'wx',mode:0o600});
console.log('Đã tạo tệp đăng ký MFA riêng tư tại '+target+'. Nhập secret vào ứng dụng xác thực và môi trường máy chủ; không chia sẻ hoặc commit tệp này.');
