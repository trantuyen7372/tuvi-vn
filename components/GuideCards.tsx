import type {Guide} from '@/lib/guides';

export default function GuideCards({guides}: {guides: Guide[]}) {
  return <div className="guide-grid">
    {guides.map((guide,index) => <a key={guide.slug} href={`/huong-dan/${guide.slug}`} className="guide-card">
      <div className="guide-card-top"><span>HƯỚNG DẪN {String(index+1).padStart(2,'0')}</span><span aria-hidden="true">↗</span></div>
      <h3>{guide.title}</h3>
      <p>{guide.description}</p>
      <span className="guide-card-link">Đọc hướng dẫn <span aria-hidden="true">→</span></span>
    </a>)}
  </div>;
}
