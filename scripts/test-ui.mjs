import fs from 'node:fs';
import path from 'node:path';
import { chromium, expect } from '@playwright/test';

const base='http://localhost:3100';
const out='outputs/ui-review';fs.mkdirSync(out,{recursive:true});
const password=JSON.parse(fs.readFileSync('storage/demo-credentials.json','utf8')).password;
const report={started:new Date().toISOString(),checks:[],screenshots:[],errors:[],localServerErrors:[]};
// Chromium for Testing chạy với hồ sơ tạm, không dùng dữ liệu Chrome cá nhân.
const browser=await chromium.launch({executablePath:chromium.executablePath(),headless:true});
report.browser=browser.version();
const context=await browser.newContext({viewport:{width:1440,height:1000},locale:'vi-VN'});
const page=await context.newPage();
page.on('pageerror',e=>report.errors.push(e.message));
page.on('response',res=>{if(res.url().startsWith(base)&&res.status()>=500)report.localServerErrors.push({url:new URL(res.url()).pathname,status:res.status()});});
let orderUrl='';
page.on('framenavigated',frame=>{if(frame===page.mainFrame()&&frame.url().startsWith(base+'/don-hang/'))orderUrl=frame.url();});
const check=name=>{report.checks.push(name);console.log('PASS '+name);};
async function shot(name,fullPage=false){const file=path.join(out,name+'.png');await page.screenshot({path:file,fullPage});report.screenshots.push(file);}
async function noOverflow(name){const size=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));expect(size.scroll,JSON.stringify(size)).toBeLessThanOrEqual(size.width+1);check(name);}
try{
  await page.goto(base+'/quan-tri');
  await page.getByLabel('Mật khẩu quản trị').fill(password);
  await page.getByRole('button',{name:'Đăng nhập',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Đơn hàng (tối đa 200 đơn gần nhất)'})).toBeVisible();
  check('Đăng nhập quản trị bằng giao diện');
  const coupon='UI'+Date.now();
  await page.getByLabel('Mã',{exact:true}).fill(coupon);
  await page.getByRole('button',{name:'Tạo mã',exact:true}).click();
  await expect(page.getByText(new RegExp(coupon+': giảm 100%'))).toBeVisible();
  check('Tạo mã thử 100% bằng giao diện');
  await page.setViewportSize({width:390,height:844});await noOverflow('Quản trị mobile không tràn toàn trang');await shot('admin-mobile',true);
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(base);await expect(page.getByRole('heading',{name:'Lập lá số Tử Vi',exact:true})).toBeVisible();
  await noOverflow('Trang chủ desktop không tràn ngang');await shot('home-desktop');
  for(const width of [320,390,768]){await page.setViewportSize({width,height:844});await noOverflow(`Trang chủ ${width}px không tràn ngang`);}
  await page.setViewportSize({width:390,height:844});await shot('home-mobile',true);
  await page.getByRole('link',{name:'Lập lá số miễn phí ngay',exact:true}).click();
  await expect(page.getByLabel('Họ và tên (không bắt buộc)')).toBeInViewport();check('Nút lập lá số đưa thẳng đến form trên mobile');
  await page.getByText('Chưa biết chính xác giờ sinh thì làm sao?',{exact:true}).click();
  await expect(page.getByText('Hãy hỏi lại gia đình hoặc đối chiếu giấy tờ trước khi mua.',{exact:false})).toBeVisible();check('FAQ mở được trên mobile');
  await page.getByRole('link',{name:'Đọc thử trước khi mua →'}).click();
  await expect(page.getByRole('heading',{name:'Một bài luận nên giúp bạn hiểu điều gì?'})).toBeVisible();
  await noOverflow('Bài mẫu mobile không tràn ngang');await shot('sample-mobile',true);check('Đi từ trang chủ tới bài mẫu');
  await page.getByRole('link',{name:'Lập lá số của bạn miễn phí'}).click();
  await page.getByLabel('Họ và tên (không bắt buộc)').fill('Người thử giao diện');
  await page.getByLabel('Ngày sinh',{exact:true}).selectOption('31');await page.getByLabel('Tháng sinh',{exact:true}).selectOption('2');await page.getByLabel('Năm sinh',{exact:true}).fill('2000');
  await page.getByRole('button',{name:'Lập lá số',exact:true}).click();
  await expect(page.locator('form [role="alert"]')).toHaveText('Ngày sinh không tồn tại');check('Ngày không tồn tại được báo lỗi tại form');
  await page.getByLabel('Ngày sinh',{exact:true}).selectOption('1');await page.getByLabel('Tháng sinh',{exact:true}).selectOption('1');
  await page.getByLabel('Giờ sinh',{exact:true}).selectOption('0');await page.getByLabel('Năm xem hạn',{exact:true}).fill('2026');
  await page.getByRole('button',{name:'Lập lá số',exact:true}).click();await page.waitForURL('**/la-so?**');
  await expect(page.getByRole('heading',{name:'Tổng quan miễn phí'})).toBeVisible();
  await expect(page.getByText('Đang lấy nội dung tham khảo…')).toBeHidden({timeout:20000});
  const preview=page.locator('section').filter({has:page.getByRole('heading',{name:'Tổng quan miễn phí'})});
  expect(await preview.innerText()).toContain('Đầu óc bạn nhanh nhạy');check('Lập lá số và tải tổng quan tiếng Việt trên mobile');
  await noOverflow('Trang lá số mobile chỉ cuộn trong vùng lá số');
  await page.getByRole('button',{name:'Xem cung Quan Lộc',exact:true}).click();await expect(page.getByRole('heading',{name:/^Cung Quan Lộc/})).toBeVisible();check('Chọn cung cập nhật phần chi tiết');
  const chart=page.getByRole('region',{name:'Lá số 12 cung, cuộn ngang trên màn hình nhỏ'});
  expect(await chart.evaluate(el=>el.scrollWidth>el.clientWidth)).toBe(true);check('Vùng lá số cuộn ngang được trên mobile');
  await shot('chart-mobile',true);
  await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>scrollTo(0,0));await shot('chart-desktop');
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('radio',{name:/Gói gia đình/}).check();await page.getByLabel('Email nhận kết quả').fill('ui-test@example.com');await page.getByLabel('Mã giảm giá (nếu có)').fill(coupon);
  // Chặn mọi bài được tạo từ một máy chủ không ở chế độ mock trước khi trang chạy AI.
  await context.route('**/api/readings/*',async route=>{
    if(route.request().method()==='POST'){
      if(!orderUrl)throw Error('Không quan sát được đơn thử');
      const r=await context.request.get(base+'/api/orders/'+orderUrl.split('/').pop());
      if((await r.json()).provider!=='mock')throw Error('Không cho gọi AI trên môi trường thật');
    }
    await route.continue();
  });
  await page.getByRole('button',{name:'Tiếp tục thanh toán',exact:true}).click();await page.waitForURL('**/luan-giai/*',{timeout:30000});
  await expect(page.getByText('Đây là văn bản mẫu',{exact:false})).toBeVisible({timeout:30000});check('Mua gói bằng coupon, tự mở và lưu bài demo');
  await noOverflow('Trang kết quả mobile không tràn ngang');await shot('reading-mobile',true);
  const readingUrl=page.url();await page.reload();await expect(page.getByText('Đây là văn bản mẫu',{exact:false})).toBeVisible();
  const status=await context.request.get(base+'/api/readings/'+readingUrl.split('/').pop());expect((await status.json()).attempts).toBe(1);check('Reload xem lại, không tạo bài hay dùng lượt lần nữa');
  await page.goto(orderUrl);await expect(page.getByText('Còn',{exact:false}).filter({hasText:'4'})).toBeVisible();check('Gói gia đình còn đúng 4 lượt sau một bài');await shot('paid-order-mobile',true);
  for(const slug of ['dieu-khoan','bao-mat','hoan-tien','gioi-thieu']){await page.goto(base+'/chinh-sach/'+slug);await expect(page.locator('main h1')).toBeVisible();await noOverflow(`Chính sách ${slug} trên mobile`);}
  await page.goto(base);await page.getByLabel('Ngày sinh',{exact:true}).selectOption('1');await page.getByLabel('Tháng sinh',{exact:true}).selectOption('1');await page.getByLabel('Năm sinh',{exact:true}).fill('2000');await page.getByRole('button',{name:'Lập lá số',exact:true}).click();await page.waitForURL('**/la-so?**');
  await page.getByLabel('Email nhận kết quả').fill('ui-pending@example.com');await page.getByRole('button',{name:'Tiếp tục thanh toán',exact:true}).click();await page.waitForURL('**/don-hang/*');
  await expect(page.getByRole('heading',{name:'Chờ chuyển khoản'})).toBeVisible();await expect(page.getByText('Đơn thử, không chuyển tiền.',{exact:false})).toBeVisible();
  check('Đơn chưa thanh toán chỉ hiển thị chờ, không mở bài');await noOverflow('Đơn chờ mobile không tràn ngang');await shot('pending-order-mobile',true);
  await page.setViewportSize({width:1440,height:1000});await page.goto(base);await shot('home-desktop-final');
  expect(report.errors,'Lỗi JavaScript trong trình duyệt').toEqual([]);expect(report.localServerErrors,'Lỗi 5xx từ website').toEqual([]);check('Không có lỗi JavaScript hoặc HTTP 5xx trong toàn luồng');
  report.passed=true;
}catch(e){report.passed=false;report.failure=e.message;await shot('failure',true).catch(()=>{});process.exitCode=1;console.error(e);}
finally{report.finished=new Date().toISOString();fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');await browser.close();console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,screenshots:report.screenshots.length,failure:report.failure}));}
