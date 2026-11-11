import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { STARS, STAR_BY_SLUG } from '@/lib/stars';
import {publicMetadata} from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import {STAR_GUIDES} from '@/lib/star-guides';
import {BOOKS} from '@/lib/classics';

export function generateStaticParams() {
  return STARS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  const s = STARS.find(star => star.slug === slug);
  if (!s) notFound();
  return publicMetadata(`/sao/${s.slug}`,`Sao ${s.name}: ý nghĩa trong Tử Vi`,`Tìm hiểu sao ${s.name}, hành ${s.element}, các nét ${s.keywords.join(', ')}. Đọc ý nghĩa truyền thống và đối chiếu với vị trí sao trong lá số.`);
}

export default async function SaoPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const s = STARS.find(star => star.slug === slug);
  if (!s) notFound();
  const guide = STAR_GUIDES[s.slug];
  const sources = BOOKS.flatMap(book => book.chapters.flatMap(chapter => chapter.paragraphs
    .filter(paragraph => paragraph.tags.includes(s.name))
    .slice(0, 1).map(paragraph => ({title: `${book.title} — ${chapter.title}`, href: `/co-thu/${book.slug}#${paragraph.id}`})))).slice(0, 3);
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
      <p className="mt-4 text-sm leading-relaxed text-[#6b5b45]">Biên soạn: Xem Tử Vi Online · Có AI hỗ trợ. <a href="/phuong-phap" className="underline">Nguồn và phương pháp</a></p>
      <section className="mt-6"><h2 className="font-serif text-2xl font-bold text-son">Sao {s.name} có ý nghĩa gì?</h2><p className="mt-3 leading-relaxed">{guide.overview}</p></section>
      <div className="mt-6 border-l-4 border-son bg-white p-4"><p className="text-xs text-[#6b5b45]">Diễn ý theo cách luận truyền thống</p><p className="mt-2 font-serif italic leading-relaxed">{s.coQuyet}</p></div>
      <h2 className="mt-8 font-serif text-2xl font-bold text-son">Tóm tắt theo các chủ đề</h2>
      <p className="mt-3 text-sm leading-relaxed text-[#6b5b45]">Các mục “cung hợp” và “cung kém” là cách tóm lược trong dữ liệu tham khảo. Ý nghĩa còn phụ thuộc toàn bộ bố cục, không phải kết luận cố định cho người có sao này.</p>
      <dl className="mt-6 space-y-4">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="font-serif text-lg font-bold text-son">{k}</dt>
            <dd className="mt-1 leading-relaxed">{v}</dd>
          </div>
        ))}
      </dl>
      <section className="mt-8"><h2 className="font-serif text-2xl font-bold text-son">Cần đọc cùng những yếu tố nào?</h2><p className="mt-3 leading-relaxed">{guide.context}</p><p className="mt-3 leading-relaxed">Trước hết xác định <a href="/huong-dan/y-nghia-12-cung" className="text-son underline">cung đang chứa sao</a>, sau đó ghi nhận sao đi cùng, trạng thái và lớp thời gian. Xem thêm cách phân biệt <a href="/huong-dan/chinh-tinh-va-phu-tinh" className="text-son underline">chính tinh, phụ tinh và tứ hóa</a>.</p></section>
      <section className="mt-8 rounded-xl border border-[#d9c7a3] bg-white p-5"><h2 className="font-serif text-xl font-bold text-son">Ví dụ để thực hành cách đọc</h2><p className="mt-3 leading-relaxed">{guide.example}</p><a href="/huong-dan/cach-doc-la-so-tu-vi" className="mt-3 inline-block text-son underline">Xem trình tự đọc một lá số →</a></section>
      <section className="mt-8"><h2 className="font-serif text-2xl font-bold text-son">Nguồn để đối chiếu</h2><ul className="mt-3 list-disc space-y-2 pl-5">{sources.map(source => <li key={source.href}><a href={source.href} className="text-son underline">{source.title}</a></li>)}</ul><p className="mt-3 text-sm leading-relaxed text-[#6b5b45]">Liên kết dẫn tới bản trích yếu, có đoạn được diễn giải lại. Nội dung phản ánh quan niệm truyền thống, không phải bằng chứng khoa học về khả năng dự báo.</p></section>
      <nav aria-label="Sao liên quan" className="mt-8"><h2 className="font-serif text-xl font-bold text-son">Tra cứu sao liên quan</h2><ul className="mt-3 flex flex-wrap gap-3">{guide.related.map(slug => <li key={slug}><a href={`/sao/${slug}`} className="inline-block rounded-lg border border-[#d9c7a3] bg-white px-4 py-2 text-son hover:border-son">Sao {STAR_BY_SLUG[slug].name}</a></li>)}</ul><a href="/sao" className="mt-4 inline-block text-sm text-son underline">Xem đầy đủ 14 chính tinh</a></nav>
      <div className="mt-10 rounded-xl border border-[#d9c7a3] bg-white p-5 text-center">
        <p className="font-semibold">Muốn biết sao {s.name} nằm ở cung nào trong lá số của bạn?</p>
        <a href="/" className="btn mt-3">Lập lá số miễn phí</a>
      </div>
    </main>
  );
}
