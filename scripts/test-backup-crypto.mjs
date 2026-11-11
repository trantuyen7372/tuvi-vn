import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {generateKeyPairSync,randomBytes} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {DatabaseSync} from 'node:sqlite';
import {encryptBackup,decryptBackup} from './backup-crypto.mjs';

const directory=fs.mkdtempSync(path.join(os.tmpdir(),'tuvi-backup-test-'));
const keys=()=>generateKeyPairSync('rsa',{modulusLength:3072,publicKeyEncoding:{type:'spki',format:'pem'},privateKeyEncoding:{type:'pkcs8',format:'pem'}});
const checks=[];const pass=name=>{checks.push(name);console.log('PASS '+name);};
try {
  const {publicKey,privateKey}=keys(),source=path.join(directory,'source.bin'),encrypted=path.join(directory,'source.enc'),restored=path.join(directory,'restored.bin');
  const bytes=randomBytes(256*1024);fs.writeFileSync(source,bytes,{mode:0o600});
  await encryptBackup(source,encrypted,publicKey);await decryptBackup(encrypted,restored,privateKey);
  assert.deepEqual(fs.readFileSync(restored),bytes);assert.ok(!fs.readFileSync(encrypted).includes(bytes.subarray(0,32)));
  assert.equal(fs.statSync(encrypted).mode&0o777,0o600);assert.equal(fs.statSync(restored).mode&0o777,0o600);
  await assert.rejects(encryptBackup(source,encrypted,publicKey));await assert.rejects(decryptBackup(encrypted,restored,privateKey));
  pass('Encrypted backups round-trip exactly, use mode 600 and cannot overwrite an existing file');

  const corrupted=path.join(directory,'tampered.enc'),output=path.join(directory,'must-not-exist.bin');
  const data=fs.readFileSync(encrypted);data[data.length-20]^=1;fs.writeFileSync(corrupted,data);
  await assert.rejects(decryptBackup(corrupted,output,privateKey));assert.equal(fs.existsSync(output),false);
  await assert.rejects(decryptBackup(encrypted,output,keys().privateKey));assert.equal(fs.existsSync(output),false);
  fs.writeFileSync(corrupted,fs.readFileSync(encrypted).subarray(0,25));
  await assert.rejects(decryptBackup(corrupted,output,privateKey));assert.equal(fs.existsSync(output),false);
  assert.ok(!fs.readdirSync(directory).some(name=>name.includes('.part-')||name.startsWith('.tuvi-restore-')));
  pass('Tampering, truncation and wrong keys fail without publishing plaintext or leaving temporary output');

  const database=path.join(directory,'test.sqlite'),folder=path.join(directory,'backups'),publicFile=path.join(directory,'public.pem');
  fs.writeFileSync(publicFile,publicKey);const db=new DatabaseSync(database);
  db.exec("CREATE TABLE fixture(value TEXT); INSERT INTO fixture VALUES ('Synthetic backup fixture');");db.close();
  const env={...process.env,SITE_URL:'https://review.example.invalid',TUVI_DB_PATH:database,TUVI_BACKUP_DIR:folder,TUVI_BACKUP_PUBLIC_KEY_FILE:publicFile};
  const result=spawnSync(process.execPath,['scripts/backup-db.mjs'],{env,encoding:'utf8'});assert.equal(result.status,0,result.stderr);
  const files=fs.readdirSync(folder);assert.equal(files.length,1);assert.ok(files[0].endsWith('.sqlite.enc'));
  const recovered=path.join(directory,'recovered.sqlite');await decryptBackup(path.join(folder,files[0]),recovered,privateKey);
  const copy=new DatabaseSync(recovered,{readOnly:true});assert.equal(copy.prepare('PRAGMA quick_check').get().quick_check,'ok');assert.equal(copy.prepare('SELECT value FROM fixture').get().value,'Synthetic backup fixture');copy.close();
  pass('The real backup command creates an encrypted, consistent SQLite snapshot that can be restored');
  const denied=spawnSync(process.execPath,['scripts/backup-db.mjs'],{env:{...env,TUVI_BACKUP_PUBLIC_KEY_FILE:''},encoding:'utf8'});
  assert.notEqual(denied.status,0);assert.equal(fs.readdirSync(folder).length,1);
  pass('Public deployments refuse a plaintext backup when the encryption key is missing');
  console.log(JSON.stringify({passed:checks.length,checks}));
}finally{fs.rmSync(directory,{recursive:true,force:true});}
