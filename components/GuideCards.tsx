import type {Guide} from '@/lib/guides';

const GUIDE_META: Record<string, {icon: string; tag: string}> = {
  'cach-doc-la-so-tu-vi': { icon: '🧭', tag: 'NHẬP MÔN · 5 PHÚT ĐỌC' },
  'y-nghia-12-cung': { icon: '🏛️', tag: '12 CUNG VỊ · 7 PHÚT ĐỌC' },
  'nhap-ngay-am-hay-duong': { icon: '📅', tag: 'LỊCH PHÁP · 3 PHÚT ĐỌC' },
  'khong-biet-gio-sinh': { icon: '⏳', tag: 'ĐỊNH GIỜ · 4 PHÚT ĐỌC' },
};

export default function GuideCards({guides}: {guides: Guide[]}) {
  return <div className="guide-grid">
    {guides.map((guide,index) => {
      const meta = GUIDE_META[guide.slug] || { icon: '📜', tag: `HƯỚNG DẪN ${String(index+1).padStart(2,'0')}` };
      return <a key={guide.slug} href={`/huong-dan/${guide.slug}`} className="guide-card">
        <div className="guide-card-top">
          <span className="guide-card-category">
            <span className="guide-card-icon" aria-hidden="true">{meta.icon}</span>
            <span>{meta.tag}</span>
          </span>
          <span className="guide-card-arrow" aria-hidden="true">↗</span>
        </div>
        <h3>{guide.title}</h3>
        <p>{guide.description}</p>
        <span className="guide-card-link">Đọc hướng dẫn <span aria-hidden="true">→</span></span>
      </a>;
    })}
  </div>;
}
