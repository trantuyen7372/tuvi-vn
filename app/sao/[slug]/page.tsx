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
    <main className="editorial-page mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={[{name:'Trang chủ',path:'/'},{name:'14 chính tinh',path:'/sao'},{name:`Sao ${s.name}`,path:`/sao/${s.slug}`}]}/>
      <h1 className="mt-3 font-serif text-4xl font-bold text-son">Sao {s.name}</h1>
      <p className="mt-1 text-[#6b5b45]">Hành {s.element} · {s.nature} · {s.keywords.join(' · ')}</p>
      <p className="mt-4 text-sm leading-relaxed text-[#6b5b45]">Nội dung do chúng tôi biên soạn. <a href="/phuong-phap" className="underline">Nguồn và phương pháp</a></p>
      <section className="mt-6"><h2 className="font-serif text-2xl font-bold text-son">Sao {s.name} có ý nghĩa gì?</h2><p className="mt-3 leading-relaxed">{guide.overview}</p></section>
      <div className="mt-6 rounded-r-xl border border-[#e5d8c3] border-l-4 border-l-son bg-gradient-to-r from-[#faf3e6] to-[#fffdf9] p-5 shadow-xs">
        <p className="text-xs font-bold uppercase tracking-wider text-[#8c6729]">✦ DIỄN Ý THEO KHẨU QUYẾT CỔ TRUYỀN</p>
        <p className="mt-2 font-serif text-base italic leading-relaxed text-[#352516]">“{s.coQuyet}”</p>
      </div>

      <h2 className="mt-10 font-serif text-2xl font-bold text-son">Tóm tắt theo các chủ đề</h2>
      <p className="mt-2 text-sm leading-relaxed text-[#6b5b45]">Các mục “cung hợp” và “cung kém” là cách tóm lược trong dữ liệu tham khảo. Ý nghĩa còn phụ thuộc toàn bộ bố cục, không phải kết luận cố định cho người có sao này.</p>
      
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="rounded-xl border border-[#e5d8c3] bg-gradient-to-b from-[#fffefc] to-[#fbf6ec] p-4 shadow-xs">
            <dt className="font-serif text-base font-bold text-son">{k}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-[#443525]">{v}</dd>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-serif text-2xl font-bold text-son">Cần đọc cùng những yếu tố nào?</h2>
        <p className="mt-3 leading-relaxed text-[#3d2f21]">{guide.context}</p>
        <p className="mt-3 leading-relaxed text-[#5c4936]">Trước hết xác định <a href="/huong-dan/y-nghia-12-cung" className="text-son underline font-medium">cung đang chứa sao</a>, sau đó ghi nhận sao đi cùng, trạng thái và lớp thời gian. Xem thêm cách phân biệt <a href="/huong-dan/chinh-tinh-va-phu-tinh" className="text-son underline font-medium">chính tinh, phụ tinh và tứ hóa</a>.</p>
      </section>

      <section className="mt-8 rounded-2xl border border-[#d8c5a6] border-t-3 border-t-[#b5894c] bg-gradient-to-b from-[#fffefc] to-[#fbf5e7] p-6 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8c6729]">✦ MINH HỌA PHÂN TÍCH</span>
        <h2 className="mt-1 font-serif text-xl font-bold text-son">Ví dụ để thực hành cách đọc</h2>
        <p className="mt-3 leading-relaxed text-[#443525]">{guide.example}</p>
        <a href="/huong-dan/cach-doc-la-so-tu-vi" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-son underline">
          Xem trình tự đọc một lá số →
        </a>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-2xl font-bold text-son">Nguồn để đối chiếu</h2>
        <ul className="mt-3 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-[#443525]">
          {sources.map(source => (
            <li key={source.href}>
              <a href={source.href} className="text-son underline font-medium hover:text-[#781414]">
                {source.title}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-[#7c6952]">Liên kết dẫn tới bản trích yếu, có đoạn được diễn giải lại. Nội dung phản ánh quan niệm truyền thống, không phải bằng chứng khoa học về khả năng dự báo.</p>
      </section>

      <nav aria-label="Sao liên quan" className="mt-10 border-t border-[#ebdcc7] pt-8">
        <h2 className="font-serif text-xl font-bold text-son">Tra cứu sao liên quan</h2>
        <ul className="mt-4 flex flex-wrap gap-2.5">
          {guide.related.map(slug => (
            <li key={slug}>
              <a href={`/sao/${slug}`} className="inline-block rounded-lg border border-[#d8c5ad] bg-[#fffefc] px-4 py-2 text-sm font-medium text-son transition-all hover:border-son hover:bg-[#fff9ef] hover:shadow-xs">
                Sao {STAR_BY_SLUG[slug].name}
              </a>
            </li>
          ))}
        </ul>
        <a href="/sao" className="mt-4 inline-block text-sm font-medium text-son underline">Xem đầy đủ 14 chính tinh →</a>
      </nav>

      <div className="mt-10 rounded-2xl border-2 border-[#b5894c] bg-gradient-to-br from-[#fffdf8] to-[#fbf2df] p-7 text-center shadow-md">
        <p className="font-serif text-xl font-bold text-[#2d2014]">Muốn biết sao {s.name} nằm ở cung nào trong lá số của bạn?</p>
        <p className="mt-2 text-sm text-[#665440]">Nhập ngày giờ sinh để lập ngay lá số Tử Vi hoàn chỉnh và miễn phí.</p>
        <a href="/" className="btn mt-4 inline-flex items-center gap-2 px-8 py-3 text-base shadow-md">
          Lập lá số miễn phí <span aria-hidden="true">↗</span>
        </a>
      </div>
    </main>
  );
}
