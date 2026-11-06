import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
const source=path.resolve(process.env.TUVI_DB_PATH||'storage/tuvi.sqlite');
if(!fs.existsSync(source))throw Error('Chưa có DB cần sao lưu');
const folder=path.resolve(process.env.TUVI_BACKUP_DIR||'storage/backups');
fs.mkdirSync(folder,{recursive:true,mode:0o700});
const target=path.join(folder,`tuvi-${new Date().toISOString().replace(/[:.]/g,'-')}.sqlite`);
const db=new DatabaseSync(source,{readOnly:true});db.exec('PRAGMA busy_timeout=5000');
try{db.prepare('VACUUM INTO ?').run(target);}finally{db.close();}
fs.chmodSync(target,0o600);
const copy=new DatabaseSync(target,{readOnly:true});
try{if(copy.prepare('PRAGMA quick_check').get().quick_check!=='ok')throw Error('Bản sao lưu không toàn vẹn');}finally{copy.close();}
console.log(`Đã sao lưu SQLite nhất quán và kiểm tra: ${target}`);
