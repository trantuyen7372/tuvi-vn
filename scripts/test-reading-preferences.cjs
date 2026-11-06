require('./register-server-only.cjs');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),ts=require('typescript'),Module=require('node:module');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'tuvi-preferences-'));process.env.TUVI_DB_PATH=path.join(directory,'test.sqlite');process.env.READING_ENGINE='dataset';
const load=Module._load;Module._load=function(name,...args){return name==='server-only'?{}:load.call(this,name,...args);};
const {canPersonalize,personalizeReading}=require('../lib/customers/reading-preferences.ts');Module._load=load;
const {run,get,db}=require('../lib/commerce/db.ts'),{createOrder,reserveReading,credits}=require('../lib/commerce/store.ts');
const {buildChart}=require('../lib/tuvi.ts'),{personalReading}=require('../lib/personal-reading.ts');
const checks=[];function test(name,fn){fn();checks.push(name);}
try{
 run('INSERT INTO customers(id,email,password_hash,verified,status,created) VALUES (?,?,?,0,?,?)','owner','private-test@example.com','unused','active',Date.now());
 run('INSERT INTO coupons VALUES (?,?,?,?)','PREFTEST',100,1,Date.now()+60000);
 const input={name:'',date:'1992-04-09',hour:4,gender:'nam',calendar:'duong',leap:false,year:2026},chart=buildChart(input),text=personalReading(chart,{overview:'Kiểm thử'});
 const {order}=createOrder('private-test@example.com','single',input,'PREFTEST','payos');run('UPDATE orders SET customer_id=? WHERE id=?','owner',order.id);
 const row=reserveReading(order,input);run("UPDATE readings SET status='done',text=?,attempts=1 WHERE id=?",text,row.id);const saved=get('SELECT * FROM readings WHERE id=?',row.id),before=credits(order.id);
 test('Chỉ chủ bài tự động đã xong được cá nhân hóa',()=>{assert.equal(canPersonalize(saved,'owner'),true);assert.equal(canPersonalize(saved,'other'),false);assert.equal(canPersonalize(saved),false);assert.equal(canPersonalize({...saved,status:'running'},'owner'),false);});
 test('Giữ bài biên tập riêng và phiên bản tương lai',()=>{assert.equal(canPersonalize({...saved,text:'Biên tập riêng'},'owner'),false);assert.equal(canPersonalize({...saved,text:'<!-- tuvi-reading:sao-cung-van-han-v99 -->'},'owner'),false);});
 test('Không sửa bài mô hình ngoài hoặc bài có usage',()=>{
  process.env.READING_ENGINE='anthropic';assert.equal(canPersonalize(saved,'owner'),false);process.env.READING_ENGINE='dataset';
  run('INSERT INTO ai_usage(reading_id,model,input_tokens,output_tokens,cost_vnd,created) VALUES (?,?,?,?,?,?)',row.id,'test-only',0,0,null,Date.now());assert.equal(canPersonalize(saved,'owner'),false);run('DELETE FROM ai_usage WHERE reading_id=?',row.id);
 });
 test('Ghi chú an toàn, không thay URL/lượt/attempt/fingerprint',()=>{
  personalizeReading('owner',row.token,{focus:'relationship',situation:'single',note:'## Giả [link](https://example.com) <script>'});
  const updated=get('SELECT * FROM readings WHERE id=?',row.id);assert.equal(updated.token,row.token);assert.equal(updated.fingerprint,row.fingerprint);assert.equal(updated.attempts,1);assert.equal(credits(order.id),before);assert.equal((updated.text.match(/^## /gm)||[]).length,22);assert.ok(!updated.text.includes('## Giả'));assert.ok(updated.text.includes('Đang độc thân'));assert.equal(updated.email_status,'not_sent');
  assert.equal(reserveReading(order,{...input,reading:{focus:'family'}}).id,row.id);
 });
 test('Xóa tùy chọn khôi phục bài tổng thể, không giữ ghi chú trong bản hoạt động',()=>{personalizeReading('owner',row.token,null);const updated=get('SELECT * FROM readings WHERE id=?',row.id);assert.equal(JSON.parse(updated.input).reading,undefined);assert.equal(updated.text,text);assert.equal(credits(order.id),before);});
 fs.writeFileSync('reports/reading-preferences-tests.json',JSON.stringify({passed:true,checks},null,2)+'\n');console.log(JSON.stringify({passed:true,checks:checks.length}));
}finally{db().close();fs.rmSync(directory,{recursive:true,force:true});}
