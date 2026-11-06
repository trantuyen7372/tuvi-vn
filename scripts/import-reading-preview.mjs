import fs from 'node:fs';import crypto from 'node:crypto';import path from 'node:path';import {DatabaseSync} from 'node:sqlite';
// Công cụ biên tập nội bộ cho DB trải nghiệm local, không chạy trên DB production.
const dbFile=path.resolve('storage/customer-preview.sqlite');
const db=new DatabaseSync(dbFile);
const account=JSON.parse(fs.readFileSync('storage/customer-demo-credentials.json','utf8'));
const input=JSON.parse(fs.readFileSync('storage/customer-demo-input.json','utf8'));
input.name=`${input.gender==='nam'?'Nam':'Nữ'} ${input.date.split('-').reverse().join('/')} — Bản đọc thử chuyên sâu`;
const text=fs.readFileSync('outputs/ban-luan-doc-thu.md','utf8');
if(!text.includes('không có giao dịch trả phí'))throw Error('Bản thử cần được ghi rõ không thu tiền');
const owner=db.prepare("SELECT id FROM customers WHERE email=? AND status='active'").get(account.email);
if(!owner)throw Error('Không tìm thấy chủ tài khoản demo');
const order=db.prepare("SELECT id FROM orders WHERE customer_id=? AND product='welcome' AND status='paid' AND amount=0 LIMIT 1").get(owner.id);
if(!order)throw Error('Không có quyền trải nghiệm hợp lệ');
const fingerprint=crypto.createHash('sha256').update('editorial-preview:'+JSON.stringify(input)+text).digest('hex');
let reading=db.prepare('SELECT id,token FROM readings WHERE order_id=? AND input=? AND status=\'done\'').get(order.id,JSON.stringify(input));
if(reading){db.prepare('UPDATE readings SET text=?,completed=? WHERE id=?').run(text,Date.now(),reading.id);}
if(!reading){const id=crypto.randomBytes(12).toString('hex'),token=crypto.randomBytes(32).toString('hex'),now=Date.now();
  db.prepare("INSERT INTO readings(id,token,order_id,fingerprint,input,status,text,created,completed,email_status) VALUES (?,?,?,?,?,'done',?,?,?,'not_configured')").run(id,token,order.id,fingerprint,JSON.stringify(input),text,now,now);reading={token};
  db.prepare('INSERT INTO audit_log(action,target,detail,created) VALUES (?,?,?,?)').run('local-editorial-preview',id,JSON.stringify({unpaid:true}),now);
}
const result={url:`http://localhost:3100/luan-giai/${reading.token}`,words:text.split(/\s+/).length};fs.writeFileSync('storage/editorial-preview.json',JSON.stringify(result,null,2)+'\n',{mode:0o600});console.log(JSON.stringify(result));db.close();
