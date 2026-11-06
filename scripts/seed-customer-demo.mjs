import fs from 'node:fs';import crypto from 'node:crypto';
const base='http://localhost:3100';let cookie='';
async function request(url,method='GET',body,customCookie){const r=await fetch(base+url,{method,headers:{Origin:base,'Content-Type':'application/json',Cookie:customCookie??cookie},body:body===undefined?undefined:JSON.stringify(body)});const j=await r.json();if(!r.ok)throw Error(j.error||'Lỗi tạo tài khoản thử');if(customCookie===undefined&&r.headers.get('set-cookie'))cookie=r.headers.get('set-cookie').split(';')[0];return {r,j};}
const mode=(await request('/api/auth/me')).j;if(!mode.demo||mode.paymentsEnabled)throw Error('Chỉ tạo tài khoản demo trong môi trường trải nghiệm riêng');
const file='storage/customer-demo-credentials.json';
const credentials=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{email:'demo@xemtuvionline.vn',password:'XemTuVi!'+crypto.randomBytes(12).toString('base64url')};
if(fs.existsSync(file))await request('/api/auth/login','POST',credentials);else{
  const signed=await request('/api/auth/signup','POST',credentials);
  if(signed.j.verification.demoUrl)await request('/api/auth/verify','POST',{token:new URL(signed.j.verification.demoUrl).searchParams.get('token')});
  fs.writeFileSync(file,JSON.stringify(credentials,null,2)+'\n',{mode:0o600});
}
const adminPassword=JSON.parse(fs.readFileSync('storage/demo-credentials.json','utf8')).password;
const admin=await request('/api/admin/session','POST',{password:adminPassword},'');
const adminCookie=admin.r.headers.get('set-cookie').split(';')[0];
let dashboard=(await request('/api/account')).j;
const welcome=dashboard.orders.find(o=>o.product==='welcome');
const adminDashboard=(await request('/api/admin','GET',undefined,adminCookie)).j;
const row=adminDashboard.orders.find(o=>o.id===welcome.id);
if(row.quantity<10)await request('/api/admin','POST',{action:'grant',orderId:welcome.id,count:10-row.quantity},adminCookie);
const input=JSON.parse(fs.readFileSync('storage/customer-demo-input.json','utf8'));
if(!dashboard.profiles.some(p=>{const i=JSON.parse(p.input);return i.date===input.date&&i.hour===input.hour&&i.gender===input.gender;}))await request('/api/account/profiles','POST',{input});
const reading=(await request('/api/account/readings','POST',{input})).j;
const token=reading.url.split('/').pop();await request('/api/readings/'+token,'POST',{});
const saved=(await request('/api/readings/'+token)).j;if(saved.status!=='done'||saved.text.includes('văn bản mẫu'))throw Error('Bài riêng chưa sẵn sàng');
dashboard=(await request('/api/account')).j;
const result={...credentials,loginUrl:base+'/dang-nhap',dashboardUrl:base+'/tai-khoan',readingUrl:base+reading.url,credits:dashboard.credits};
fs.writeFileSync('storage/customer-demo-access.json',JSON.stringify(result,null,2)+'\n',{mode:0o600});console.log(JSON.stringify(result,null,2));
