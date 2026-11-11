import type { MetadataRoute } from 'next';
import { STARS } from '@/lib/stars';
import { BOOKS } from '@/lib/classics';
import {SITE_ORIGIN} from '@/lib/seo';
import {GUIDES} from '@/lib/guides';

const BASE = SITE_ORIGIN;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/` },
    { url: `${BASE}/bai-luan-mau` },
    { url: `${BASE}/huong-dan` },
    ...GUIDES.map(guide => ({url: `${BASE}/huong-dan/${guide.slug}`})),
    { url: `${BASE}/phuong-phap` },
    ...['dieu-khoan','bao-mat','hoan-tien','gioi-thieu'].map(slug=>({url:`${BASE}/chinh-sach/${slug}`})),
    { url: `${BASE}/sao` },
    ...STARS.map((s) => ({ url: `${BASE}/sao/${s.slug}` })),
    { url: `${BASE}/co-thu` },
    ...BOOKS.map((b) => ({ url: `${BASE}/co-thu/${b.slug}` })),
  ];
}
