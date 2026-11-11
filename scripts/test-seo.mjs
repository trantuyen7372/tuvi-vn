import assert from 'node:assert/strict';
import fs from 'node:fs';
const base=process.env.SEO_TEST_BASE_URL||'http://localhost:3100',origin='https://xemtuvionline.vn',checks=[];
const pass=name=>{checks.push(name);console.log('PASS '+name);};
const attr=(tag,key)=>tag.match(new RegExp(`\\b${key}="([^"]*)"`))?.[1];
const meta=(html,name)=>(html.match(/<meta\b[^>]*>/g)||[]).find(tag=>attr(tag,'name')===name||attr(tag,'property')===name);
const content=(html,name)=>{const tag=meta(html,name);return tag?attr(tag,'content'):undefined;};
const sitemap=await (await fetch(base+'/sitemap.xml')).text(),urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.ok(urls.length>=25);assert.equal(new Set(urls).size,urls.length);
const guidePaths=['cach-doc-la-so-tu-vi','y-nghia-12-cung','nhap-ngay-am-hay-duong','khong-biet-gio-sinh','dai-han-va-luu-nien','chinh-tinh-va-phu-tinh'].map(slug=>'/huong-dan/'+slug);
for(const path of ['/huong-dan','/phuong-phap',...guidePaths])assert.ok(urls.includes(origin+path),'Thiếu sitemap: '+path);
const titles=new Set(),descriptions=new Set(),pages=new Map();
for(const url of urls){
  assert.equal(new URL(url).origin,origin);const path=new URL(url).pathname;
  assert.ok(!/^\/(api|la-so|tai-khoan|luan-giai|don-hang|quan-tri|dang-nhap|dang-ky)(\/|$)/.test(path));
  const response=await fetch(base+path),html=await response.text();assert.equal(response.status,200,path);
  pages.set(path,html);
  assert.ok(!response.headers.get('x-robots-tag')?.includes('noindex'),path);
  const title=html.match(/<title>([^<]+)<\/title>/)?.[1],description=content(html,'description');
  assert.ok(title&&description,path);assert.ok(!titles.has(title),'Trùng title: '+path);assert.ok(!descriptions.has(description),'Trùng description: '+path);titles.add(title);descriptions.add(description);
  const canonical=(html.match(/<link\b[^>]*>/g)||[]).find(tag=>attr(tag,'rel')==='canonical');assert.ok(canonical,path);assert.equal(new URL(attr(canonical,'href')).href,new URL(url).href);
  assert.equal(new URL(content(html,'og:url')).href,new URL(url).href);assert.ok(content(html,'og:title'));assert.ok(content(html,'og:description'));assert.equal(content(html,'twitter:card'),'summary');
  assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,path);assert.ok(!content(html,'robots')?.includes('noindex'),path);
  const structured=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
  if(path==='/')assert.ok(structured.some(x=>x['@type']==='WebSite'&&x.url===origin));
  if(/^\/(sao|co-thu|huong-dan)\/.+/.test(path)){
    const breadcrumb=structured.find(x=>x['@type']==='BreadcrumbList');assert.ok(breadcrumb,path);assert.equal(breadcrumb.itemListElement.at(-1).item,url);
  }
  if(guidePaths.includes(path)){
    const article=structured.find(x=>x['@type']==='Article');assert.ok(article,path);assert.equal(article.mainEntityOfPage,url);assert.equal(article.author['@type'],'Organization');assert.equal(content(html,'og:type'),'article');
    assert.ok(html.includes('Mục lục bài viết'),path);assert.ok(html.includes('Nguồn và bài đối chiếu'),path);
  }
  if(/^\/sao\/.+/.test(path)){
    for(const heading of ['Cần đọc cùng những yếu tố nào?','Ví dụ để thực hành cách đọc','Nguồn để đối chiếu','Tra cứu sao liên quan'])assert.ok(html.includes(heading),path+' thiếu '+heading);
    assert.match(html,/href="\/co-thu\/[^"#]+#[^"]+"/,path);
  }
}
pass(`${urls.length} trang công khai có title/description riêng, canonical và Open Graph đúng URL`);
pass('Mỗi trang có đúng một H1, dữ liệu Website/breadcrumb hợp lệ khi áp dụng');
pass('Sitemap dùng tên miền xuất bản và không chứa URL riêng tư');
pass('6 bài hướng dẫn có Article, mục lục và nguồn; 14 trang sao có ví dụ và liên kết cổ thư');
const publicPaths=new Set(pages.keys()),edges=new Map();
for(const [path,html] of pages){
  const targets=new Set();
  for(const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)){
    const href=match[1].replaceAll('&amp;','&');
    if(!href.startsWith('/')&&!href.startsWith('#'))continue;
    const target=new URL(href,origin+path);
    if(/^\/(api|la-so|tai-khoan|luan-giai|don-hang|quan-tri|dang-nhap|dang-ky|quen-mat-khau|dat-lai-mat-khau|xac-minh-email)(\/|$)/.test(target.pathname))continue;
    assert.ok(publicPaths.has(target.pathname),`Liên kết công khai không có trong sitemap: ${path} → ${href}`);
    targets.add(target.pathname);
    if(target.hash){
      const id=decodeURIComponent(target.hash.slice(1)),targetHTML=pages.get(target.pathname);
      assert.ok(targetHTML.includes(`id="${id}"`),`Anchor hỏng: ${path} → ${href}`);
    }
  }
  edges.set(path,targets);
}
const reachable=new Set(['/']),queue=['/'];
while(queue.length){for(const path of edges.get(queue.shift())||[]){if(!reachable.has(path)){reachable.add(path);queue.push(path);}}}
for(const path of publicPaths)assert.ok(reachable.has(path),'Trang không có đường dẫn từ trang chủ: '+path);
pass('Tất cả trang sitemap có thể đi tới từ trang chủ; liên kết mục lục và trích nguồn đúng đoạn');
for(const path of ['/huong-dan/khong-ton-tai','/sao/khong-ton-tai','/sao/constructor','/huong-dan/toString'])assert.equal((await fetch(base+path)).status,404,path);
pass('Slug bài hướng dẫn và sao không tồn tại trả HTTP 404');
const privatePaths=['/la-so','/tai-khoan','/quan-tri','/dang-nhap','/dang-ky','/quen-mat-khau','/dat-lai-mat-khau','/xac-minh-email',`/luan-giai/${'a'.repeat(64)}`,`/don-hang/${'b'.repeat(64)}`];
for(const path of privatePaths){const response=await fetch(base+path),html=await response.text();assert.match(response.headers.get('x-robots-tag')||'',/noindex/,path);assert.match(content(html,'robots')||'',/noindex/,path);}
pass('10 loại trang riêng tư có noindex trong HTML và HTTP header');
assert.match((await fetch(base+'/api/auth/me')).headers.get('x-robots-tag')||'',/noindex/);
const robots=await (await fetch(base+'/robots.txt')).text();assert.ok(robots.includes(origin+'/sitemap.xml'));assert.ok(!robots.includes('localhost'));assert.ok(robots.includes('Disallow: /api/'));
pass('API không lập chỉ mục; robots.txt trỏ sitemap tên miền thật');
fs.writeFileSync('reports/seo-tests.json',JSON.stringify({passed:checks.length,publicPages:urls.length,checks,finished:new Date().toISOString()},null,2)+'\n');
console.log(JSON.stringify({passed:checks.length,publicPages:urls.length}));
