/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  serverExternalPackages: ['@payos/node'],
  outputFileTracingExcludes: { '*': ['./data/**/*', './tm/**/*', './reports/**/*', './outputs/**/*', './storage/**/*', './.idea/**/*'] },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'Referrer-Policy', value: 'no-referrer' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
    ] },...['/api/:path*','/la-so','/don-hang/:path*','/luan-giai/:path*','/quan-tri','/tai-khoan','/dang-nhap','/dang-ky','/quen-mat-khau','/dat-lai-mat-khau','/xac-minh-email'].map(source=>({source,headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'}]}))];
  },
};
