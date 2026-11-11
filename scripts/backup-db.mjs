import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import {encryptBackup} from './backup-crypto.mjs';
import {randomUUID} from 'node:crypto';
const source=path.resolve(process.env.TUVI_DB_PATH||'storage/tuvi.sqlite');
if(!fs.existsSync(source))throw Error('Chưa có DB cần sao lưu');
const folder=path.resolve(process.env.TUVI_BACKUP_DIR||'storage/backups');
fs.mkdirSync(folder,{recursive:true,mode:0o700});
const publicKeyFile=process.env.TUVI_BACKUP_PUBLIC_KEY_FILE;
const site=new URL(process.env.SITE_URL||'http://localhost');
if(!publicKeyFile&&!['localhost','127.0.0.1','[::1]'].includes(site.hostname))throw Error('Cần TUVI_BACKUP_PUBLIC_KEY_FILE để mã hóa backup trên máy chủ công khai');
const temporary=fs.mkdtempSync(path.join(folder,'.tuvi-snapshot-'));
const snapshot=path.join(temporary,'snapshot.sqlite');
const target=path.join(folder,`tuvi-${new Date().toISOString().replace(/[:.]/g,'-')}-${randomUUID()}.sqlite${publicKeyFile?'.enc':''}`);
const db=new DatabaseSync(source,{readOnly:true});db.exec('PRAGMA busy_timeout=5000');
try{
  try{db.prepare('VACUUM INTO ?').run(snapshot);}finally{db.close();}
  fs.chmodSync(snapshot,0o600);
  const copy=new DatabaseSync(snapshot,{readOnly:true});
  try{if(copy.prepare('PRAGMA quick_check').get().quick_check!=='ok')throw Error('Bản sao lưu không toàn vẹn');}finally{copy.close();}
  if(publicKeyFile)await encryptBackup(snapshot,target,fs.readFileSync(publicKeyFile));
  else fs.linkSync(snapshot,target);
}finally{fs.rmSync(temporary,{recursive:true,force:true});}
console.log(`Đã sao lưu SQLite nhất quán, kiểm tra và ${publicKeyFile?'mã hóa':'lưu local'}: ${target}`);
