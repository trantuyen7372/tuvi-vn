import fs from 'node:fs';
const base='http://localhost:3100';
const password=JSON.parse(fs.readFileSync('storage/demo-credentials.json','utf8')).password;
async function post(url,data,cookie=''){
  const response=await fetch(base+url,{method:'POST',headers:{Origin:base,'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},body:data===undefined?undefined:JSON.stringify(data)});
  const value=await response.json();if(!response.ok)throw Error(value.error||'Không tạo được quyền demo');return {response,value};
}
const session=await post('/api/admin/session',{password});
const cookie=session.response.headers.get('set-cookie').split(';')[0];
const coupon='DEMO'+Date.now();
await post('/api/admin',{action:'coupon',code:coupon,percent:100,maxUses:1,days:7},cookie);
const input={name:'Lá số demo',gender:'nam',calendar:'duong',date:'2000-01-01',hour:0,leap:false,year:2026};
const created=await post('/api/orders',{input,email:'demo@example.com',product:'family',coupon});
const order=await (await fetch(base+'/api/orders/'+created.value.token)).json();
if(order.provider!=='mock'||order.status!=='paid')throw Error('Chỉ tạo bản xem demo trong môi trường thử');
const reading=await post('/api/readings',{orderToken:created.value.token,input});
await post('/api/readings/'+reading.value.token);
const saved=await (await fetch(base+'/api/readings/'+reading.value.token)).json();
if(saved.status!=='done'||!saved.text.includes('văn bản mẫu'))throw Error('Bài demo chưa sẵn sàng');
const result={email:'demo@example.com',orderUrl:base+created.value.url,readingUrl:base+reading.value.url,creditsRemaining:4,note:'Dữ liệu thử, không thanh toán thật; đăng nhập bằng link riêng, không có mật khẩu.'};
fs.writeFileSync('storage/customer-demo.json',JSON.stringify(result,null,2)+'\n',{mode:0o600});
console.log(JSON.stringify(result,null,2));
