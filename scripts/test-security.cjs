// Exercise real handlers against a disposable database; no real mail, payments or AI.
require('./register-server-only.cjs');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
const {scryptSync,randomBytes}=require('node:crypto'),ts=require('typescript'),Module=require('node:module'),originalLoad=Module._load;
Module._load=function(name,...args){return originalLoad.call(this,name.startsWith('@/')?path.join(process.cwd(),name.slice(2)):name,...args);};
require.extensions['.ts']=(module,file)=>module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,file);
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'tuvi-security-'));
Object.assign(process.env,{TUVI_DB_PATH:path.join(directory,'test.sqlite'),SITE_URL:'https://review.example.invalid',READING_ENGINE:'dataset',FREE_READING_CREDITS:'0',PAYMENTS_ENABLED:'0',PAYMENT_PROVIDER:'mock',TUVI_ALLOW_TEST_PAYMENTS:'1',ANTHROPIC_API_KEY:'',RESEND_API_KEY:'',SMTP_PASSWORD:'',MAIL_FROM:'',ADMIN_PASSWORD:'ReviewAdminPassword!123',ADMIN_TOTP_SECRET:'',TRUST_PROXY:'0'});
const {db,get,run}=require('../lib/commerce/db.ts');
const auth=require('../lib/customers/auth.ts'),{secret,hash,admin}=require('../lib/commerce/security.ts');
const mfa=require('../lib/commerce/admin-auth.ts');
const authRoute=require('../app/api/auth/[action]/route.ts');
const readings=require('../app/api/readings/[token]/route.ts'),orders=require('../app/api/orders/[token]/route.ts');
const reserve=require('../app/api/readings/route.ts'),newOrder=require('../app/api/orders/route.ts'),adminRoute=require('../app/api/admin/session/route.ts');
const {createOrder,reserveReading,credits}=require('../lib/commerce/store.ts');
const {safeCustomerDestination}=require('../lib/customers/client.ts');
const checks=[];
function pass(name){checks.push(name);console.log('PASS '+name);}
function request(route,body,cookie='',origin=process.env.SITE_URL){return new Request(process.env.SITE_URL+route,{method:body===undefined?'GET':'POST',headers:{Origin:origin,Cookie:cookie,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});}
function cookie(response){return response.headers.get('set-cookie')?.split(';')[0]||'';}
function session(id){return auth.sessionCookie(auth.createSession(id)).split(';')[0];}
function authPost(action,body,cookieValue=''){return authRoute.POST(request('/api/auth/'+action,body,cookieValue),{params:Promise.resolve({action})});}
function ctx(token){return {params:Promise.resolve({token})};}
const password='SecurityFixturePassword!123';
const input={name:'Synthetic private fixture',gender:'nam',calendar:'duong',date:'1990-01-01',hour:3,leap:false,year:2026};
async function main(){
  const encoded=await auth.passwordHash(password);
  assert.match(encoded,/^scrypt\$v2\$32768\$8\$3\$/);assert.equal(await auth.passwordMatches(password,encoded),true);
  assert.equal(await auth.passwordMatches('incorrect',encoded),false);assert.equal(await auth.passwordMatches(password,'malformed'),false);
  assert.equal(await auth.passwordMatches(password+'x'.repeat(129),encoded),false);
  const salt=randomBytes(16).toString('hex'),legacy=`scrypt$${salt}$${scryptSync(password,salt,64).toString('hex')}`;
  assert.equal(await auth.passwordMatches(password,legacy),true);assert.equal(auth.passwordNeedsUpgrade(legacy),true);
  run('INSERT INTO customers(id,email,password_hash,verified,created) VALUES (?,?,?,?,?)','owner','owner@example.invalid',legacy,1,Date.now());
  run('INSERT INTO customers(id,email,password_hash,verified,created) VALUES (?,?,?,?,?)','other','other@example.invalid',encoded,1,Date.now());
  run('INSERT INTO customers(id,email,password_hash,verified,created) VALUES (?,?,?,?,?)','unverified','guest@example.invalid',encoded,0,Date.now());
  assert.equal((await authPost('login',{email:'owner@example.invalid',password:'incorrect'})).status,401);
  assert.equal(get('SELECT password_hash FROM customers WHERE id=?','owner').password_hash,legacy);
  const login=await authPost('login',{email:'owner@example.invalid',password});assert.equal(login.status,200);
  assert.match(get('SELECT password_hash FROM customers WHERE id=?','owner').password_hash,/^scrypt\$v2\$/);
  pass('Strong scrypt hashes validate; legacy login upgrades only after a valid password');

  const oldCookie=cookie(login),secondCookie=session('owner'),resetToken=auth.issueAuthToken('owner','reset');
  assert.equal((await authPost('password',{oldPassword:'wrong',password:'NewPasswordFixture!456'},oldCookie)).status,400);
  assert.equal(get('SELECT used FROM customer_auth_tokens WHERE hash=?',hash(resetToken)).used,null);
  const changed=await authPost('password',{oldPassword:password,password:'NewPasswordFixture!456'},oldCookie);assert.equal(changed.status,200);
  assert.equal(auth.customer(request('/api/auth/me',undefined,oldCookie)),undefined);
  assert.equal(auth.customer(request('/api/auth/me',undefined,secondCookie)),undefined);
  assert.equal(auth.customer(request('/api/auth/me',undefined,cookie(changed))).id,'owner');
  assert.equal((await authPost('reset',{token:resetToken,password:'AttackerFixture!789'})).status,400);
  assert.equal(await auth.passwordMatches('NewPasswordFixture!456',get('SELECT password_hash FROM customers WHERE id=?','owner').password_hash),true);
  const freshReset=auth.issueAuthToken('owner','reset');
  assert.equal((await authPost('reset',{token:freshReset,password})).status,200);
  assert.equal((await authPost('reset',{token:freshReset,password})).status,400);
  pass('Password change revokes all old sessions and reset links; a fresh reset is single-use');

  const ownerCookie=session('owner'),otherCookie=session('other'),unverifiedCookie=session('unverified');
  run('INSERT INTO coupons VALUES (?,?,?,?)','SECURITYFREE',100,20,Date.now()+600000);
  const purchase=createOrder('owner@example.invalid','family',input,'SECURITYFREE','mock');
  run('UPDATE orders SET customer_id=? WHERE id=?','owner',purchase.order.id);
  const row=reserveReading(purchase.order,input);run("UPDATE readings SET status='done',text='Private fixture text' WHERE id=?",row.id);
  const before=credits(purchase.order.id);
  for(const [cookieValue,status] of [['',401],[otherCookie,404],[ownerCookie,200]]){
    const read=await readings.GET(request('/api/readings/'+row.token,undefined,cookieValue),ctx(row.token));assert.equal(read.status,status);
    const text=JSON.stringify(await read.json());if(status!==200){assert.ok(!text.includes(input.name));assert.ok(!text.includes('Private fixture text'));}
    assert.equal((await readings.POST(request('/api/readings/'+row.token,{},cookieValue),ctx(row.token))).status,status);
    assert.equal((await orders.GET(request('/api/orders/'+purchase.token,undefined,cookieValue),ctx(purchase.token))).status,status);
    const reserved=await reserve.POST(request('/api/readings',{orderToken:purchase.token,input:{...input,hour:4}},cookieValue));assert.equal(reserved.status,status);
  }
  assert.equal(credits(purchase.order.id),before-1);
  assert.equal((await readings.POST(request('/api/readings/'+row.token,{},ownerCookie,'https://foreign.example.invalid'),ctx(row.token))).status,400);
  pass('Anonymous and other accounts cannot read, generate or spend an order; the owner can');

  const guest=createOrder('guest@example.invalid','single',input,'SECURITYFREE','mock'),guestRow=reserveReading(guest.order,input);
  assert.equal((await readings.GET(request('/api/readings/'+guestRow.token,undefined,unverifiedCookie),ctx(guestRow.token))).status,404);
  assert.equal(get('SELECT customer_id FROM orders WHERE id=?',guest.order.id).customer_id,null);
  run('UPDATE customers SET verified=1 WHERE id=?','unverified');
  assert.equal((await readings.GET(request('/api/readings/'+guestRow.token,undefined,unverifiedCookie),ctx(guestRow.token))).status,200);
  assert.equal(get('SELECT customer_id FROM orders WHERE id=?',guest.order.id).customer_id,'unverified');
  assert.equal((await orders.GET(request('/api/orders/'+guest.token,undefined,otherCookie),ctx(guest.token))).status,404);
  pass('Legacy guest purchases are claimed only by the verified matching email');

  process.env.PAYMENTS_ENABLED='1';
  const orderBody={input,product:'single',coupon:'SECURITYFREE',email:'someone-else@example.invalid'};
  assert.equal((await newOrder.POST(request('/api/orders',orderBody))).status,401);
  run('UPDATE customers SET verified=0 WHERE id=?','unverified');
  assert.equal((await newOrder.POST(request('/api/orders',orderBody,unverifiedCookie))).status,403);
  const created=await newOrder.POST(request('/api/orders',orderBody,ownerCookie));assert.equal(created.status,201);
  const createdToken=(await created.json()).token;
  const orderView=await orders.GET(request('/api/orders/'+createdToken,undefined,ownerCookie),ctx(createdToken));
  assert.equal(orderView.status,200);assert.equal((await orderView.json()).email,'owner@example.invalid');
  assert.equal(get('SELECT COUNT(*) n FROM orders WHERE email=?','someone-else@example.invalid').n,0);
  pass('New orders require a verified account and use its email instead of client-supplied identity');

  const seed='GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
  for(const [time,expected] of [[59,'94287082'],[1111111109,'07081804'],[1111111111,'14050471'],[1234567890,'89005924'],[2000000000,'69279037'],[20000000000,'65353130']])assert.equal(mfa.totpAt(seed,Math.floor(time/30),8),expected);
  assert.equal((await adminRoute.POST(request('/api/admin/session',{password:process.env.ADMIN_PASSWORD}))).status,503);
  process.env.ADMIN_TOTP_SECRET=seed;
  const code=mfa.totpAt(seed,Math.floor(Date.now()/30000));
  assert.equal((await adminRoute.POST(request('/api/admin/session',{password:'wrong',code}))).status,401);
  assert.equal((await adminRoute.POST(request('/api/admin/session',{password:process.env.ADMIN_PASSWORD,code:code==='000000'?'111111':'000000'}))).status,401);
  const adminLogin=await adminRoute.POST(request('/api/admin/session',{password:process.env.ADMIN_PASSWORD,code}));assert.equal(adminLogin.status,200);
  const adminCookie=cookie(adminLogin);assert.doesNotThrow(()=>admin(request('/api/admin',undefined,adminCookie)));
  assert.equal((await adminRoute.POST(request('/api/admin/session',{password:process.env.ADMIN_PASSWORD,code}))).status,401);
  process.env.ADMIN_PASSWORD='RotatedAdminPassword!456';assert.throws(()=>admin(request('/api/admin',undefined,adminCookie)));
  pass('Admin TOTP matches RFC 6238; missing/wrong/replayed factors fail and credential rotation revokes sessions');

  for(const value of ['https://evil.example','//evil.example','/\\evil.example','/api/admin','/luan-giai/not-a-token'])assert.equal(safeCustomerDestination(value),'/tai-khoan');
  for(const value of ['/la-so?ngay=2000-01-01','/luan-giai/'+'a'.repeat(64),'/don-hang/'+'b'.repeat(64)])assert.equal(safeCustomerDestination(value),value);
  pass('Post-login return paths support private links without allowing an external redirect');
  console.log(JSON.stringify({passed:checks.length,checks}));
}
main().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>{db().close();fs.rmSync(directory,{recursive:true,force:true});});
