// Real auth routes + SQLite + a contract-based local Resend HTTP stand-in.
require('./register-server-only.cjs');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),http=require('node:http');
const assert=require('node:assert/strict'),ts=require('typescript'),Module=require('node:module'),load=Module._load;
Module._load=function(name,...args){return load.call(this,name.startsWith('@/')?path.join(process.cwd(),name.slice(2)):name,...args);};
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'tuvi-auth-email-'));
Object.assign(process.env,{TUVI_DB_PATH:path.join(directory,'test.sqlite'),PAYMENTS_ENABLED:'0',PAYMENT_PROVIDER:'payos',MAIL_PROVIDER:'resend',SMTP_PASSWORD:'',ANTHROPIC_API_KEY:'',RESEND_API_KEY:'simulation-email-key',MAIL_FROM:'Xem Tử Vi Online <account@example.invalid>',FREE_READING_CREDITS:'1',TRUST_PROXY:'0'});
const {db,get,run}=require('../lib/commerce/db.ts');
const {authMail}=require('../lib/customers/mail.ts'),{authEmailContent}=require('../lib/customers/email-template.ts');
const auth=require('../app/api/auth/[action]/route.ts'),account=require('../app/api/account/route.ts');
const checks=[],requests=[];let mode='success';
const provider=http.createServer(async(req,res)=>{
  if(req.method!=='POST'||req.url!=='/emails'){res.writeHead(501);res.end();return;}
  let raw='';for await(const part of req)raw+=part;
  requests.push({headers:req.headers,body:JSON.parse(raw)});
  if(mode==='disconnect'){res.destroy();return;}
  if(mode==='timeout')return;
  if(mode==='503'){res.writeHead(503,{'Content-Type':'text/html'});res.end('<h1>Unavailable</h1>');return;}
  res.writeHead(mode==='429'?429:200,{'Content-Type':'application/json'});
  res.end(JSON.stringify(mode==='429'?{statusCode:429,name:'rate_limit_exceeded',message:'Too many requests'}:mode==='malformed'?{}:{id:'simulation-email-id'}));
});
const app=http.createServer(async(req,res)=>{
  try{
    let raw='';for await(const part of req)raw+=part;
    const url=new URL(req.url,process.env.SITE_URL),request=new Request(url,{method:req.method,headers:req.headers,...(raw?{body:raw}:{})});
    const action=url.pathname.split('/').pop();
    const response=url.pathname==='/api/account'?await account.GET(request):await auth[req.method](request,{params:Promise.resolve({action})});
    res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  }catch{res.writeHead(500);res.end('{}');}
});
async function start(server){await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));return 'http://127.0.0.1:'+server.address().port;}
function client(){let cookie='';return async(route,body)=>{
  const r=await fetch(process.env.SITE_URL+route,{method:body?'POST':'GET',headers:{Origin:process.env.SITE_URL,'Content-Type':'application/json',Cookie:cookie},...(body?{body:JSON.stringify(body)}:{})});
  if(r.headers.get('set-cookie'))cookie=r.headers.get('set-cookie').split(';')[0];
  return {status:r.status,data:await r.json()};
};}
function pass(name){checks.push(name);console.log('PASS '+name);}
const password='AuthEmailTest!12345';
async function main(){
  process.env.SITE_URL=await start(app);process.env.TUVI_RESEND_BASE_URL=await start(provider);
  const a=client();const signup=await a('/api/auth/signup',{email:'first@example.invalid',password});
  assert.equal(signup.status,200);assert.equal(signup.data.verification.status,'sent');assert.equal(signup.data.verification.demoUrl,undefined);
  const first=requests[0],content=first.body;
  assert.equal(first.headers.authorization,'Bearer simulation-email-key');assert.deepEqual(content.to,['first@example.invalid']);
  assert.equal(content.from,process.env.MAIL_FROM);assert.ok(content.subject.includes('Xem Tử Vi Online'));
  assert.ok(content.html.includes('Xác minh email')&&content.html.includes('24 giờ')&&content.text.includes('1 lượt trải nghiệm'));
  const url=new URL(content.text.match(/http:\/\/[^\s]+/)[0]),token=url.searchParams.get('token');
  assert.equal(url.origin,process.env.SITE_URL);assert.equal(url.pathname,'/xac-minh-email');assert.match(token,/^[a-f0-9]{64}$/);
  assert.ok(!first.headers['idempotency-key'].includes(token));
  let dashboard=(await a('/api/account')).data;assert.equal(dashboard.credits,0);assert.equal(dashboard.verificationDelivery.status,'sent');
  const customer=get("SELECT * FROM customers WHERE email='first@example.invalid'");
  assert.ok(!JSON.stringify(get('SELECT * FROM customer_auth_tokens WHERE customer_id=?',customer.id)).includes(token));
  assert.ok(!JSON.stringify(get('SELECT * FROM audit_log WHERE target=?',customer.id)).includes(token));
  pass('Signup sends HTML and text through real HTTP; API exposes status only, stored token and idempotency key are hashed');
  assert.equal((await a('/api/auth/verify',{token})).status,200);assert.equal((await a('/api/auth/verify',{token})).status,400);
  dashboard=(await a('/api/account')).data;assert.equal(dashboard.credits,1);assert.equal(dashboard.verificationDelivery,null);
  const before=requests.length;assert.equal((await a('/api/auth/resend',{})).data.status,'verified');assert.equal(requests.length,before);
  pass('Email link verifies once and grants one credit; verified accounts do not send again');
  const noConfig=client();process.env.RESEND_API_KEY='';
  const unavailable=await noConfig('/api/auth/signup',{email:'configuration@example.invalid',password});assert.equal(unavailable.status,200);assert.equal(unavailable.data.verification.status,'not_configured');
  assert.equal((await noConfig('/api/account')).data.verificationDelivery.status,'not_configured');assert.equal(requests.length,before);
  process.env.RESEND_API_KEY='simulation-email-key';assert.equal((await noConfig('/api/auth/resend',{})).data.status,'sent');
  assert.equal((await noConfig('/api/account')).data.verificationDelivery.status,'sent');
  pass('Missing configuration preserves account and zero credits; resend recovers after configuration is fixed');
  for(const failure of ['429','503','malformed','disconnect']){
    mode=failure;const c=client(),count=requests.length;
    const failed=await c('/api/auth/signup',{email:`failure-${failure}@example.invalid`,password});
    assert.equal(failed.status,200);assert.equal(failed.data.verification.status,'failed');assert.equal(requests.length,count+1);
    assert.equal((await c('/api/account')).data.credits,0);assert.equal((await c('/api/account')).data.verificationDelivery.status,'failed');
    mode='success';assert.equal((await c('/api/auth/resend',{})).data.status,'sent');
  }
  pass('429, HTML 503, malformed success and disconnect report failure, never grant credits, and can recover by resend');
  const recovery=await a('/api/auth/forgot',{email:'first@example.invalid'}),resetMail=requests.at(-1).body;
  assert.ok(resetMail.text.includes('30 phút'));assert.ok(!resetMail.text.includes('1 lượt'));assert.ok(resetMail.html.includes('Đặt lại mật khẩu'));
  const unknown=await a('/api/auth/forgot',{email:'unknown@example.invalid'});assert.deepEqual(unknown.data,recovery.data);assert.equal(unknown.data.demoUrl,undefined);
  const resetToken=new URL(resetMail.text.match(/http:\/\/[^\s]+/)[0]).searchParams.get('token');
  assert.equal((await a('/api/auth/reset',{token:resetToken,password:'ChangedEmailTest!12345'})).status,200);assert.equal((await a('/api/account')).data.credits,1);
  pass('Password recovery uses 30-minute template, conceals account existence and does not duplicate the welcome credit');
  const rate=client();await rate('/api/auth/signup',{email:'limit@example.invalid',password});
  for(let i=0;i<3;i++)assert.equal((await rate('/api/auth/resend',{})).data.status,'sent');
  const count=requests.length;assert.equal((await rate('/api/auth/resend',{})).status,400);assert.equal(requests.length,count);
  pass('Resend is limited to three per account per hour before any further provider call');
  mode='timeout';const begin=Date.now();const timeout=await authMail('timeout@example.invalid','c'.repeat(64),'verify',1);
  assert.equal(timeout.status,'failed');assert.ok(Date.now()-begin>=14000&&Date.now()-begin<20000);
  mode='success';pass('A hanging provider is stopped by the real 15-second request timeout');
  const endpoint=process.env.TUVI_RESEND_BASE_URL;process.env.SITE_URL='https://xemtuvionline.vn';
  assert.equal((await authMail('test@example.invalid','d'.repeat(64),'verify')).status,'not_configured');
  process.env.SITE_URL='http://127.0.0.1:3100';process.env.TUVI_RESEND_BASE_URL='https://untrusted.example';
  assert.equal((await authMail('test@example.invalid','d'.repeat(64),'verify')).status,'not_configured');
  process.env.TUVI_RESEND_BASE_URL=endpoint;
  const escaped=authEmailContent('https://example.invalid/?x="<&','verify',1).html;
  assert.ok(escaped.includes('&quot;&lt;&amp;'));assert.ok(!escaped.includes('href="https://example.invalid/?x="'));
  fs.mkdirSync('outputs/auth-email',{recursive:true});
  fs.writeFileSync('outputs/auth-email/verification.html',authEmailContent('https://xemtuvionline.vn/xac-minh-email?token=demo-preview','verify',1).html);
  fs.writeFileSync('outputs/auth-email/reset.html',authEmailContent('https://xemtuvionline.vn/dat-lai-mat-khau?token=demo-preview','reset').html);
  pass('Local HTTP override cannot target a public site or remote mock; HTML escapes link values');
  const report={passed:true,checks,providerRequests:requests.length,evidence:'Actual auth routes, isolated SQLite and actual fetch to a local HTTP Resend stand-in; no real emails.',limitations:'Postman CLI 1.13.1 has no Simulation/status command; owner mock discovery skipped. No verified Resend domain, provider delivery, inbox placement or real credentials tested.',sources:['https://resend.com/docs/api-reference/emails/send-email','https://resend.com/docs/dashboard/domains/introduction']};
  fs.writeFileSync('reports/auth-email-tests.json',JSON.stringify(report,null,2)+'\n');
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{
  app.closeAllConnections();provider.closeAllConnections();app.close();provider.close();db().close();fs.rmSync(directory,{recursive:true,force:true});
});
