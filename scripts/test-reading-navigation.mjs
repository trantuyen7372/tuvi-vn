import fs from 'node:fs';
import crypto from 'node:crypto';
import {chromium,expect} from '@playwright/test';
const base='http://localhost:3100',folder='outputs/reading-navigation';fs.mkdirSync(folder,{recursive:true});
const browser=await chromium.launch({executablePath:chromium.executablePath(),headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'vi-VN'}),page=await context.newPage(),report={checks:[],errors:[]};
const password=crypto.randomBytes(24).toString('base64url');let registered=false;
const pass=s=>{report.checks.push(s);console.log('PASS '+s);};
async function req(url,data,method='POST'){const r=await context.request.fetch(base+url,{method,data,headers:{Origin:base}});expect(r.ok()).toBe(true);return r.json();}
page.on('pageerror',e=>report.errors.push(e.message));
try{
 const mode=await (await context.request.get(base+'/api/auth/me')).json();expect(mode.demo).toBe(true);expect(mode.paymentsEnabled).toBe(false);
 await req('/api/auth/signup',{email:`reader-${Date.now()}@example.com`,password});registered=true;
 const input={name:'Kiểm tra đọc tiếp',date:'1992-04-09',hour:4,calendar:'duong',gender:'nam',leap:false,year:2026};
 const reading=await req('/api/account/readings',{input}),token=reading.url.split('/').pop();await req('/api/readings/'+token,{});
 await page.goto(base+reading.url);await expect(page.getByRole('heading',{name:'Tổng quan bản mệnh',exact:true})).toBeVisible();
 const before=await (await context.request.get(base+'/api/readings/'+token)).json(),accountBefore=await (await context.request.get(base+'/api/account')).json();
 expect(before.canPersonalize).toBe(true);
 await page.getByText('Chọn vấn đề bạn muốn đọc kỹ',{exact:true}).click();await page.getByLabel('Vấn đề quan tâm',{exact:true}).selectOption('career');await page.getByLabel('Hoàn cảnh hiện tại (tùy chọn)',{exact:true}).selectOption('changing');
 const note='Đang cân nhắc chuyển hướng, cần hiểu điều kiện thực hiện.';
 await page.getByLabel('Điều muốn tìm hiểu (tùy chọn, tối đa 400 ký tự)',{exact:true}).fill(note);await page.getByRole('button',{name:'Lưu chủ đề, không dùng thêm lượt',exact:true}).click();await expect(page.getByRole('status')).toContainText('không dùng thêm lượt');
 const personalized=await (await context.request.get(base+'/api/readings/'+token)).json();expect(personalized.input.reading.focus).toBe('career');expect(personalized.text).toContain(note);expect(personalized.text).toContain('Thông tin bạn cung cấp, chưa được xác minh');expect(personalized.text).toContain('Xu hướng chính theo từng giai đoạn');expect(personalized.attempts).toBe(before.attempts);
 const accountAfter=await (await context.request.get(base+'/api/account')).json();expect(accountAfter.credits).toBe(accountBefore.credits);expect(accountAfter.readings.length).toBe(accountBefore.readings.length);
 const reused=await req('/api/account/readings',{input:{...input,reading:{focus:'family'}}});expect(reused.url).toBe(reading.url);await expect(page.getByRole('button',{name:/^Mục lục ·/})).not.toBeVisible();await page.screenshot({path:folder+'/personalization-mobile.png'});pass('Chọn chủ đề và hoàn cảnh qua giao diện cập nhật đúng bài, không đổi URL, lượt hoặc lần tạo');
 const invalid=await context.request.post(base+'/api/account/readings/preferences',{headers:{Origin:base},data:{token,preferences:{focus:'career',note:'a'.repeat(401)}}});expect(invalid.ok()).toBe(false);
 const forged=await context.request.post(base+'/api/account/readings/preferences',{headers:{Origin:'https://invalid.example'},data:{token,preferences:null}});expect(forged.ok()).toBe(false);pass('Chặn ghi chú quá dài và cập nhật từ nguồn khác');
 const outsider=await browser.newContext();let outsiderRegistered=false;
 try{
  const guest=await outsider.request.post(base+'/api/account/readings/preferences',{headers:{Origin:base},data:{token,preferences:null}});expect(guest.ok()).toBe(false);
  const signup=await outsider.request.post(base+'/api/auth/signup',{headers:{Origin:base},data:{email:`reader-outsider-${Date.now()}@example.com`,password}});expect(signup.ok()).toBe(true);outsiderRegistered=true;
  const denied=await outsider.request.post(base+'/api/account/readings/preferences',{headers:{Origin:base},data:{token,preferences:null}});expect(denied.ok()).toBe(false);
  expect((await (await outsider.request.get(base+'/api/readings/'+token)).json()).canPersonalize).toBe(false);pass('Có link riêng vẫn không được sửa bài của tài khoản khác hoặc khi chưa đăng nhập');
 }finally{if(outsiderRegistered)expect((await outsider.request.delete(base+'/api/account',{headers:{Origin:base},data:{password}})).ok()).toBe(true);await outsider.close();}
 await page.getByLabel('Vấn đề quan tâm',{exact:true}).selectOption('');await page.getByRole('button',{name:'Lưu chủ đề, không dùng thêm lượt',exact:true}).click();await expect.poll(async()=>{const data=await (await context.request.get(base+'/api/readings/'+token)).json();return data.input.reading||null;}).toBe(null);
 const cleared=await (await context.request.get(base+'/api/readings/'+token)).json();expect(cleared.text).not.toContain(note);expect((await (await context.request.get(base+'/api/account')).json()).credits).toBe(accountBefore.credits);await page.getByText('Chọn vấn đề bạn muốn đọc kỹ',{exact:true}).click();pass('Xóa chủ đề xóa hoàn cảnh/ghi chú khỏi bài hoạt động, giữ nguyên lượt');
 await page.getByRole('heading',{name:'Tổng quan bản mệnh',exact:true}).evaluate(el=>el.scrollIntoView({block:'start'}));
 const quick=page.getByRole('button',{name:/^Mục lục ·/});await quick.click();const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();await expect(dialog.getByRole('link')).toHaveCount(22);
 await expect(page.locator('html')).toHaveJSProperty('scrollWidth',390);await page.screenshot({path:folder+'/quick-contents-mobile.png'});
 await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();await expect(quick).toBeFocused();pass('Mục lục nhanh mobile mở đủ 22 mục, Escape trả focus và không tràn ngang');
 await quick.click();await dialog.getByRole('link',{name:'Xu hướng chính theo từng giai đoạn',exact:true}).click();await expect(page.getByRole('heading',{name:'Xu hướng chính theo từng giai đoạn',exact:true})).toBeInViewport();await page.screenshot({path:folder+'/stage-synthesis-mobile.png'});
 await quick.click();await dialog.getByRole('link',{name:'Công danh, sự nghiệp',exact:true}).click();
 const heading=page.getByRole('heading',{name:'Công danh, sự nghiệp',exact:true});await expect(heading).toBeInViewport();await expect(dialog).not.toBeVisible();
 await expect.poll(()=>page.getByRole('navigation',{name:'Mục lục bài luận',exact:true,includeHidden:true}).locator('[aria-current="location"]').textContent()).toBe('Công danh, sự nghiệp');pass('Chọn mục nhảy đúng nội dung và đánh dấu mục đang đọc');
 const key='tuvi-reading-position:'+crypto.createHash('sha256').update(token).digest('hex');
 await expect.poll(()=>page.evaluate(k=>localStorage.getItem(k),key)).toBe('cong-danh-su-nghiep');
 const stored=await page.evaluate(()=>Object.entries(localStorage).filter(([k])=>k.startsWith('tuvi-reading-position:')));expect(JSON.stringify(stored)).not.toContain(token);pass('Chỉ lưu mã mục, không lưu link riêng hoặc nội dung bài trong bộ nhớ vị trí');
 await page.goto(base+reading.url);await expect(page.getByRole('button',{name:'Đọc tiếp vị trí đã lưu'})).toBeVisible();expect(await page.evaluate(()=>scrollY)).toBeLessThan(50);
 await page.getByRole('button',{name:'Đọc tiếp vị trí đã lưu'}).click();await expect(heading).toBeInViewport();pass('Mở lại có lời mời đọc tiếp, chỉ cuộn khi người đọc chọn');
 const second=await req('/api/account/readings',{input:{...input,hour:5}});await req('/api/readings/'+second.url.split('/').pop(),{});await page.goto(base+second.url);await expect(page.getByRole('heading',{name:'Tổng quan bản mệnh',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Đọc tiếp vị trí đã lưu'})).toHaveCount(0);pass('Hai bài luận có vị trí lưu riêng');
 await page.evaluate(({key})=>localStorage.setItem(key,'muc-khong-con-ton-tai'),{key});await page.goto(base+reading.url);await expect(page.getByRole('heading',{name:'Tổng quan bản mệnh',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Đọc tiếp vị trí đã lưu'})).toHaveCount(0);pass('Vị trí hết hiệu lực được bỏ qua sau cập nhật bài');
 await context.addInitScript(()=>{Storage.prototype.getItem=function(){throw new Error('storage blocked');};Storage.prototype.setItem=function(){throw new Error('storage blocked');};});
 await page.goto(base+reading.url);await page.getByRole('heading',{name:'Tổng quan bản mệnh',exact:true}).evaluate(el=>el.scrollIntoView({block:'start'}));await expect(quick).toBeVisible();await quick.click();await dialog.getByRole('link',{name:'Tài lộc',exact:true}).click();await expect(page.getByRole('heading',{name:'Tài lộc',exact:true})).toBeInViewport();expect(report.errors).toEqual([]);pass('Khi trình duyệt chặn lưu trữ, điều hướng và bài luận vẫn hoạt động');
 report.passed=true;
}catch(e){report.passed=false;report.failure=e.message;process.exitCode=1;console.error(e);await page.screenshot({path:folder+'/failure.png'}).catch(()=>{});}finally{
 if(registered)await req('/api/account',{password},'DELETE').catch(e=>{report.cleanupError=e.message;process.exitCode=1;});
 fs.writeFileSync('reports/reading-navigation-tests.json',JSON.stringify(report,null,2)+'\n');await browser.close();console.log(JSON.stringify(report));
}
