import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import {spawn} from 'node:child_process';
import {createRequire} from 'node:module';
import {chromium,expect} from '@playwright/test';
const require=createRequire(import.meta.url),folder='outputs/ai-streaming-ui';
fs.mkdirSync(folder,{recursive:true});
const listener=net.createServer();
await new Promise(resolve=>listener.listen(0,'127.0.0.1',resolve));
const port=listener.address().port;await new Promise(resolve=>listener.close(resolve));
const base='http://127.0.0.1:'+port,checks=[],errors=[];
const server=spawn(process.execPath,[require.resolve('next/dist/bin/next'),'start','-p',String(port),'-H','127.0.0.1'],{
  env:{...process.env,ANTHROPIC_API_KEY:'',RESEND_API_KEY:'',PAYMENTS_ENABLED:'0',TUVI_DB_PATH:path.join(fs.mkdtempSync(path.join(os.tmpdir(),'tuvi-stream-ui-')),'test.sqlite')},
  stdio:['ignore','pipe','pipe'],
});
let serverOutput='';server.stdout.on('data',chunk=>{serverOutput+=chunk;});server.stderr.on('data',chunk=>{serverOutput+=chunk;});
let browser,finish;
try{
  await expect.poll(async()=>{try{return (await fetch(base)).status;}catch{return 0;}},{timeout:30000}).toBe(200);
  browser=await chromium.launch({headless:true,executablePath:chromium.executablePath()});
  const page=await browser.newPage({viewport:{width:390,height:844}});
  page.on('pageerror',error=>errors.push(error.message));
  await page.route('https://fonts.googleapis.com/**',route=>route.abort());
  await page.route('https://fonts.gstatic.com/**',route=>route.abort());
  const draft='## Tổng quan bản mệnh\n\nPhần mở đầu đang được hiển thị trước khi các phần khác hoàn tất.';
  const complete=draft+'\n\n## Công danh, sự nghiệp\n\nNội dung tiếp theo đã hoàn tất.';
  let state={status:'pending',text:'',attempts:0,input:{name:'Kiểm thử đọc dần'},emailStatus:'pending',canPersonalize:false},posts=0;
  await page.route('**/api/**',async route=>{
    const request=route.request(),url=new URL(request.url());
    if(url.pathname.startsWith('/api/readings/')){
      if(request.method()==='POST'){
        posts++;state={...state,status:'running',text:draft,attempts:1};
        await new Promise(resolve=>{finish=()=>{state={...state,status:'done',text:complete};resolve();};});
        await route.fulfill({json:{ok:true}}).catch(()=>{});
      }else await route.fulfill({json:state});
    }else if(url.pathname==='/api/auth/me')await route.fulfill({json:{customer:null,paymentsEnabled:false,demo:false}});
    else await route.fulfill({status:501,json:{error:'Not part of this UI test'}});
  });
  const url=base+'/luan-giai/'+'a'.repeat(64);
  await page.goto(url);
  await expect(page.getByRole('region',{name:'Nội dung đang biên soạn'})).toContainText('Phần mở đầu',{timeout:10000});
  expect(posts).toBe(1);
  await expect(page.getByRole('button',{name:'In / lưu PDF'})).toHaveCount(0);
  await expect(page.getByRole('status')).toContainText('Bài luận đang hiện dần');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
  await page.screenshot({path:folder+'/dang-viet-mobile.png',fullPage:true});
  checks.push('Mobile displays a labeled draft while POST remains open; incomplete article has no print action');
  await page.reload();
  await expect(page.getByRole('region',{name:'Nội dung đang biên soạn'})).toContainText('Phần mở đầu');
  expect(posts).toBe(1);
  checks.push('Reload during generation resumes draft without issuing a second POST');
  finish();
  await expect(page.getByRole('button',{name:'In / lưu PDF'})).toBeVisible({timeout:10000});
  await expect(page.getByRole('region',{name:'Nội dung đang biên soạn'})).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'Công danh, sự nghiệp',exact:true})).toBeVisible();
  await page.reload();await expect(page.getByRole('button',{name:'In / lưu PDF'})).toBeVisible();
  expect(posts).toBe(1);
  checks.push('Completion reveals the saved article and print action; reopening does not regenerate');
  state={...state,status:'error',text:draft,emailStatus:'pending'};
  await page.reload();await expect(page.getByRole('region',{name:'Nội dung đang biên soạn'})).toContainText('Bài chưa hoàn tất');
  await expect(page.getByRole('button',{name:'In / lưu PDF'})).toHaveCount(0);
  expect(errors).toEqual([]);
  checks.push('Failed generation retains a clearly labeled partial article and cannot be printed as complete');
  fs.writeFileSync('reports/ai-streaming-ui-tests.json',JSON.stringify({passed:true,checks,posts,errors,evidence:'Production Next.js app in Chromium with simulated browser API responses; no real AI requests.'},null,2)+'\n');
  console.log(JSON.stringify({passed:true,checks,posts,errors}));
}catch(error){console.error(error);console.error(serverOutput.slice(-3000));process.exitCode=1;}
finally{if(finish)finish();if(browser)await browser.close();server.kill('SIGTERM');}
