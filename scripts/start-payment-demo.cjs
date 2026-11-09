// Môi trường thử riêng: không dùng khóa AI/email hoặc DB nhận tiền thật.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {spawn} = require('node:child_process');
const file = path.join(process.cwd(),'storage','demo-credentials.json');
fs.mkdirSync(path.dirname(file),{recursive:true,mode:0o700});
const credentials = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : { password:crypto.randomBytes(18).toString('base64url') };
fs.writeFileSync(file,JSON.stringify(credentials,null,2)+'\n',{mode:0o600});
const customers=process.argv.includes('--customers');
const env = {...process.env,...(process.argv.includes('--legacy-data')?{TUVI_DATASET_DIR:path.join(process.cwd(),'data','v4-vi')}:{}), ADMIN_PASSWORD:credentials.password, TUVI_DB_PATH:path.join(process.cwd(),'storage',customers?'customer-preview.sqlite':'payment-demo.sqlite'),
  PAYMENTS_ENABLED:customers?'0':'1',READING_ENGINE:customers?'dataset':'demo',FREE_READING_CREDITS:'1',
  SITE_URL:'http://localhost:3100', PAYMENT_PROVIDER:'mock', TUVI_ALLOW_TEST_PAYMENTS:'1', ANTHROPIC_API_KEY:'',
  RESEND_API_KEY:'', SMTP_PASSWORD:'', MAIL_FROM:'', PAYOS_CLIENT_ID:'',PAYOS_API_KEY:'',PAYOS_CHECKSUM_KEY:'',NEXT_TELEMETRY_DISABLED:'1'};
console.log('Bản thử: http://localhost:3100 · quản trị /quan-tri · mật khẩu nằm trong storage/demo-credentials.json');
const server=spawn(process.execPath,[require.resolve('next/dist/bin/next'),'start','-p','3100','-H','127.0.0.1'],{env,stdio:'inherit'});
process.on('SIGINT',()=>server.kill('SIGINT'));
process.on('SIGTERM',()=>server.kill('SIGTERM'));
server.on('exit',code=>process.exit(code||0));
