import fs from 'node:fs';
import path from 'node:path';
import {createCipheriv,createDecipheriv,createPublicKey,privateDecrypt,publicEncrypt,randomBytes,constants} from 'node:crypto';
import {pipeline} from 'node:stream/promises';

const magic=Buffer.from('TUVI-BACKUP-v1\n');
const rsaOptions={padding:constants.RSA_PKCS1_OAEP_PADDING,oaepHash:'sha256'};

export async function encryptBackup(source,target,publicKey) {
  const keyObject=createPublicKey(publicKey);
  if(keyObject.asymmetricKeyType!=='rsa'||keyObject.asymmetricKeyDetails.modulusLength<3072)throw Error('Khóa backup cần là RSA tối thiểu 3072 bit');
  const key=randomBytes(32),iv=randomBytes(12);
  const wrapped=publicEncrypt({...rsaOptions,key:keyObject},key);
  const header=Buffer.from(JSON.stringify({algorithm:'AES-256-GCM+RSA-OAEP-SHA256',iv:iv.toString('base64'),key:wrapped.toString('base64')}));
  const length=Buffer.alloc(4);length.writeUInt32BE(header.length);
  const prefix=Buffer.concat([magic,length,header]);
  const cipher=createCipheriv('aes-256-gcm',key,iv);cipher.setAAD(prefix);
  // Publish only complete files; never overwrite an existing backup.
  const temporary=target+'.part-'+randomBytes(8).toString('hex');
  try {
    await fs.promises.writeFile(temporary,prefix,{flag:'wx',mode:0o600});
    await pipeline(fs.createReadStream(source),cipher,fs.createWriteStream(temporary,{flags:'a',mode:0o600}));
    await fs.promises.appendFile(temporary,cipher.getAuthTag());
    await fs.promises.link(temporary,target);
  } finally {key.fill(0);await fs.promises.rm(temporary,{force:true});}
}

export async function decryptBackup(source,target,privateKey) {
  const file=await fs.promises.open(source,'r');
  let cipherStart,tag,prefix,header,end;
  try {
    const stat=await file.stat(),fixed=Buffer.alloc(magic.length+4);
    if((await file.read(fixed,0,fixed.length,0)).bytesRead!==fixed.length||!fixed.subarray(0,magic.length).equals(magic))throw Error('Định dạng backup không hợp lệ');
    const length=fixed.readUInt32BE(magic.length);
    if(length<1||length>8192||stat.size<fixed.length+length+16)throw Error('Backup bị cắt hoặc header không hợp lệ');
    const bytes=Buffer.alloc(length);await file.read(bytes,0,length,fixed.length);
    header=JSON.parse(bytes.toString('utf8'));
    if(header.algorithm!=='AES-256-GCM+RSA-OAEP-SHA256')throw Error('Thuật toán backup không hợp lệ');
    prefix=Buffer.concat([fixed,bytes]);cipherStart=prefix.length;end=stat.size-17;
    tag=Buffer.alloc(16);await file.read(tag,0,16,stat.size-16);
  }finally{await file.close();}
  const key=privateDecrypt({...rsaOptions,key:privateKey},Buffer.from(header.key,'base64'));
  const iv=Buffer.from(header.iv,'base64');
  if(key.length!==32||iv.length!==12)throw Error('Khóa hoặc IV backup không hợp lệ');
  const decipher=createDecipheriv('aes-256-gcm',key,iv);decipher.setAAD(prefix);decipher.setAuthTag(tag);
  const directory=await fs.promises.mkdtemp(path.join(path.dirname(target),'.tuvi-restore-'));
  const temporary=path.join(directory,'verified.sqlite');
  try {
    await pipeline(fs.createReadStream(source,{start:cipherStart,end}),decipher,fs.createWriteStream(temporary,{flags:'wx',mode:0o600}));
    // Authenticated decryption must finish before publishing the plaintext.
    await fs.promises.link(temporary,target);
  }finally{key.fill(0);await fs.promises.rm(directory,{recursive:true,force:true});}
}
