import fs from 'node:fs';
import path from 'node:path';
import { parseEnv } from 'node:util';
import zlib from 'node:zlib';
const env={...(fs.existsSync('.env.local')?parseEnv(fs.readFileSync('.env.local','utf8')):{}),...process.env};
const live=process.argv.includes('--live');
const issues=[],warnings=[];
const [major,minor]=process.versions.node.split('.').map(Number);
if(major<22||(major===22&&minor<15))issues.push('Cần Node >=22.15');
if(typeof zlib.zstdDecompressSync!=='function')issues.push('Node thiếu zstd');
try{await import('node:sqlite');}catch{issues.push('Node thiếu SQLite');}
const indexedDefault='data/v5-indexed';
const dir=env.TUVI_DATASET_DIR||(fs.existsSync(path.join(indexedDefault,'verification.json'))?indexedDefault:'data/v4-vi');
const indexed=fs.existsSync(path.join(dir,'manifest.json'));
let months=0;
for(let y=1950;y<=2026;y++)for(let m=1;m<=12;m++){const month=`${y}-${String(m).padStart(2,'0')}`;if(indexed?fs.existsSync(path.join(dir,month+'.index.json'))&&fs.existsSync(path.join(dir,month+'.records.zst')):fs.existsSync(path.join(dir,month+'.jsonl.zst')))months++;}
if(months!==924)issues.push(`Dữ liệu Việt thiếu tháng: ${months}/924`);
if(months===924)try{
  let compressed;
  if(indexed){
    const manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));if(manifest.format!=='record-zstd-v1'||manifest.complete!==true||manifest.verified!==true)throw Error();
    const index=JSON.parse(fs.readFileSync(path.join(dir,'2000-01.index.json'),'utf8')),[offset,length]=index.records['2000-01-01-0-male'];
    compressed=Buffer.alloc(length);const fd=fs.openSync(path.join(dir,index.data.file),'r');try{let n=0;while(n<length){const read=fs.readSync(fd,compressed,n,length-n,offset+n);if(!read)throw Error();n+=read;}}finally{fs.closeSync(fd);}
  }else compressed=fs.readFileSync(path.join(dir,'2000-01.jsonl.zst'));
  const text=zlib.zstdDecompressSync(compressed).toString(),row=JSON.parse(text.split('\n')[0]);if(!row.c.overview||/[一-鿿]/.test(row.c.overview))throw Error();
}catch{issues.push('Không đọc được mẫu dữ liệu tiếng Việt');}
const paid=env.PAYMENTS_ENABLED==='1',engine=env.READING_ENGINE||'dataset';
const mailProvider=env.MAIL_PROVIDER||(env.RESEND_API_KEY?'resend':'gmail');
const required=['SITE_URL','ADMIN_PASSWORD','MAIL_FROM',...(mailProvider==='gmail'?['SMTP_USER','SMTP_PASSWORD']:['RESEND_API_KEY']),'OPERATOR_NAME','OPERATOR_ADDRESS','SUPPORT_EMAIL',...(paid?['PAYOS_CLIENT_ID','PAYOS_API_KEY','PAYOS_CHECKSUM_KEY']:[]),...(engine==='anthropic'?['ANTHROPIC_API_KEY']:[])];
const missing=required.filter(k=>!env[k]);
if(live){
  issues.push(...missing.map(k=>`Thiếu ${k}`));
  if(!['gmail','resend'].includes(mailProvider))issues.push('MAIL_PROVIDER cần là gmail hoặc resend');
  if(env.ADMIN_PASSWORD&&env.ADMIN_PASSWORD.length<12)issues.push('Mật khẩu quản trị dưới 12 ký tự');
  try{const u=new URL(env.SITE_URL);if(u.protocol!=='https:'||['localhost','127.0.0.1'].includes(u.hostname))throw Error();}catch{issues.push('SITE_URL cần tên miền HTTPS thực tế');}
  if(paid&&env.PAYMENT_PROVIDER!=='payos')issues.push('Chưa chọn PayOS để nhận tiền');
  if(env.TUVI_ALLOW_TEST_PAYMENTS==='1'||engine==='demo')issues.push('Không bật chế độ thử công khai');
}else if(missing.length)warnings.push('Chưa đủ cấu hình mở bán; chạy lại với --live để xem trường còn thiếu');
if(!fs.existsSync('.next/BUILD_ID'))issues.push('Chưa có build production');
const result={mode:live?'live':'preview',node:process.versions.node,datasetMonths:months,datasetFormat:indexed?'record-zstd-v1':'legacy-month-zstd',paymentsEnabled:paid,readingEngine:engine,issues,warnings,ready:issues.length===0};
fs.mkdirSync('reports',{recursive:true});fs.writeFileSync(`reports/preflight-${result.mode}.json`,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));if(issues.length)process.exitCode=1;
