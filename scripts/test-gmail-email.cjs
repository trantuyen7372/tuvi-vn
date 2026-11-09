// Real Nodemailer SMTP and auth handlers; loopback only, no connection to Gmail.
require('./register-server-only.cjs');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),net=require('node:net');
const assert=require('node:assert/strict'),ts=require('typescript'),Module=require('node:module'),load=Module._load;
Module._load=function(name,...args){return load.call(this,name.startsWith('@/')?path.join(process.cwd(),name.slice(2)):name,...args);};
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'tuvi-gmail-'));
Object.assign(process.env,{TUVI_DB_PATH:path.join(directory,'test.sqlite'),SITE_URL:'http://127.0.0.1:3100',PAYMENTS_ENABLED:'0',PAYMENT_PROVIDER:'payos',MAIL_PROVIDER:'gmail',SMTP_USER:'xemtuvionlinevn@gmail.com',SMTP_PASSWORD:'simulation app password',MAIL_FROM:'Xem Tử Vi Online <xemtuvionlinevn@gmail.com>',SUPPORT_EMAIL:'xemtuvionlinevn@gmail.com',RESEND_API_KEY:'',ANTHROPIC_API_KEY:'',FREE_READING_CREDITS:'1'});
delete process.env.TUVI_RESEND_BASE_URL;
const {get,run,db}=require('../lib/commerce/db.ts'),{authMail}=require('../lib/customers/mail.ts');
const {mailConfigured,sendEmail}=require('../lib/email.ts'),{createOrder,reserveReading}=require('../lib/commerce/store.ts'),{emailReading}=require('../lib/commerce/email.ts');
const auth=require('../app/api/auth/[action]/route.ts');
const checks=[],messages=[],sockets=new Set();let mode='success',authCalls=0;
const smtp=net.createServer(socket=>{
  sockets.add(socket);socket.on('close',()=>sockets.delete(socket));socket.on('error',()=>{});
  if(mode==='timeout')return;
  socket.write('220 localhost SMTP test\r\n');
  let buffer='',data=false,raw='',recipient='',sender='';
  socket.on('data',chunk=>{
    buffer+=chunk.toString();let end;
    while((end=buffer.indexOf('\r\n'))>=0){
      const line=buffer.slice(0,end);buffer=buffer.slice(end+2);
      if(data){
        if(line!=='.'){raw+=line+'\r\n';continue;}
        messages.push({raw,recipient,sender});data=false;socket.write('250 2.0.0 accepted\r\n');continue;
      }
      if(/^EHLO|^HELO/.test(line))socket.write('250-localhost\r\n250-AUTH PLAIN\r\n250 8BITMIME\r\n');
      else if(line.startsWith('AUTH PLAIN ')){
        authCalls++;const [,user,password]=Buffer.from(line.slice(11),'base64').toString().split('\0');
        if(mode==='auth-failure'||user!==process.env.SMTP_USER||password!=='simulationapppassword')socket.write('535 5.7.8 Invalid credentials\r\n');
        else socket.write('235 2.7.0 Authenticated\r\n');
      }else if(line.startsWith('MAIL FROM:')){sender=line.slice(10);socket.write('250 2.1.0 OK\r\n');}
      else if(line.startsWith('RCPT TO:')){
        recipient=line.slice(8);socket.write(mode==='recipient-failure'?'550 5.1.1 Recipient rejected\r\n':'250 2.1.5 OK\r\n');
      }else if(line==='DATA'){data=true;raw='';socket.write('354 End with dot\r\n');}
      else if(line==='QUIT'){socket.end('221 Bye\r\n');}
      else if(line==='RSET')socket.write('250 OK\r\n');
      else socket.write('501 Command not modeled\r\n');
    }
  });
});
function client(){let cookie='';return async(action,payload)=>{
  const req=new Request(process.env.SITE_URL+'/api/auth/'+action,{method:'POST',headers:{Origin:process.env.SITE_URL,'Content-Type':'application/json',Cookie:cookie},body:JSON.stringify(payload)});
  const response=await auth.POST(req,{params:Promise.resolve({action})});
  if(response.headers.get('set-cookie'))cookie=response.headers.get('set-cookie').split(';')[0];
  return {status:response.status,data:await response.json()};
};}
function pass(name){checks.push(name);console.log('PASS '+name);}
async function main(){
  await new Promise((resolve,reject)=>{smtp.once('error',reject);smtp.listen(0,'127.0.0.1',resolve);});
  process.env.TUVI_SMTP_TEST_PORT=String(smtp.address().port);assert.equal(mailConfigured(),true);
  const a=client(),registered=await a('signup',{email:'customer@example.invalid',password:'GmailTest!12345'});
  assert.equal(registered.status,200);assert.equal(registered.data.verification.status,'sent');assert.equal(registered.data.verification.demoUrl,undefined);
  assert.equal(messages.length,1);assert.ok(messages[0].sender.includes(process.env.SMTP_USER));assert.ok(messages[0].recipient.includes('customer@example.invalid'));
  assert.ok(messages[0].raw.includes('Reply-To: xemtuvionlinevn@gmail.com'));assert.ok(/multipart\/alternative/.test(messages[0].raw));
  assert.ok(!JSON.stringify(registered.data).includes(process.env.SMTP_PASSWORD));
  pass('Real SMTP authentication and multipart message use requested Gmail sender/reply address while recipient is the customer');
  const normalized=messages[0].raw.replace(/=\r\n/g,'');
  const token=normalized.match(/token=3D([a-f0-9]{64})/)?.[1];assert.ok(token);
  const owner=get("SELECT * FROM customers WHERE email='customer@example.invalid'");
  assert.equal(get('SELECT verified FROM customers WHERE id=?',owner.id).verified,0);
  assert.equal((await a('verify',{token})).status,200);assert.equal((await a('verify',{token})).status,400);
  assert.equal(get('SELECT remaining FROM credits cr JOIN orders o ON cr.order_id=o.id WHERE o.customer_id=?',owner.id).remaining,1);
  pass('Link in actual SMTP MIME verifies once and grants exactly one credit');
  mode='auth-failure';const b=client();let before=messages.length;
  const rejected=await b('signup',{email:'failed@example.invalid',password:'GmailTest!12345'});
  assert.equal(rejected.status,200);assert.equal(rejected.data.verification.status,'failed');assert.equal(messages.length,before);
  const failedOwner=get("SELECT * FROM customers WHERE email='failed@example.invalid'");
  assert.equal(failedOwner.verified,0);assert.equal(get('SELECT id FROM orders WHERE customer_id=?',failedOwner.id),undefined);
  mode='success';assert.equal((await b('resend',{})).data.status,'sent');assert.equal(messages.length,before+1);
  pass('SMTP 535 preserves unverified account with zero credits; resend succeeds after credentials recover');
  mode='recipient-failure';assert.equal((await authMail('rejected@example.invalid','a'.repeat(64),'verify',1)).status,'failed');
  pass('Rejected recipient is not reported as a sent email');
  mode='success';const input={name:'',gender:'nam',calendar:'duong',date:'2000-01-01',hour:0,leap:false,year:2026};
  const order=createOrder('reading@example.invalid','single',input,'','local-test').order;
  run("UPDATE orders SET status='paid' WHERE id=?",order.id);run('INSERT INTO credits VALUES (?,?,1)',order.id,order.email);
  const reading=reserveReading({...order,status:'paid'},input);run("UPDATE readings SET status='done',text='Bài đã lưu để đọc lại' WHERE id=?",reading.id);
  await emailReading(get('SELECT * FROM readings WHERE id=?',reading.id));assert.equal(get('SELECT email_status FROM readings WHERE id=?',reading.id).email_status,'sent');
  assert.ok(messages.at(-1).recipient.includes(order.email));
  mode='recipient-failure';await emailReading(get('SELECT * FROM readings WHERE id=?',reading.id));
  const saved=get('SELECT * FROM readings WHERE id=?',reading.id);assert.equal(saved.status,'done');assert.equal(saved.text,'Bài đã lưu để đọc lại');assert.equal(saved.email_status,'failed');
  pass('Saved reading email uses Gmail; a failed delivery preserves the completed article');
  mode='timeout';const started=Date.now();const stalled=await authMail('timeout@example.invalid','b'.repeat(64),'verify');
  assert.equal(stalled.status,'failed');assert.ok(Date.now()-started<18000);pass('Silent SMTP greeting is bounded by the configured timeout');
  mode='success';process.env.SITE_URL='https://xemtuvionline.vn';before=authCalls;
  assert.equal(await sendEmail({to:'test@example.invalid',subject:'test',text:'test'},'test'),'not_configured');assert.equal(authCalls,before);
  delete process.env.TUVI_SMTP_TEST_PORT;process.env.SMTP_PASSWORD='';assert.equal(mailConfigured(),false);
  pass('Local SMTP override is rejected for public SITE_URL; missing app password leaves email disabled');
  fs.writeFileSync('reports/gmail-email-tests.json',JSON.stringify({passed:true,checks,messages:messages.length,evidence:'Actual Nodemailer SMTP client, auth handlers and isolated SQLite against a loopback SMTP stand-in; no real Gmail calls.',limitations:'Does not test Gmail TLS, Google authentication acceptance, network availability from server or inbox delivery.',sources:['https://developers.google.com/workspace/gmail/imap/imap-smtp','https://support.google.com/accounts/answer/185833?hl=vi']},null,2)+'\n');
}
main().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>{
  for(const socket of sockets)socket.destroy();smtp.close();db().close();fs.rmSync(directory,{recursive:true,force:true});
});
