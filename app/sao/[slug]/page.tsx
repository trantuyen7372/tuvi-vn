import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { STARS, STAR_BY_SLUG } from '@/lib/stars';
import {publicMetadata} from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';

export function generateStaticParams() {
  return STARS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = STAR_BY_SLUG[(await params).slug];
  if (!s) return {};
  return publicMetadata(`/sao/${s.slug}`,`Sao ${s.name}: ý nghĩa trong Tử Vi`,`Tìm hiểu sao ${s.name}, hành ${s.element}, các nét ${s.keywords.join(', ')}. Đọc ý nghĩa truyền thống và đối chiếu với vị trí sao trong lá số.`);
}

export default async function SaoPage({ params }: { params: Promise<{ slug: string }> }) {
  const s = STAR_BY_SLUG[(await params).slug];
  if (!s) notFound();
  const rows: [string, string][] = [
    ['Cung hợp', s.bestPalace],
    ['Cung kém', s.worstPalace],
    ['Sự nghiệp', s.career],
    ['Tình duyên', s.love],
    ['Tài lộc', s.wealth],
    ['Giới hạn khi đọc về sức khỏe', 'Biểu tượng sao và ngũ hành không xác định bệnh, tai nạn hoặc tuổi thọ. Không dùng nội dung này để chẩn đoán hay quyết định điều trị.'],
  ];
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={[{name:'Trang chủ',path:'/'},{name:'14 chính tinh',path:'/sao'},{name:`Sao ${s.name}`,path:`/sao/${s.slug}`}]}/>
      <h1 className="mt-3 font-serif text-4xl font-bold text-son">Sao {s.name}</h1>
      <p className="mt-1 text-[#6b5b45]">Hành {s.element} · {s.nature} · {s.keywords.join(' · ')}</p>
      <blockquote className="mt-6 border-l-4 border-son bg-white p-4 font-serif italic leading-relaxed">{s.coQuyet}</blockquote>
      <dl className="mt-6 space-y-4">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="font-serif text-lg font-bold text-son">{k}</dt>
            <dd className="mt-1 leading-relaxed">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-10 rounded-xl border border-[#d9c7a3] bg-white p-5 text-center">
        <p className="font-semibold">Muốn biết sao {s.name} nằm ở cung nào trong lá số của bạn?</p>
        <a href="/" className="btn mt-3">Lập lá số miễn phí</a>
      </div>
    </main>
  );
}
