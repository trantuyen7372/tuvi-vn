import {randomBytes} from 'node:crypto';
import {NextRequest,NextResponse} from 'next/server';
const {contentSecurityPolicy}=require('./lib/content-security-policy.cjs');

// Only private, dynamically rendered pages need per-response script nonces.
export function proxy(request:NextRequest) {
  const nonce=randomBytes(24).toString('base64');
  const policy=contentSecurityPolicy({nonce,development:process.env.NODE_ENV==='development',https:process.env.SITE_URL?.startsWith('https://')});
  const headers=new Headers(request.headers);
  headers.set('Content-Security-Policy',policy);
  const response=NextResponse.next({request:{headers}});
  response.headers.set('Content-Security-Policy',policy);
  response.headers.set('Cache-Control','private, no-store');
  return response;
}

export const config={matcher:[
  '/la-so','/luan-giai/:path*','/don-hang/:path*','/quan-tri','/tai-khoan',
  '/dang-nhap','/dang-ky','/quen-mat-khau','/dat-lai-mat-khau','/xac-minh-email',
]};
