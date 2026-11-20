import type { MetadataRoute } from 'next';
import { STARS } from '@/lib/stars';
import { BOOKS } from '@/lib/classics';
import {SITE_ORIGIN} from '@/lib/seo';
import {GUIDES} from '@/lib/guides';

const BASE = SITE_ORIGIN;
const now = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/xem-ngay`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/xin-xam`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/hop-tuoi`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/bai-luan-mau`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/co-thu`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    ...BOOKS.map((b) => ({ url: `${BASE}/co-thu/${b.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 })),
    { url: `${BASE}/sao`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    ...STARS.map((s) => ({ url: `${BASE}/sao/${s.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.75 })),
    { url: `${BASE}/huong-dan`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    ...GUIDES.map(guide => ({url: `${BASE}/huong-dan/${guide.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 })),
    { url: `${BASE}/phuong-phap`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    ...['dieu-khoan','bao-mat','hoan-tien','gioi-thieu'].map(slug=>({url:`${BASE}/chinh-sach/${slug}`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.4 })),
  ];
}
