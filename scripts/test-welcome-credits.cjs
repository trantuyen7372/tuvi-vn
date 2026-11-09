// Test real auth handlers and SQLite in isolation; no email or paid services.
require('./register-server-only.cjs');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const assert=require('node:assert/strict'),ts=require('typescript'),Module=require('node:module'),load=Module._load;
Module._load=function(name,...args){return load.call(this,name.startsWith('@/')?path.join(process.cwd(),name.slice(2)):name,...args);};
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'tuvi-welcome-'));
Object.assign(process.env,{TUVI_DB_PATH:path.join(directory,'test.sqlite'),SITE_URL:'http://localhost:3100',PAYMENTS_ENABLED:'0',PAYMENT_PROVIDER:'mock',TUVI_ALLOW_TEST_PAYMENTS:'1',ANTHROPIC_API_KEY:'',RESEND_API_KEY:'',SMTP_PASSWORD:'',MAIL_FROM:'',FREE_READING_CREDITS:''});
const {get,run}=require('../lib/commerce/db.ts');
const {freeReadingCredits,welcomeAccess,customerDashboard,reserveAccountReading}=require('../lib/customers/access.ts');
const {issueAuthToken}=require('../lib/customers/auth.ts');
const auth=require('../app/api/auth/[action]/route.ts');
const checks=[];
function pass(name){checks.push(name);console.log('PASS '+name);}
async function post(action,data){
  const response=await auth.POST(new Request(process.env.SITE_URL+'/api/auth/'+action,{method:'POST',headers:{Origin:process.env.SITE_URL,'Content-Type':'application/json'},body:JSON.stringify(data)}),{params:Promise.resolve({action})});
  return {status:response.status,data:await response.json()};
}
const input={name:'',gender:'nam',calendar:'duong',date:'2000-01-01',hour:0,leap:false,year:2026};
async function main(){
  assert.equal(freeReadingCredits(),1);process.env.PAYMENTS_ENABLED='1';assert.equal(freeReadingCredits(),1);
  for(const [raw,expected] of [['3',1],['20',1],['0',0],['-1',0],['invalid',1]]){process.env.FREE_READING_CREDITS=raw;assert.equal(freeReadingCredits(),expected);}
  process.env.FREE_READING_CREDITS='';process.env.PAYMENTS_ENABLED='0';
  pass('One welcome credit in preview and paid modes; old configuration cannot grant three');
  const email='welcome@example.invalid',password='WelcomeTest!12345';
  const signup=await post('signup',{email,password});assert.equal(signup.status,200);
  let c=get('SELECT * FROM customers WHERE email=?',email);
  assert.equal(customerDashboard(c).credits,0);assert.equal(get("SELECT id FROM orders WHERE customer_id=? AND product='welcome'",c.id),undefined);
  assert.throws(()=>reserveAccountReading(c,input),/xác minh email/);
  const invalid=await post('verify',{token:'0'.repeat(64)});assert.equal(invalid.status,400);assert.equal(customerDashboard(c).credits,0);
  pass('Signup and invalid verification cannot grant or spend a welcome credit');
  const token=new URL(signup.data.verification.demoUrl).searchParams.get('token');
  assert.equal((await post('verify',{token})).status,200);
  c=get('SELECT * FROM customers WHERE id=?',c.id);assert.equal(c.verified,1);assert.equal(customerDashboard(c).credits,1);
  assert.equal((await post('verify',{token})).status,400);
  assert.equal((await post('verify',{token:issueAuthToken(c.id,'verify')})).status,200);
  await post('login',{email,password});welcomeAccess(c);welcomeAccess(c);
  assert.equal(customerDashboard(c).credits,1);assert.equal(get("SELECT COUNT(*) n FROM orders WHERE customer_id=? AND product='welcome'",c.id).n,1);
  pass('Valid verification grants once; duplicate links, new links and logins cannot add credits');
  const first=reserveAccountReading(c,input);assert.equal(customerDashboard(c).credits,0);
  assert.equal(reserveAccountReading(c,{...input,name:'Tên khác'}).token,first.token);
  assert.throws(()=>reserveAccountReading(c,{...input,hour:1}),/hết lượt/);
  const reset=await post('reset',{token:issueAuthToken(c.id,'reset'),password:'NewWelcome!12345'});assert.equal(reset.status,200);
  assert.equal(customerDashboard(c).credits,0);
  pass('Only one new reading; rereading is free and password reset never refills credits');
  const second=await post('signup',{email:'reset-first@example.invalid',password});assert.equal(second.status,200);
  let other=get("SELECT * FROM customers WHERE email='reset-first@example.invalid'");
  assert.equal((await post('reset',{token:issueAuthToken(other.id,'reset'),password:'ResetFirst!12345'})).status,200);
  other=get('SELECT * FROM customers WHERE id=?',other.id);assert.equal(other.verified,1);assert.equal(customerDashboard(other).credits,1);
  assert.equal((await post('verify',{token:new URL(second.data.verification.demoUrl).searchParams.get('token')})).status,200);
  assert.equal(customerDashboard(other).credits,1);
  pass('Email ownership proven through reset grants once, even if original verification follows');
  const legacy=await post('signup',{email:'legacy@example.invalid',password});assert.equal(legacy.status,200);
  let old=get("SELECT * FROM customers WHERE email='legacy@example.invalid'");
  run('UPDATE customers SET verified=1 WHERE id=?',old.id);welcomeAccess({...old,verified:1});
  const order=get("SELECT id FROM orders WHERE customer_id=? AND product='welcome'",old.id);
  run('UPDATE orders SET quantity=3 WHERE id=?',order.id);run('UPDATE credits SET remaining=3 WHERE order_id=?',order.id);
  assert.equal(customerDashboard(old).credits,0);assert.throws(()=>reserveAccountReading(old,input),/xác minh email/);
  assert.equal((await post('verify',{token:new URL(legacy.data.verification.demoUrl).searchParams.get('token')})).status,200);
  old=get('SELECT * FROM customers WHERE id=?',old.id);assert.equal(customerDashboard(old).credits,3);
  pass('Legacy unverified welcome credits require verification; previously granted balance is preserved');
  fs.writeFileSync('reports/welcome-credits-tests.json',JSON.stringify({passed:true,checks,scope:'Real auth route handlers and isolated SQLite; no real email or external API calls.'},null,2)+'\n');
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{
  require('../lib/commerce/db.ts').db().close();
  fs.rmSync(directory,{recursive:true,force:true});
});
