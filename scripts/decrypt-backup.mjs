import fs from 'node:fs';
import {decryptBackup} from './backup-crypto.mjs';
const [source,target]=process.argv.slice(2);
if(!source||!target||!process.env.TUVI_RESTORE_PRIVATE_KEY_FILE)throw Error('Cần đường dẫn backup, tệp đích mới và TUVI_RESTORE_PRIVATE_KEY_FILE. Chạy trên máy khôi phục riêng.');
await decryptBackup(source,target,fs.readFileSync(process.env.TUVI_RESTORE_PRIVATE_KEY_FILE));
console.log('Đã giải mã và xác minh toàn vẹn. Kiểm tra SQLite trên tệp đích trước khi khôi phục dịch vụ.');
