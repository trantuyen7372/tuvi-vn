require('./register-server-only.cjs');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const ts=require('typescript'),Module=require('node:module'),load=Module._load;
Module._load=function(name,...args){return load.call(this,name.startsWith('@/')?path.join(process.cwd(),name.slice(2)):name,...args);};
require.extensions['.ts']=(module,file)=>module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,file);
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'tuvi-funnel-'));
Object.assign(process.env,{TUVI_DB_PATH:path.join(directory,'test.sqlite'),SITE_URL:'https://review.example.invalid',PAYMENTS_ENABLED:'1',PAYMENT_PROVIDER:'payos',READING_ENGINE:'dataset',ANTHROPIC_API_KEY:'',FUNNEL_ANALYTICS_ENABLED:'1',ADMIN_PASSWORD:'FunnelAdminFixture!123',ADMIN_TOTP_SECRET:'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ',TRUST_PROXY:'0'});
const {db,get,all,run}=require('../lib/commerce/db.ts'),funnel=require('../lib/funnel.ts');
const events=require('../app/api/events/route.ts'),adminRoute=require('../app/api/admin/route.ts'),readingRoute=require('../app/api/readings/[token]/route.ts'),orderRoute=require('../app/api/orders/route.ts');
const {createOrder,receivePayment,reserveReading,orderByToken}=require('../lib/commerce/store.ts');
const {PRODUCTS,familySaving}=require('../lib/commerce/config.ts'),offers=require('../lib/commerce/offers.ts');
const {createSession,sessionCookie}=require('../lib/customers/auth.ts'),{secret}=require('../lib/commerce/security.ts'),{adminSessionHash}=require('../lib/commerce/admin-auth.ts');
const checks=[],pass=name=>{checks.push(name);console.log('PASS '+name);};
const input={name:'PRIVATE TEST NAME',date:'1990-01-01',hour:3,gender:'nam',calendar:'duong',leap:false,year:2026};
const request=(route,body,cookie='',headers={})=>new Request(process.env.SITE_URL+route,{method:body===undefined?'GET':'POST',headers:{Origin:process.env.SITE_URL,Cookie:cookie,'Content-Type':'application/json',...headers},...(body===undefined?{}:{body:JSON.stringify(body)})});
async function event(event,source='direct',cookie='',headers={},extra={}){return events.POST(request('/api/events',{event,source,...extra},cookie,headers));}
const report=()=>funnel.funnelReport(0,Date.now()+86400000);
const count=event=>report().steps.find(row=>row.event===event).visits;
async function main(){
  assert.equal(familySaving(),46000);assert.equal(PRODUCTS.find(p=>p.id==='family').price,199000);
  assert.ok(PRODUCTS.find(p=>p.id==='family').price/5<PRODUCTS.find(p=>p.id==='single').price);
  assert.ok(PRODUCTS.every(p=>p.listPrice===p.price));assert.deepEqual(offers.availableProducts().map(p=>p.id),['single','family']);
  process.env.ANTHROPIC_API_KEY='fixture-not-a-real-key';assert.equal(offers.deepReadingAvailable(),true);process.env.ANTHROPIC_API_KEY='';
  pass('Family pricing saves 46,000 VND versus five singles; unavailable deep service is not offered');

  const initial=await event('visit','google');assert.equal(initial.status,204);
  const cookie=initial.headers.get('set-cookie').split(';')[0];assert.match(initial.headers.get('set-cookie'),/HttpOnly; SameSite=Lax/);assert.match(initial.headers.get('set-cookie'),/; Secure/);
  await event('visit','facebook',cookie);await event('chart_created','facebook',cookie);await event('chart_created','facebook',cookie);await event('pricing_view','facebook',cookie);
  assert.equal(count('visit'),1);assert.equal(count('chart_created'),1);assert.equal(report().sources[0].source,'google');
  const visit=funnel.visitForRequest(request('/',undefined,cookie));assert.match(visit,/^[a-f0-9]{64}$/);
  assert.ok(!get('SELECT id FROM funnel_visits WHERE id=?',cookie.split('=')[1]));
  pass('A short-lived HttpOnly visit cookie deduplicates milestones and keeps first-touch source');

  const before=get('SELECT COUNT(*) n FROM funnel_events').n;
  for(const name of ['purchase','order_created','reading_opened','unknown'])assert.equal((await event(name,'direct',cookie)).status,400);
  assert.equal((await event('visit','owner@example.invalid',cookie)).status,400);
  assert.equal((await event('visit','direct',cookie,{}, {email:'private@example.invalid',url:'/luan-giai/'+secret()})).status,400);
  assert.equal((await event('visit','direct','',{Origin:'https://foreign.example.invalid'})).status,400);
  for(const headers of [{DNT:'1'},{'Sec-GPC':'1'}]){const response=await event('visit','direct','',headers);assert.equal(response.status,204);assert.equal(response.headers.get('set-cookie'),null);}
  process.env.FUNNEL_ANALYTICS_ENABLED='0';assert.equal((await event('visit')).headers.get('set-cookie'),null);process.env.FUNNEL_ANALYTICS_ENABLED='1';
  assert.equal(get('SELECT COUNT(*) n FROM funnel_events').n,before);
  assert.deepEqual(all('PRAGMA table_info(funnel_events)').map(row=>row.name),['visit_id','event','created']);
  pass('Forged paid events, private payload fields and foreign origins are rejected; DNT/GPC and disable switch skip tracking');

  const first=createOrder('owner@example.invalid','single',input,'','payos',visit);
  const second=createOrder('owner@example.invalid','family',input,'','payos',visit);
  assert.equal(count('order_created'),1);assert.equal(count('purchase'),0);assert.equal(report().payments.gross,0);
  const settle=(purchase,reference)=>{
    run('UPDATE orders SET link_id=? WHERE id=?','fixture-'+purchase.order.id,purchase.order.id);
    return receivePayment({reference,orderCode:purchase.order.code,amount:purchase.order.amount,paymentLinkId:'fixture-'+purchase.order.id,code:'00',currency:'VND'});
  };
  assert.equal(settle(first,'fixture-tx-1'),'matched');assert.equal(settle(first,'fixture-tx-1'),'duplicate');assert.equal(settle(second,'fixture-tx-2'),'matched');
  assert.equal(count('purchase'),1);assert.equal(report().payments.paidOrders,2);assert.equal(report().payments.gross,248000);
  run("UPDATE orders SET status='refunded',refunded_at=? WHERE id=?",Date.now(),first.order.id);
  assert.equal(report().payments.refunded,49000);assert.equal(report().payments.net,199000);
  run('INSERT INTO coupons VALUES (?,?,?,?)','FUNNELFREE',100,10,Date.now()+600000);
  createOrder('free@example.invalid','single',input,'FUNNELFREE','payos',visit);
  const mock=createOrder('mock@example.invalid','family',input,'','mock',visit);run("UPDATE orders SET status='paid',paid_at=? WHERE id=?",Date.now(),mock.order.id);
  assert.equal(report().payments.paidOrders,2);assert.equal(report().payments.gross,248000);
  run('UPDATE orders SET amount=299000 WHERE id=?',mock.order.id);assert.equal(orderByToken(mock.token).amount,299000);
  pass('Only confirmed positive PayOS payments enter revenue; duplicates, mocks and free orders do not; refunds reduce net revenue');

  run('INSERT INTO customers(id,email,password_hash,verified,created) VALUES (?,?,?,?,?)','owner','owner@example.invalid','unused',1,Date.now());
  run('UPDATE orders SET customer_id=? WHERE id=?','owner',second.order.id);
  const ownerCookie=sessionCookie(createSession('owner')).split(';')[0];
  const row=reserveReading(second.order,input);run("UPDATE readings SET status='done',text='Private fixture reading' WHERE id=?",row.id);
  const ctx={params:Promise.resolve({token:row.token})};
  assert.equal((await readingRoute.GET(request('/api/readings/'+row.token,undefined,cookie),ctx)).status,401);assert.equal(count('reading_opened'),0);
  for(let i=0;i<2;i++)assert.equal((await readingRoute.GET(request('/api/readings/'+row.token,undefined,ownerCookie+'; '+cookie),ctx)).status,200);
  assert.equal(count('reading_opened'),1);
  assert.equal((await orderRoute.POST(request('/api/orders',{input,product:'deep'},ownerCookie))).status,503);
  const adminToken=secret();run('INSERT INTO admin_sessions VALUES (?,?)',adminSessionHash(adminToken),Date.now()+60000);
  assert.equal((await adminRoute.GET(request('/api/admin'))).status,401);
  const admin=await adminRoute.GET(request('/api/admin',undefined,'tuvi_admin='+adminToken));assert.equal(admin.status,200);
  const dashboard=await admin.json();assert.equal(dashboard.funnel.payments.net,199000);
  assert.ok(!JSON.stringify(dashboard.funnel).includes(input.name));assert.ok(!JSON.stringify(dashboard.funnel).includes(row.token));
  pass('Reading-open milestones require an authorized completed reading; only authenticated admin sees aggregate analytics');

  const old=secret();run('INSERT INTO funnel_visits VALUES (?,?,?,?)',old,'direct',Date.now()-91*86400000,Date.now()-91*86400000);funnel.milestone(old,'visit');run('UPDATE orders SET funnel_visit=? WHERE id=?',old,mock.order.id);
  funnel.pruneFunnel(Date.now()+3600001);assert.equal(get('SELECT id FROM funnel_visits WHERE id=?',old),undefined);assert.equal(get('SELECT visit_id FROM funnel_events WHERE visit_id=?',old),undefined);assert.equal(get('SELECT funnel_visit FROM orders WHERE id=?',mock.order.id).funnel_visit,null);
  run('DROP TABLE funnel_events');const stillWorks=createOrder('safe@example.invalid','single',input,'FUNNELFREE','payos',visit);assert.equal(stillWorks.order.status,'paid');
  pass('Retention removes old visit data and references; analytics failure cannot block a free checkout');

  const code=ts.transpileModule(fs.readFileSync('lib/funnel-client.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
  const sent=[],context={exports:{},URL,Date,AbortSignal,window:{},navigator:{doNotTrack:'0'},location:{href:'https://site.example/la-so?ngay=1990-01-01&ten=PRIVATE&email=private@example.invalid',hostname:'site.example'},document:{referrer:'https://www.google.com/search?q=private'},fetch:async(url,options)=>{sent.push({url,...options});}};
  vm.runInNewContext(code,context);await context.exports.trackFunnel('chart_created');
  assert.equal(sent.length,2);for(const item of sent){assert.equal(item.url,'/api/events');assert.equal(item.referrerPolicy,'no-referrer');assert.deepEqual(JSON.parse(item.body),{event:JSON.parse(item.body).event,source:'google'});assert.ok(!item.body.includes('PRIVATE'));assert.ok(!item.body.includes('1990'));}
  context.navigator.doNotTrack='1';await context.exports.trackFunnel('pricing_view');assert.equal(sent.length,2);
  pass('Client sends only milestone and coarse source, never the birth/query URL or referrer; opt-out prevents requests');
  console.log(JSON.stringify({passed:checks.length,checks}));
}
main().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>{db().close();fs.rmSync(directory,{recursive:true,force:true});});
