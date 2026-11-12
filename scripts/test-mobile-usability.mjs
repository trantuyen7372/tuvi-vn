import fs from 'node:fs';
import {chromium,expect} from '@playwright/test';
const base=process.env.BASE_URL||'http://localhost:3100',out='outputs/mobile-usability';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:chromium.executablePath(),headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'vi-VN'});
const page=await context.newPage(),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=500)errors.push(`${r.status()} ${new URL(r.url()).pathname}`);});
const pass=name=>{checks.push(name);console.log('PASS '+name);};
async function fits(){expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual((await page.viewportSize()).width);}
try{
  await page.goto(base);await page.locator('.birth-form').waitFor();
  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:900});await fits();
    const form=await page.locator('.birth-form').boundingBox();
    if(width<=800){expect(form.y).toBeLessThan(520);await expect(page.locator('.site-mobile-menu summary')).toBeVisible();await expect(page.locator('.site-nav-links a').first()).toBeVisible();const firstLink=await page.locator('.site-nav-links').boundingBox(),mobileMenu=await page.locator('.site-mobile-menu').boundingBox();expect(Math.abs(firstLink.y-mobileMenu.y)).toBeLessThan(1);expect(firstLink.x+firstLink.width).toBeLessThanOrEqual(mobileMenu.x+1);}
    else{await expect(page.locator('.site-mobile-menu')).toBeHidden();expect(form.x).toBeGreaterThan(700);}
    pass(`Trang chủ ${width}px: không tràn ngang, form và điều hướng đúng vị trí`);
    await page.screenshot({path:`${out}/home-${width}.png`,fullPage:width===390});
  }
  await page.setViewportSize({width:390,height:844});
  const menu=page.locator('.site-mobile-menu');await menu.locator('summary').click();await expect(menu.getByRole('link',{name:/Bài luận mẫu/})).toBeVisible();
  await page.screenshot({path:out+'/menu-390.png'});
  await page.keyboard.press('Escape');await expect(menu).not.toHaveAttribute('open');await expect(menu.locator('summary')).toBeFocused();
  await menu.locator('summary').click();await menu.getByRole('link',{name:/Hướng dẫn/}).click();await page.waitForURL('**/huong-dan');await expect(page.locator('.site-mobile-menu')).not.toHaveAttribute('open');pass('Menu mở, đóng bằng Escape và điều hướng đến trang kiến thức');
  await page.goto(base);await page.getByRole('link',{name:'Lập lá số miễn phí ngay',exact:true}).click();await expect(page.getByLabel('Họ và tên (không bắt buộc)')).toBeInViewport();
  const labelSize=await page.locator('label[for=birth-name]').evaluate(el=>parseFloat(getComputedStyle(el).fontSize));expect(labelSize).toBeGreaterThanOrEqual(14);pass('Nút bắt đầu đến đúng form, nhãn nhập liệu lớn hơn');
  await page.getByLabel('Ngày sinh',{exact:true}).selectOption('31');await page.getByLabel('Tháng sinh',{exact:true}).selectOption('2');await page.getByLabel('Năm sinh',{exact:true}).fill('2000');await page.getByRole('button',{name:'Lập lá số',exact:true}).click();await expect(page.locator('form [role=alert]')).toHaveText('Ngày sinh không tồn tại');
  await page.getByLabel('Ngày sinh',{exact:true}).selectOption('1');await page.getByRole('button',{name:'Lập lá số',exact:true}).click();await page.waitForURL('**/la-so?**');await expect(page.getByRole('heading',{name:'Nhìn nhanh lá số của bạn'})).toBeVisible();await fits();
  expect((await page.locator('.chart-overview').boundingBox()).y).toBeLessThan((await page.getByRole('region',{name:/Lá số 12 cung/}).boundingBox()).y);expect(await page.getByRole('button',{name:/^Xem cung /}).count()).toBe(12);pass('Ngày sai được chặn; lập lá số thật đủ 12 cung và tổng quan nằm trước bảng sao');
  await page.screenshot({path:out+'/chart-390.png'});
  const trigger=page.getByRole('button',{name:'Phóng to lá số'});await trigger.click();const modal=page.getByRole('dialog',{name:'Lá số 12 cung'});await expect(modal).toBeVisible();
  expect(await modal.getByRole('region').evaluate(el=>el.scrollWidth)).toBeGreaterThanOrEqual(1040);
  await modal.getByRole('button',{name:'Xem cung Quan Lộc',exact:true}).click();await expect(modal.getByRole('heading',{name:/^Cung Quan Lộc/})).toBeVisible();await fits();await modal.evaluate(el=>el.scrollTop=el.scrollHeight);await expect(modal.getByRole('button',{name:'Đóng'})).toBeInViewport();await page.screenshot({path:out+'/expanded-390.png'});pass('Nút đóng luôn nhìn thấy khi cuộn đến cuối lá số phóng to');
  await page.keyboard.press('Escape');await expect(modal).not.toBeVisible();await expect(trigger).toBeFocused();await expect(page.locator('aside').getByRole('heading',{name:/^Cung Quan Lộc/})).toBeVisible();pass('Lá số phóng to cuộn ngang riêng, chọn cung đồng bộ, Escape trả focus về nút mở');
  await trigger.click();await modal.getByRole('button',{name:'Đóng'}).click();await expect(modal).not.toBeVisible();
  await trigger.click();await modal.getByRole('link',{name:/Xem cách luận tổ hợp sao/}).click();await expect(modal).not.toBeVisible();await expect(page.locator('#mo-bai-luan')).toBeInViewport();pass('Nút đóng và liên kết đọc luận trong cửa sổ đều hoạt động');
  for(const width of [320,768,1440]){await page.setViewportSize({width,height:900});await page.evaluate(()=>scrollTo(0,0));await fits();await trigger.click();await expect(modal).toBeVisible();await fits();await modal.getByRole('button',{name:'Đóng'}).click();await page.screenshot({path:`${out}/chart-${width}.png`});pass(`Trang lá số và cửa sổ phóng to ${width}px không tràn trang`);}
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const plain=await nojs.newPage();await plain.goto(base);await plain.locator('.site-mobile-menu summary').click();await expect(plain.locator('.site-mobile-menu').getByRole('link',{name:/Hướng dẫn/})).toBeVisible();await plain.goto(page.url());expect(await plain.getByRole('button',{name:/^Xem cung /}).count()).toBe(12);await nojs.close();pass('Menu không phụ thuộc JavaScript; HTML ban đầu vẫn có lá số đầy đủ');
  expect(errors).toEqual([]);pass('Không có lỗi JavaScript hoặc HTTP 5xx');
}catch(error){process.exitCode=1;console.error(error);await page.screenshot({path:out+'/failure.png'}).catch(()=>{});}
finally{fs.writeFileSync(out+'/report.json',JSON.stringify({passed:!process.exitCode,checks,errors},null,2)+'\n');await browser.close();}
