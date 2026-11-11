import assert from 'node:assert/strict';
const base=process.env.SECURITY_TEST_BASE_URL||'http://localhost:3100';
const paths=['/la-so','/tai-khoan','/quan-tri','/dang-nhap','/dang-ky','/quen-mat-khau','/dat-lai-mat-khau','/xac-minh-email','/luan-giai/'+'a'.repeat(64),'/don-hang/'+'b'.repeat(64)];
const nonces=new Set();
for(const path of paths){
  const response=await fetch(base+path),html=await response.text();assert.equal(response.status,200,path);
  const policy=response.headers.get('content-security-policy')||'',scripts=policy.match(/(?:^|;)\s*script-src\s+([^;]+)/)?.[1]||'';
  const nonce=scripts.match(/'nonce-([^']+)'/)?.[1];assert.ok(nonce,path);assert.ok(!nonces.has(nonce),path);nonces.add(nonce);
  assert.ok(scripts.includes("'strict-dynamic'"),path);assert.ok(!scripts.includes('unsafe-inline'),path);assert.ok(!scripts.includes('unsafe-eval'),path);
  assert.match(response.headers.get('cache-control')||'',/no-store/,path);
  let count=0;
  for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){
    if(match[1].includes('application/ld+json'))continue;
    assert.equal(match[1].match(/\bnonce="([^"]+)"/)?.[1],nonce,path+' script thiếu nonce');count++;
  }
  assert.ok(count>0,path);
}
const again=await fetch(base+'/dang-nhap');assert.ok(!nonces.has(again.headers.get('content-security-policy').match(/'nonce-([^']+)'/)[1]));
for(const path of ['/','/huong-dan','/sao/tu-vi']){
  const response=await fetch(base+path),policy=response.headers.get('content-security-policy')||'';
  assert.equal(response.status,200,path);assert.ok(!policy.includes('nonce-'),path);assert.ok(policy.includes("object-src 'none'"));assert.ok(policy.includes("frame-ancestors 'none'"));assert.ok(policy.includes("base-uri 'none'"));
  assert.equal(response.headers.get('x-powered-by'),null);assert.ok(response.headers.get('permissions-policy'));
}
assert.equal((await fetch(base+'/api/readings/'+'a'.repeat(64))).status,401);
assert.equal((await fetch(base+'/api/orders/'+'b'.repeat(64))).status,401);
console.log('PASS: 10 private routes have fresh nonces on every executable script and no-store; public routes retain baseline CSP; anonymous private APIs return 401.');
