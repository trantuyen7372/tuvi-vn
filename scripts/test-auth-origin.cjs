// Exercise the actual login route with an isolated database; no mail or payment calls.
require('./register-server-only.cjs');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const assert=require('node:assert/strict'),ts=require('typescript'),Module=require('node:module'),load=Module._load;
Module._load=function(name,...args){return load.call(this,name.startsWith('@/')?path.join(process.cwd(),name.slice(2)):name,...args);};
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'tuvi-auth-origin-'));
process.env.TUVI_DB_PATH=path.join(directory,'test.sqlite');
const {db,run}=require('../lib/commerce/db.ts');
const {passwordHash,customer}=require('../lib/customers/auth.ts');
const {siteUrl}=require('../lib/commerce/config.ts');
const {POST}=require('../app/api/auth/[action]/route.ts');
const origin='http://localhost:3100',password='OriginRegression!12345',email='origin@example.invalid';
async function login(requestOrigin=origin,providedPassword=password){
  return POST(new Request(origin+'/api/auth/login',{method:'POST',headers:{Origin:requestOrigin,'Content-Type':'application/json'},body:JSON.stringify({email,password:providedPassword})}),{params:Promise.resolve({action:'login'})});
}
async function main(){
  run('INSERT INTO customers(id,email,password_hash,verified,created) VALUES (?,?,?,?,?)','origin-test',email,await passwordHash(password),1,Date.now());
  process.env.SITE_URL='localhost:3100';
  const malformed=await login();assert.equal(malformed.status,400);
  assert.match((await malformed.json()).error,/SITE_URL.*http:\/\/localhost:3100/);
  for(const value of ['xemtuvionline.vn','javascript:alert(1)','https://user:password@example.invalid']){
    process.env.SITE_URL=value;assert.throws(siteUrl,/SITE_URL chưa hợp lệ/);
  }
  process.env.SITE_URL=origin;
  const response=await login();assert.equal(response.status,200);
  const cookie=response.headers.get('set-cookie');assert.match(cookie,/tuvi_customer=[a-f0-9]{64}; HttpOnly;/);assert.ok(!cookie.includes('; Secure'));
  assert.equal(customer(new Request(origin+'/api/auth/me',{headers:{Cookie:cookie.split(';')[0]}})).email,email);
  assert.equal((await login('https://other.example.invalid')).status,400);
  assert.equal((await login(origin,'incorrect-password')).status,401);
  process.env.SITE_URL='https://example.invalid/path';assert.equal(siteUrl(),'https://example.invalid');
  delete process.env.SITE_URL;assert.equal(siteUrl(),origin);
  console.log('PASS: malformed SITE_URL has a clear error; local login and session work; foreign origins and wrong passwords remain blocked.');
}
main().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>{db().close();fs.rmSync(directory,{recursive:true,force:true});});
