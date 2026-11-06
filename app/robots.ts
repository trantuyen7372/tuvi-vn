import type { MetadataRoute } from 'next';
import {SITE_ORIGIN} from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const base = SITE_ORIGIN;
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/la-so', '/don-hang/', '/luan-giai/', '/quan-tri','/tai-khoan','/dang-nhap','/dang-ky','/quen-mat-khau','/dat-lai-mat-khau','/xac-minh-email'] }], sitemap: `${base}/sitemap.xml` };
}
