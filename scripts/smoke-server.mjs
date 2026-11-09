import assert from 'node:assert/strict';import crypto from 'node:crypto';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
const revision=readFileSync(new URL('../lib/personal-reading.ts',import.meta.url),'utf8').match(/READING_REVISION\s*=\s*(\d+)/)?.[1];
assert.ok(revision,'Không xác định được phiên bản bài luận của mã vừa triển khai');
if(process.env.READING_ENGINE!=='dataset'||process.env.PAYMENTS_ENABLED!=='0'||process.env.RESEND_API_KEY||process.env.SMTP_PASSWORD)throw Error('Chỉ kiểm tra bản trải nghiệm dùng dữ liệu, tắt thu tiền và chưa cấu hình gửi email thật');
const base='http://127.0.0.1:3100',origin=process.env.SITE_URL;let cookie='';
async function req(url,method='GET',data){const r=await fetch(base+url,{method,headers:{Origin:origin,'Content-Type':'application/json',Cookie:cookie,'X-Real-IP':'127.0.0.1'},body:data===undefined?undefined:JSON.stringify(data)});const j=await r.json();if(!r.ok)throw Error(`${url}: ${r.status}: ${j.error||''}`);if(r.headers.get('set-cookie'))cookie=r.headers.get('set-cookie').split(';')[0];return j;}
assert.equal((await req('/api/health')).ok,true);
const mode=await req('/api/auth/me');assert.equal(mode.paymentsEnabled,false);assert.equal(mode.demo,false);
const email=`deployment-check-${Date.now()}@example.com`,password=crypto.randomBytes(20).toString('base64url');
const registration=await req('/api/auth/signup','POST',{email,password});assert.equal(registration.verification.status,'not_configured');assert.equal(registration.verification.demoUrl,undefined);
assert.equal((await req('/api/account')).credits,0);
// Privileged deployment check: create a one-use token for this test account only.
// The real verify endpoint is exercised; this does not test email delivery.
const verification=crypto.randomBytes(32).toString('hex'),db=new DatabaseSync(process.env.TUVI_DB_PATH||'storage/tuvi.sqlite');
try{
  const owner=db.prepare('SELECT id FROM customers WHERE email=?').get(email);
  db.prepare('INSERT INTO customer_auth_tokens VALUES (?,?,?,?,NULL)').run(crypto.createHash('sha256').update(verification).digest('hex'),owner.id,'verify',Date.now()+60000);
}finally{db.close();}
await req('/api/auth/verify','POST',{token:verification});assert.equal((await req('/api/account')).credits,1);
const input={name:'Kiểm tra triển khai',gender:'nam',calendar:'duong',date:'2000-01-01',hour:0,leap:false,year:2026};
await req('/api/account/profiles','POST',{input});const created=await req('/api/account/readings','POST',{input});const token=created.url.split('/').pop();await req('/api/readings/'+token,'POST',{});
const saved=await req('/api/readings/'+token);assert.equal(saved.status,'done');assert.ok(saved.text.length>10000&&!saved.text.includes('văn bản mẫu'));
assert.ok(saved.text.includes('Căn cứ: Mệnh tại')&&saved.text.includes('## Các giai đoạn tiếp theo')&&saved.text.includes('### Năm 2030'));
assert.ok(saved.text.includes('## Những điểm cần đọc kỹ nhất')&&/<!-- tuvi-reading:sao-cung-van-han-v\d+ -->/.test(saved.text));
assert.ok(saved.text.includes(`<!-- tuvi-reading:sao-cung-van-han-v${revision} -->`),'Bài vừa tạo phải dùng đúng phiên bản vừa triển khai');
const dashboard=await req('/api/account');assert.equal(dashboard.credits,0);assert.equal(dashboard.profiles.length,1);assert.equal(dashboard.readings.length,1);
assert.ok(saved.text.includes('## Xu hướng chính theo từng giai đoạn'));assert.equal(saved.canPersonalize,true);
await req('/api/account/readings/preferences','POST',{token,preferences:{focus:'career',situation:'changing'}});
const personalized=await req('/api/readings/'+token);assert.equal(personalized.input.reading.focus,'career');assert.ok(personalized.text.includes('Thông tin bạn cung cấp, chưa được xác minh'));assert.equal(personalized.attempts,saved.attempts);
await req('/api/account/readings/preferences','POST',{token,preferences:null});
assert.equal((await req('/api/readings/'+token)).input.reading,undefined);assert.equal((await req('/api/account')).credits,0);
await req('/api/account','DELETE',{password});
console.log(JSON.stringify({health:true,paymentsEnabled:false,authDemoLinksExposed:false,registration:true,personalReading:true,starPalaceEvidence:true,futurePeriods:true,stageSynthesis:true,personalizationWithoutExtraCredit:true,remainingCreditsCorrect:true,testPersonalDataRemoved:true}));
