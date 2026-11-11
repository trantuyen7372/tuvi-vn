/** @type {import('next').NextConfig} */
const {contentSecurityPolicy}=require('./lib/content-security-policy.cjs');
module.exports = {
  poweredByHeader: false,
  reactStrictMode: true,
  serverExternalPackages: ['@payos/node'],
  outputFileTracingExcludes: { '*': ['./data/**/*', './tm/**/*', './reports/**/*', './outputs/**/*', './storage/**/*', './.idea/**/*'] },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'Content-Security-Policy', value: contentSecurityPolicy({development:process.env.NODE_ENV==='development',https:process.env.SITE_URL?.startsWith('https://')}) },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Referrer-Policy', value: 'no-referrer' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
    ] },...['/api/:path*','/la-so','/don-hang/:path*','/luan-giai/:path*','/quan-tri','/tai-khoan','/dang-nhap','/dang-ky','/quen-mat-khau','/dat-lai-mat-khau','/xac-minh-email'].map(source=>({source,headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'}]}))];
  },
};
