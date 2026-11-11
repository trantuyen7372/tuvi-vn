import {randomBytes, scrypt as scryptCallback, timingSafeEqual,type ScryptOptions} from 'node:crypto';

function derive(password:string,salt:string,parameters:ScryptOptions) {
  return new Promise<Buffer>((resolve,reject)=>scryptCallback(password,salt,64,parameters,(error,key)=>error?reject(error):resolve(key)));
}
// OWASP: N=2^15, r=8, p=3. Limit each derivation to 64 MiB.
const options = {N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024};
const prefix = 'scrypt$v2$32768$8$3$';
const legacy = /^scrypt\$([a-f0-9]{32})\$([a-f0-9]{128})$/;
const current = /^scrypt\$v2\$32768\$8\$3\$([a-f0-9]{32})\$([a-f0-9]{128})$/;

export function passwordNeedsUpgrade(stored: string) {
  return legacy.test(stored);
}

export async function passwordHash(password: string) {
  const salt = randomBytes(16).toString('hex');
  const key = await derive(password, salt, options);
  return `${prefix}${salt}$${key.toString('hex')}`;
}

export async function passwordMatches(password: string, stored: string) {
  const parsed = current.exec(stored) || legacy.exec(stored);
  const validInput = password.length > 0 && password.length <= 128;
  const salt = parsed?.[1] || '00000000000000000000000000000000';
  // Still perform a derivation for unknown accounts; never trust parameters from a stored string.
  const key = await derive(password.slice(0, 128), salt,
    parsed && legacy.test(stored) ? {N: 16384, r: 8, p: 1, maxmem: 32 * 1024 * 1024} : options);
  const expected = Buffer.from(parsed?.[2] || '00'.repeat(64), 'hex');
  return !!parsed && validInput && timingSafeEqual(key, expected);
}
