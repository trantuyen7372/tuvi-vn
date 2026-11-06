import fs from 'node:fs';
import {chromium,expect} from '@playwright/test';
const {url}=JSON.parse(fs.readFileSync('storage/editorial-preview.json','utf8'));
if(new URL(url).origin!=='http://localhost:3100')throw Error('Chỉ kiểm tra bản local');
const browser=await chromium.launch({executablePath:chromium.executablePath()});
try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await expect(page.getByRole('heading',{name:/^11\. Kết luận/})).toBeAttached();
  const links=page.locator('article nav a');await expect(links).toHaveCount(11);
  for(const link of await links.all()){
    const id=(await link.getAttribute('href')).slice(1);
    if(!await page.evaluate(id=>!!document.getElementById(id),id))throw Error('Mục lục thiếu đích');
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  if(overflow||errors.length)throw Error(JSON.stringify({overflow,errors}));
  await page.screenshot({path:'outputs/ban-luan-doc-thu-mobile.png'});
  console.log('PASS: 11 chương, 11 liên kết mục lục hợp lệ, không tràn ngang ở 390px, không lỗi JavaScript');
}finally{await browser.close();}
