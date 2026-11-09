import fs from 'node:fs';
import {chromium,expect} from '@playwright/test';
const base='http://localhost:3100',folder='outputs/auth-email/browser';fs.mkdirSync(folder,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:chromium.executablePath()}),checks=[],errors=[];
const pass=name=>{checks.push(name);console.log('PASS '+name);};
async function context(){const c=await browser.newContext({viewport:{width:390,height:844}});c.on('page',page=>page.on('pageerror',e=>errors.push(e.message)));await c.route('https://fonts.googleapis.com/**',r=>r.abort());await c.route('https://fonts.gstatic.com/**',r=>r.abort());return c;}
async function noOverflow(page){expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);}
try{
  const real=await context(),page=await real.newPage();
  expect((await (await real.request.get(base+'/api/auth/me')).json()).demo).toBe(true);
  await page.goto(base+'/dang-ky');
  const email=`email-ui-${Date.now()}@example.invalid`;
  await page.getByLabel('Email',{exact:true}).fill(email);await page.getByLabel('Mật khẩu',{exact:true}).fill('EmailUiTest!12345');await page.getByLabel('Nhập lại mật khẩu').fill('EmailUiTest!12345');await page.getByRole('checkbox').check();
  await page.getByRole('button',{name:'Tạo tài khoản',exact:true}).click();await page.waitForURL('**/tai-khoan');
  await expect(page.getByRole('heading',{name:'Còn 0 lượt trải nghiệm'})).toBeVisible();
  await expect(page.getByRole('status')).toContainText('không gửi email thật');
  await page.getByRole('button',{name:'Gửi lại thư xác minh'}).click();
  const url=await page.getByRole('link',{name:'Mở thư xác minh thử (chỉ có ở môi trường demo)'}).getAttribute('href');expect(url).toBeTruthy();
  await noOverflow(page);await page.screenshot({path:folder+'/cho-xac-minh-mobile.png',fullPage:true});
  pass('Real signup shows pending verification, zero credits and honest demo delivery state');
  const verify=await real.newPage();await verify.goto(url);await verify.getByRole('button',{name:'Xác nhận email'}).click();await expect(verify.getByRole('status')).toContainText('Email đã được xác minh');
  await expect(verify.getByRole('button',{name:'Xác nhận email'})).toHaveCount(0);
  await page.bringToFront();await expect(page.getByRole('heading',{name:'Còn 1 lượt trải nghiệm'})).toBeVisible();await expect(page.getByRole('button',{name:'Gửi lại thư xác minh'})).toHaveCount(0);
  pass('Verification in another tab refreshes original account to one credit and hides further confirmation');
  await verify.goto(base+'/xac-minh-email?token='+'0'.repeat(64));await verify.getByRole('button',{name:'Xác nhận email'}).click();
  await expect(verify.locator('main').getByRole('alert')).toContainText('gửi lại thư xác minh');await expect(verify.locator('main').getByRole('alert').getByRole('link',{name:'mở tài khoản'})).toHaveAttribute('href','/tai-khoan');
  pass('Invalid or expired link offers account and resend recovery instead of a dead end');
  await real.close();

  const simulated=await context(),statePage=await simulated.newPage();let delivery='sent',resendStatus=200;
  const customer={email:'khach-hang-co-dia-chi-email-dai@example.invalid',verified:false};
  await simulated.route('**/api/**',async route=>{
    const path=new URL(route.request().url()).pathname;
    if(path==='/api/auth/me')return route.fulfill({json:{customer,paymentsEnabled:false}});
    if(path==='/api/account')return route.fulfill({json:{customer,credits:0,welcomeCredits:1,paymentsEnabled:false,verificationDelivery:{status:delivery,created:1},profiles:[],readings:[],orders:[]}});
    if(path==='/api/auth/resend')return route.fulfill({status:resendStatus,json:resendStatus===200?{status:delivery}:{error:'Quá nhiều yêu cầu, vui lòng thử lại sau'}});
    return route.fulfill({status:501,json:{error:'Not modeled'}});
  });
  await statePage.goto(base+'/tai-khoan');await expect(statePage.getByRole('status')).toContainText(customer.email);await expect(statePage.getByRole('status')).toContainText('Thư rác/Spam');await noOverflow(statePage);await statePage.screenshot({path:folder+'/thu-da-gui-mobile.png',fullPage:true});
  delivery='failed';await statePage.getByRole('button',{name:'Gửi lại thư xác minh'}).click();await expect(statePage.getByRole('status')).toContainText('Chưa gửi được thư xác minh');
  delivery='sent';await statePage.getByRole('button',{name:'Gửi lại thư xác minh'}).click();await expect(statePage.getByRole('status')).toContainText('Thư xác minh đã được gửi');
  delivery='not_configured';await statePage.reload();await expect(statePage.getByRole('status')).toContainText('Tài khoản đã được tạo');
  resendStatus=400;await statePage.getByRole('button',{name:'Gửi lại thư xác minh'}).click();await expect(statePage.locator('main').getByRole('alert')).toContainText('Quá nhiều yêu cầu');
  await noOverflow(statePage);await statePage.screenshot({path:folder+'/loi-gui-thu-mobile.png',fullPage:true});
  pass('Simulated sent/failure/missing-configuration/rate-limit states have clear messages and allow appropriate recovery');
  await statePage.setViewportSize({width:1440,height:1000});await statePage.reload();await statePage.screenshot({path:folder+'/xac-minh-desktop.png',fullPage:true});await simulated.close();

  const templates=await context(),template=await templates.newPage();
  for(const name of ['verification','reset']){
    await template.setContent(fs.readFileSync(`outputs/auth-email/${name}.html`,'utf8'));
    await expect(template.getByRole('link',{name:name==='verification'?'Xác minh email':'Đặt lại mật khẩu',exact:true})).toBeVisible();
    await noOverflow(template);await template.screenshot({path:`${folder}/${name}-template-mobile.png`,fullPage:true});
  }
  pass('Verification and reset HTML templates render at 390px with visible action and no horizontal overflow');
  await templates.close();expect(errors).toEqual([]);
  fs.writeFileSync('reports/email-ui-tests.json',JSON.stringify({passed:true,checks,errors,evidence:'Production app in Chromium. Real demo signup, resend and cross-tab verification; delivery error UI uses intercepted responses; templates rendered from generated HTML. No real emails.'},null,2)+'\n');
}catch(error){fs.writeFileSync('reports/email-ui-tests.json',JSON.stringify({passed:false,checks,error:error.message},null,2)+'\n');console.error(error);process.exitCode=1;}finally{await browser.close();}
