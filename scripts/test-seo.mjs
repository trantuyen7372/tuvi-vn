import assert from 'node:assert/strict';
import fs from 'node:fs';
const base='http://localhost:3100',origin='https://xemtuvionline.vn',checks=[];
const pass=name=>{checks.push(name);console.log('PASS '+name);};
const attr=(tag,key)=>tag.match(new RegExp(`\\b${key}="([^"]*)"`))?.[1];
const meta=(html,name)=>(html.match(/<meta\b[^>]*>/g)||[]).find(tag=>attr(tag,'name')===name||attr(tag,'property')===name);
const content=(html,name)=>{const tag=meta(html,name);return tag?attr(tag,'content'):undefined;};
const sitemap=await (await fetch(base+'/sitemap.xml')).text(),urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.equal(urls.length,25);assert.equal(new Set(urls).size,urls.length);
const titles=new Set(),descriptions=new Set();
for(const url of urls){
  assert.equal(new URL(url).origin,origin);const path=new URL(url).pathname;
  assert.ok(!/^\/(api|la-so|tai-khoan|luan-giai|don-hang|quan-tri|dang-nhap|dang-ky)(\/|$)/.test(path));
  const response=await fetch(base+path),html=await response.text();assert.equal(response.status,200,path);
  const title=html.match(/<title>([^<]+)<\/title>/)?.[1],description=content(html,'description');
  assert.ok(title&&description,path);assert.ok(!titles.has(title),'Trùng title: '+path);assert.ok(!descriptions.has(description),'Trùng description: '+path);titles.add(title);descriptions.add(description);
  const canonical=(html.match(/<link\b[^>]*>/g)||[]).find(tag=>attr(tag,'rel')==='canonical');assert.ok(canonical,path);assert.equal(new URL(attr(canonical,'href')).href,new URL(url).href);
  assert.equal(new URL(content(html,'og:url')).href,new URL(url).href);assert.ok(content(html,'og:title'));assert.ok(content(html,'og:description'));assert.equal(content(html,'twitter:card'),'summary');
  assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,path);assert.ok(!content(html,'robots')?.includes('noindex'),path);
  const structured=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
  if(path==='/')assert.ok(structured.some(x=>x['@type']==='WebSite'&&x.url===origin));
  if(/^\/(sao|co-thu)\/.+/.test(path)){
    const breadcrumb=structured.find(x=>x['@type']==='BreadcrumbList');assert.ok(breadcrumb,path);assert.equal(breadcrumb.itemListElement.at(-1).item,url);
  }
}
pass('25 trang công khai có title/description riêng, canonical và Open Graph đúng URL');
pass('Mỗi trang có đúng một H1, dữ liệu Website/breadcrumb hợp lệ khi áp dụng');
pass('Sitemap dùng tên miền xuất bản và không chứa URL riêng tư');
const privatePaths=['/la-so','/tai-khoan','/quan-tri','/dang-nhap','/dang-ky','/quen-mat-khau','/dat-lai-mat-khau','/xac-minh-email',`/luan-giai/${'a'.repeat(64)}`,`/don-hang/${'b'.repeat(64)}`];
for(const path of privatePaths){const response=await fetch(base+path),html=await response.text();assert.match(response.headers.get('x-robots-tag')||'',/noindex/,path);assert.match(content(html,'robots')||'',/noindex/,path);}
pass('10 loại trang riêng tư có noindex trong HTML và HTTP header');
assert.match((await fetch(base+'/api/auth/me')).headers.get('x-robots-tag')||'',/noindex/);
const robots=await (await fetch(base+'/robots.txt')).text();assert.ok(robots.includes(origin+'/sitemap.xml'));assert.ok(!robots.includes('localhost'));assert.ok(robots.includes('Disallow: /api/'));
pass('API không lập chỉ mục; robots.txt trỏ sitemap tên miền thật');
fs.writeFileSync('reports/seo-tests.json',JSON.stringify({passed:checks.length,publicPages:urls.length,checks,finished:new Date().toISOString()},null,2)+'\n');
console.log(JSON.stringify({passed:checks.length,publicPages:urls.length}));
