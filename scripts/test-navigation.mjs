import fs from 'node:fs';
import {chromium,expect} from '@playwright/test';
const base='http://localhost:3100',folder='outputs/navigation-review';fs.mkdirSync(folder,{recursive:true});
const browser=await chromium.launch({executablePath:chromium.executablePath(),headless:true});
const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage();
const checks=[],errors=[],email=`nav-${Date.now()}@example.com`,password=`Navigation-${Date.now()}!`;
page.on('pageerror',e=>errors.push(e.message));
const post=(url,data)=>context.request.post(base+url,{headers:{Origin:base},data});
const header=p=>p.getByRole('navigation',{name:'Điều hướng chính'});
const passed=name=>{checks.push(name);console.log('PASS '+name);};
let created=false;
try{
  const mode=await (await context.request.get(base+'/api/auth/me')).json();expect(mode.demo).toBe(true);expect(mode.paymentsEnabled).toBe(false);
  expect((await post('/api/auth/signup',{email,password})).ok()).toBe(true);created=true;await post('/api/auth/logout',{});
  await page.goto(base);await expect(header(page).getByRole('link',{name:'Đăng nhập',exact:true})).toBeVisible();await expect(header(page).getByRole('link',{name:'Tài khoản',exact:true})).toHaveCount(0);passed('Khách chưa đăng nhập chỉ thấy Đăng nhập trong menu');
  await header(page).getByRole('link',{name:'Đăng nhập',exact:true}).click();await page.getByLabel('Email',{exact:true}).fill(email);await page.getByLabel('Mật khẩu',{exact:true}).fill(password);await page.getByRole('button',{name:'Đăng nhập',exact:true}).click();await page.waitForURL('**/tai-khoan');
  await expect(header(page).getByRole('link',{name:'Tài khoản',exact:true})).toBeVisible();await expect(header(page).getByRole('link',{name:'Đăng nhập',exact:true})).toHaveCount(0);passed('Đăng nhập bằng giao diện đổi menu ngay sau chuyển trang');
  await page.goto(base+'/sao');await expect(header(page).getByRole('link',{name:'Tài khoản',exact:true})).toBeVisible();await page.reload();await expect(header(page).getByRole('link',{name:'Tài khoản',exact:true})).toBeVisible();passed('Trang tĩnh và tải lại vẫn nhận phiên đăng nhập');
  await page.goto(base);await expect(page.getByRole('link',{name:'Vào tài khoản của tôi',exact:true})).toBeVisible();await expect(page.getByRole('link',{name:'Đăng nhập',exact:true})).toHaveCount(0);await expect(page.getByRole('link',{name:'Tạo tài khoản',exact:true})).toHaveCount(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);await page.screenshot({path:folder+'/signed-in-mobile.png'});passed('Trang chủ không còn mời đăng nhập/đăng ký khi đã có phiên');
  const sibling=await context.newPage();await sibling.goto(base+'/co-thu');await expect(header(sibling).getByRole('link',{name:'Tài khoản',exact:true})).toBeVisible();
  await page.goto(base+'/tai-khoan');await page.getByRole('button',{name:'Đăng xuất',exact:true}).click();await page.waitForURL('**/dang-nhap');await expect(header(page).getByRole('link',{name:'Đăng nhập',exact:true})).toBeVisible();await expect(header(sibling).getByRole('link',{name:'Đăng nhập',exact:true})).toBeVisible();passed('Đăng xuất cập nhật cả tab hiện tại và tab đang mở khác');
  expect((await post('/api/auth/login',{email,password})).ok()).toBe(true);await sibling.reload();await expect(header(sibling).getByRole('link',{name:'Tài khoản',exact:true})).toBeVisible();await post('/api/auth/logout',{});await sibling.evaluate(()=>window.dispatchEvent(new Event('pageshow')));await expect(header(sibling).getByRole('link',{name:'Đăng nhập',exact:true})).toBeVisible();passed('Quay lại trang kiểm tra lại phiên đã bị thu hồi');
  await page.goto(base);await page.getByLabel('Ngày sinh',{exact:true}).selectOption('31');await page.getByLabel('Tháng sinh',{exact:true}).selectOption('2');await page.getByLabel('Năm sinh',{exact:true}).fill('2000');await page.getByRole('button',{name:'Lập lá số',exact:true}).click();await expect(page.locator('form').getByRole('alert')).toHaveText('Ngày sinh không tồn tại');passed('Form nhẹ vẫn kiểm tra ngày sinh trước khi chuyển trang');
  await page.getByLabel('Ngày sinh',{exact:true}).selectOption('1');await page.getByLabel('Giờ sinh',{exact:true}).selectOption('12');await page.getByLabel('Năm xem hạn',{exact:true}).fill('2026');await page.getByRole('button',{name:'Lập lá số',exact:true}).click();await page.waitForURL('**/la-so?**');
  await expect(page.getByRole('heading',{name:/^Cung Mệnh/})).toBeVisible();expect(await page.getByRole('button',{name:/^Xem cung /}).count()).toBe(12);await page.getByRole('button',{name:'Xem cung Quan Lộc',exact:true}).click();await expect(page.getByRole('heading',{name:/^Cung Quan Lộc/})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);await page.screenshot({path:folder+'/server-chart-mobile.png'});passed('Lá số tính trên server vẫn đủ 12 cung, chọn cung hoạt động và không tràn trang');
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),initial=await nojs.newPage();await initial.goto(page.url());await expect(initial.getByRole('heading',{name:/^Cung Mệnh/})).toBeVisible();expect(await initial.getByRole('button',{name:/^Xem cung /}).count()).toBe(12);await nojs.close();passed('HTML ban đầu có lá số thật, không cần tải iztro vào trình duyệt để tính');
  expect(errors).toEqual([]);passed('Không có lỗi JavaScript');
}catch(error){process.exitCode=1;console.error(error);await page.screenshot({path:folder+'/failure.png'}).catch(()=>{});}
finally{
  if(created){await post('/api/auth/login',{email,password});const removed=await context.request.delete(base+'/api/account',{headers:{Origin:base},data:{password}});if(!removed.ok()){process.exitCode=1;errors.push('Chưa dọn được tài khoản kiểm thử');}}
  fs.writeFileSync(folder+'/report.json',JSON.stringify({passed:!process.exitCode,checks,errors},null,2)+'\n');await browser.close();
}
