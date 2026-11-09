require('./register-server-only.cjs');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const assert=require('node:assert/strict'),ts=require('typescript'),Module=require('node:module'),load=Module._load;
Module._load=function(name,...args){return load.call(this,name.startsWith('@/')?path.join(process.cwd(),name.slice(2)):name,...args);};
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);
Object.assign(process.env,{
  TUVI_DB_PATH:path.join(fs.mkdtempSync(path.join(os.tmpdir(),'tuvi-payos-')),'test.sqlite'),
  PAYMENT_PROVIDER:'payos',PAYMENTS_ENABLED:'0',PAYOS_CLIENT_ID:'simulation-client',PAYOS_API_KEY:'simulation-api-key',PAYOS_CHECKSUM_KEY:'simulation-checksum',
  ANTHROPIC_API_KEY:'simulation-ai-key-not-used',ADMIN_PASSWORD:'SimulationPassword!123',
  OPERATOR_NAME:'Đơn vị kiểm thử',SUPPORT_EMAIL:'support@example.invalid',SITE_URL:'https://xemtuvionline.vn',
  RESEND_API_KEY:'',MAIL_FROM:'',
});
const {get,run}=require('../lib/commerce/db.ts');
const {paymentConfiguration}=require('../lib/commerce/payment-setup.ts');
const orders=require('../app/api/orders/route.ts'),order=require('../app/api/orders/[token]/route.ts');
const readings=require('../app/api/readings/route.ts'),webhook=require('../app/api/payments/payos/route.ts');
const admin=require('../app/api/admin/route.ts'),session=require('../app/api/admin/session/route.ts');
const checks=[],requests=[];
let appBase='',providerMode='success';
// Sender schema and canonical signing fields are taken from payOS's published contract.
const sign=data=>crypto.createHmac('sha256',process.env.PAYOS_CHECKSUM_KEY).update(Object.keys(data).sort().map(k=>k+'='+data[k]).join('&')).digest('hex');
const input={name:'Khách thử PayOS',gender:'nam',calendar:'duong',date:'1992-04-09',hour:4,leap:false,year:2026};
const provider=http.createServer(async(req,res)=>{
  let raw='';for await(const part of req)raw+=part;
  const b=JSON.parse(raw||'{}');requests.push({path:req.url,body:b});
  assert.equal(req.headers['x-client-id'],process.env.PAYOS_CLIENT_ID);
  assert.equal(req.headers['x-api-key'],process.env.PAYOS_API_KEY);
  if(req.url==='/confirm-webhook'){
    assert.equal(b.webhookUrl,process.env.SITE_URL+'/api/payments/payos');
    const probe={orderCode:123,amount:3000,description:'VQRIO123',accountNumber:'12345678',reference:'simulated-confirmation-probe',transactionDateTime:'2023-02-04 18:25:00',currency:'VND',paymentLinkId:'124c33293c43417ab7879e14c8d9eb18',code:'00',desc:'Thành công'};
    const response=await fetch(appBase+'/api/payments/payos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:'00',desc:'success',success:true,data:probe,signature:sign(probe)})});
    assert.equal(response.status,200);
    res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({code:'00',desc:'success',data:{webhookUrl:b.webhookUrl}}));return;
  }
  if(req.url!=='/v2/payment-requests'){res.writeHead(501);res.end();return;}
  const canonical='amount='+b.amount+'&cancelUrl='+b.cancelUrl+'&description='+b.description+'&orderCode='+b.orderCode+'&returnUrl='+b.returnUrl;
  assert.equal(b.signature,crypto.createHmac('sha256',process.env.PAYOS_CHECKSUM_KEY).update(canonical).digest('hex'));
  assert.ok(b.description.length<=9);assert.equal(b.expiredAt,Math.floor(b.expiredAt));
  assert.equal(new URL(b.returnUrl).origin,process.env.SITE_URL);assert.equal(b.returnUrl,b.cancelUrl);
  if(providerMode==='error'){res.writeHead(503,{'Content-Type':'application/json'});res.end(JSON.stringify({code:'99',desc:'Simulated unavailable',data:null}));return;}
  const data={bin:'970422',accountNumber:'1234567890',accountName:'TAI KHOAN GIA LAP',amount:b.amount,description:b.description,orderCode:b.orderCode,
    currency:'VND',paymentLinkId:crypto.randomBytes(16).toString('hex'),status:'PENDING',checkoutUrl:'https://pay.payos.vn/web/simulation',qrCode:'simulated-qr'};
  res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({code:'00',desc:'success',data,signature:sign(data)}));
});
const app=http.createServer(async(req,res)=>{
  try{
    let raw='';for await(const part of req)raw+=part;
    const url=new URL(req.url,process.env.SITE_URL),method=req.method;
    const request=new Request(url,{method,headers:req.headers,...(raw?{body:raw}:{})});
    let handler,params={};
    if(url.pathname==='/api/orders')handler=orders[method];
    else if(url.pathname==='/api/readings')handler=readings[method];
    else if(url.pathname==='/api/payments/payos')handler=webhook[method];
    else if(url.pathname==='/api/admin/session')handler=session[method];
    else if(url.pathname==='/api/admin')handler=admin[method];
    else if(url.pathname.startsWith('/api/orders/')){handler=order[method];params={token:url.pathname.split('/').pop()};}
    if(!handler){res.writeHead(501);res.end();return;}
    const response=await handler(request,{params:Promise.resolve(params)});
    res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  }catch(error){console.error(error);res.writeHead(500);res.end();}
});
async function start(server){await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});return 'http://127.0.0.1:'+server.address().port;}
let cookie='';
async function call(route,method='GET',body,authenticated=false,origin=process.env.SITE_URL){
  const response=await fetch(appBase+route,{method,headers:{Origin:origin,'Content-Type':'application/json',...(authenticated?{Cookie:cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});
  return {response,data:await response.json()};
}
async function pay(order,reference,overrides={}){
  const row=get('SELECT * FROM orders WHERE code=?',order.code);
  const data={orderCode:order.code,amount:order.amount,description:'TVTEST',accountNumber:'1234567890',reference,transactionDateTime:'2026-11-09 12:00:00',currency:'VND',paymentLinkId:row.link_id,code:'00',desc:'Thành công',...overrides};
  return call('/api/payments/payos','POST',{code:'00',desc:'success',success:true,data,signature:sign(data)});
}
async function main(){
  process.env.TUVI_PAYOS_BASE_URL=await start(provider);appBase=await start(app);
  const configuration=paymentConfiguration();assert.equal(configuration.enabled,false);assert.equal(configuration.configurationComplete,true);
  assert.equal(configuration.confirmedAt,null);
  const safe=JSON.stringify(configuration);
  for(const value of [process.env.PAYOS_CLIENT_ID,process.env.PAYOS_API_KEY,process.env.PAYOS_CHECKSUM_KEY])assert.ok(!safe.includes(value));
  checks.push('Admin configuration reports only states and field names; no secret values');
  assert.equal((await call('/api/orders','POST',{input,email:'test@example.invalid',product:'single'})).response.status,503);
  assert.equal((await call('/api/admin','POST',{action:'confirm-payos-webhook'})).response.status,400);
  const login=await call('/api/admin/session','POST',{password:process.env.ADMIN_PASSWORD});
  assert.equal(login.response.status,200);cookie=login.response.headers.get('set-cookie').split(';')[0];
  assert.equal((await call('/api/admin','POST',{action:'confirm-payos-webhook'},true,'https://invalid.example')).response.status,400);
  const confirmed=await call('/api/admin','POST',{action:'confirm-payos-webhook'},true);
  assert.equal(confirmed.response.status,200);assert.ok(paymentConfiguration().confirmedAt);
  assert.equal(process.env.PAYMENTS_ENABLED,'0');
  process.env.PAYOS_CLIENT_ID='different-channel';assert.equal(paymentConfiguration().confirmedAt,null);process.env.PAYOS_CLIENT_ID='simulation-client';
  checks.push('Only authenticated same-origin admin can register webhook; signed provider probe reaches real handler; registration does not enable collection');
  process.env.PAYMENTS_ENABLED='1';
  const created=await call('/api/orders','POST',{input,email:'test@example.invalid',product:'deep'});
  assert.equal(created.response.status,201);
  const token=created.data.token,view=(await call('/api/orders/'+token+'?status=PAID&code=00')).data;
  assert.equal(view.status,'pending');assert.equal(view.credits,0);assert.ok(view.checkoutUrl);assert.ok(view.qrImage.startsWith('data:image/png'));
  assert.equal((await call('/api/readings','POST',{orderToken:token})).response.status,400);
  checks.push('Real create-order route calls SDK over HTTP with canonical signature, short description and signed response; return URL cannot unlock credits');
  assert.equal((await call('/api/payments/payos','POST',{data:{amount:1},signature:'forged'})).response.status,400);
  const wrong=await pay(view,'wrong-amount',{amount:view.amount-1});
  assert.equal(wrong.data.status,'review');assert.equal((await call('/api/orders/'+token)).data.credits,0);
  const valid=await pay(view,'correct-payment');assert.equal(valid.data.status,'matched');
  const duplicate=await pay(view,'correct-payment');assert.equal(duplicate.data.status,'duplicate');
  assert.equal((await call('/api/orders/'+token)).data.credits,1);
  const reserved=await Promise.all([call('/api/readings','POST',{orderToken:token}),call('/api/readings','POST',{orderToken:token})]);
  assert.equal(reserved[0].response.status,200);assert.equal(reserved[0].data.token,reserved[1].data.token);
  assert.equal((await call('/api/orders/'+token)).data.credits,0);
  checks.push('Forged webhook rejected; wrong amount held for review; signed correct payment opens exactly one credit and concurrent reservation spends it once');
  const late=await call('/api/orders','POST',{input,email:'late@example.invalid',product:'single'});
  const lateView=(await call('/api/orders/'+late.data.token)).data;
  run('UPDATE orders SET expires=? WHERE code=?',Date.now()-1000,lateView.code);
  assert.equal((await pay(lateView,'late-payment')).data.status,'review');
  assert.equal((await call('/api/orders/'+late.data.token)).data.status,'expired');
  const reconciled=await call('/api/admin','POST',{action:'reconcile',orderId:lateView.id,paymentId:'late-payment',reason:'Đối soát giả lập giao dịch đến muộn'},true);
  assert.equal(reconciled.response.status,200);assert.equal((await call('/api/orders/'+late.data.token)).data.credits,1);
  checks.push('Late payment is held for review and can be opened by authenticated reconciliation');
  providerMode='error';const before=requests.length;
  const failed=await call('/api/orders','POST',{input,email:'failure@example.invalid',product:'single'});
  assert.equal(failed.response.status,503);assert.equal(requests.length,before+1);
  const failedOrder=get("SELECT status FROM orders WHERE email='failure@example.invalid'");assert.equal(failedOrder.status,'failed');
  assert.equal(get("SELECT COUNT(*) n FROM credits c JOIN orders o ON o.id=c.order_id WHERE o.email='failure@example.invalid'").n,0);
  checks.push('Provider 503 is bounded to one request; failed checkout never grants credit');
  const dashboard=await call('/api/admin','GET',undefined,true);
  assert.equal(dashboard.response.status,200);assert.ok(dashboard.data.paymentConfiguration.confirmedAt);
  assert.equal(get('PRAGMA integrity_check').integrity_check,'ok');
  const report={passed:true,checks,providerCalls:requests.length,evidence:'Actual application route handlers + PayOS SDK + SQLite over local HTTP with signed contract-based responses and webhooks.',
    limitations:'No real PayOS keys, real registration, bank transfer or public webhook delivery tested. Installed Postman CLI 1.13.1 does not support webhook capture or Simulation.',
    sources:['https://payos.vn/docs/api/','https://payos.vn/docs/du-lieu-tra-ve/webhook/']};
  fs.writeFileSync('reports/payos-integration-tests.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}
main().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>{app.closeAllConnections();provider.closeAllConnections();app.close();provider.close();});
