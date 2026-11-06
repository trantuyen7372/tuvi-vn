require('./register-server-only.cjs');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop:true } }).outputText, filename);
process.env.TUVI_DB_PATH = path.join(fs.mkdtempSync(path.join(os.tmpdir(),'tuvi-commerce-')), 'test.sqlite');
const { createOrder, receivePayment, reserveReading, credits, orderByToken } = require('../lib/commerce/store.ts');
const { run, get } = require('../lib/commerce/db.ts');
const { PRODUCTS } = require('../lib/commerce/config.ts');
const price = id => PRODUCTS.find(p => p.id === id).price;
const input = {name:'Kiểm thử',gender:'nam',calendar:'duong',date:'1990-01-01',hour:3,leap:false,year:2026};
const counts = [];
function test(name, fn) { fn(); counts.push(name); }
async function main() {
  const original = createOrder('test@example.com','family',input,'','payos');
  run('UPDATE orders SET link_id=? WHERE id=?','link-test',original.order.id);
  const event = {reference:'tx-1',orderCode:original.order.code,amount:price('family'),paymentLinkId:'link-test',code:'00',currency:'VND'};
  test('Đơn chưa thanh toán không có lượt',()=>{assert.equal(credits(original.order.id),0);assert.throws(()=>reserveReading(original.order,input));});
  test('Sai số tiền được giữ đối soát',()=>{assert.equal(receivePayment({...event,reference:'wrong-amount',amount:1}),'review');assert.equal(credits(original.order.id),0);});
  test('Sai link không mở đơn',()=>{assert.equal(receivePayment({...event,reference:'wrong-link',paymentLinkId:'other'}),'review');assert.equal(credits(original.order.id),0);});
  test('Giao dịch đúng cấp đủ lượt',()=>{assert.equal(receivePayment(event),'matched');assert.equal(credits(original.order.id),5);});
  test('Webhook lặp không cộng lại',()=>{assert.equal(receivePayment(event),'duplicate');assert.equal(credits(original.order.id),5);assert.equal(receivePayment({...event,reference:'different-ref'}),'review');assert.equal(credits(original.order.id),5);});
  const paid = orderByToken(original.token);
  test('Cùng lá số xem lại chỉ trừ một lượt',()=>{const a=reserveReading(paid,input),b=reserveReading(paid,{...input,name:'Tên khác'});assert.equal(a.id,b.id);assert.equal(credits(paid.id),4);});
  test('Gói gia đình dùng cho nhiều lá số, không âm lượt',()=>{for(let h=4;h<=7;h++)reserveReading(paid,{...input,hour:h});assert.equal(credits(paid.id),0);assert.throws(()=>reserveReading(paid,{...input,hour:8}));});
  test('Chỉ email không đủ để truy cập',()=>{assert.throws(()=>orderByToken('test@example.com'));assert.throws(()=>orderByToken('a'.repeat(64)));});
  test('Đơn hết hạn không tự mở',()=>{const o=createOrder('late@example.com','single',input,'','payos');run('UPDATE orders SET expires=?,link_id=? WHERE id=?',Date.now()-1,'late',o.order.id);assert.equal(receivePayment({...event,reference:'late',orderCode:o.order.code,amount:price('single'),paymentLinkId:'late'}),'review');assert.equal(credits(o.order.id),0);});
  test('Mã giảm giá hữu hạn, chỉ mở một lần',()=>{run('INSERT INTO coupons VALUES (?,?,?,?)','ONLYONCE',100,1,Date.now()+60000);const o=createOrder('coupon@example.com','single',input,'ONLYONCE','payos');assert.equal(o.order.amount,0);assert.equal(o.order.status,'paid');assert.equal(credits(o.order.id),1);assert.throws(()=>createOrder('other@example.com','single',input,'ONLYONCE','payos'));});
  test('Mã hết hạn bị từ chối',()=>{run('INSERT INTO coupons VALUES (?,?,?,?)','EXPIRED',100,10,Date.now()-1);assert.throws(()=>createOrder('coupon@example.com','single',input,'EXPIRED','payos'));});
  process.env.PAYOS_CLIENT_ID='test-client';process.env.PAYOS_API_KEY='test-key';process.env.PAYOS_CHECKSUM_KEY='test-checksum';delete process.env.PAYMENT_PROVIDER;
  const {PayOS}=require('@payos/node');const client=new PayOS({clientId:'test-client',apiKey:'test-key',checksumKey:'test-checksum'});
  const {gateway}=require('../lib/commerce/provider.ts');
  const signed={...event,description:'TUVI',accountNumber:'123',transactionDateTime:'2026-11-05 12:00:00',desc:'ok'};
  const signature=await client.crypto.createSignatureFromObj(signed,'test-checksum');
  assert.deepEqual(await gateway().verify({data:signed,signature}),signed);
  await assert.rejects(gateway().verify({data:{...signed,amount:1},signature}));counts.push('SDK PayOS xác minh chữ ký, chặn sửa số tiền');
  const {claimReading,finishReading,failReading}=require('../lib/commerce/jobs.ts');
  function jobFixture(email) {
    const o=createOrder(email,'single',input,'','payos');
    run("UPDATE orders SET status='paid' WHERE id=?",o.order.id);
    run('INSERT INTO credits VALUES (?,?,1)',o.order.id,email);
    return {order:o.order,reading:reserveReading({...o.order,status:'paid'},input)};
  }
  test('Khóa chạy đồng thời, trả lượt đúng một lần sau ba lỗi',()=>{
    const f=jobFixture('retry@example.com');
    for(let i=1;i<=3;i++){
      const job=claimReading(f.reading.id);assert.equal(job.state,'claimed');
      assert.equal(claimReading(f.reading.id).state,'busy');
      assert.equal(failReading(job.reading),true);assert.equal(failReading(job.reading),false);
      assert.equal(credits(f.order.id),i===3?1:0);
    }
    assert.equal(claimReading(f.reading.id).state,'exhausted');assert.equal(credits(f.order.id),1);
  });
  test('Khôi phục tiến trình chết ở lần cuối không trả trùng lượt',()=>{
    const f=jobFixture('crash@example.com');
    run("UPDATE readings SET status='running',attempts=3,lease=1 WHERE id=?",f.reading.id);
    assert.equal(claimReading(f.reading.id).state,'exhausted');assert.equal(credits(f.order.id),1);
    assert.equal(claimReading(f.reading.id).state,'exhausted');assert.equal(credits(f.order.id),1);
  });
  test('Tiến trình cũ không ghi đè kết quả của lần xử lý mới',()=>{
    const f=jobFixture('lease@example.com'),old=claimReading(f.reading.id);
    old.reading.lease=1;run('UPDATE readings SET lease=1 WHERE id=?',f.reading.id);
    const current=claimReading(f.reading.id);assert.equal(current.state,'claimed');
    assert.equal(finishReading(old.reading,'stale'),false);assert.equal(failReading(old.reading),false);
    assert.equal(finishReading(current.reading,'correct'),true);assert.equal(claimReading(f.reading.id).state,'done');
    assert.equal(get('SELECT text FROM readings WHERE id=?',f.reading.id).text,'correct');
  });
  assert.equal(get('PRAGMA integrity_check').integrity_check,'ok');counts.push('SQLite integrity_check');
  console.log(JSON.stringify({passed:counts.length,tests:counts},null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
