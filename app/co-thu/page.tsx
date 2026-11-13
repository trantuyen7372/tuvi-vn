import type { Metadata } from 'next';
import { BOOKS } from '@/lib/classics';
import {publicMetadata} from '@/lib/seo';

export const metadata: Metadata = publicMetadata('/co-thu','Cổ thư Tử Vi Đẩu Số – trích yếu tiếng Việt','Đọc trích yếu Cốt Tuỷ Phú, Tử Vi Đẩu Số Toàn Tập và Toàn Thư bằng tiếng Việt; tìm hiểu nguyên lý xem sao, cung và vận hạn.');

export default function CoThu() {
  return (
    <main className="editorial-page mx-auto max-w-4xl px-4 py-10">
      <div className="relative mb-8 rounded-2xl border border-[#dcc9af] bg-gradient-to-r from-[#fffdf9] via-[#fcf5e8] to-[#f7eedc] p-7 shadow-sm">
        <p className="site-eyebrow mb-2"><span className="eyebrow-line" /> TỦ SÁCH TỬ VI / NGUỒN THAM KHẢO</p>
        <h1 className="font-serif text-3xl font-bold text-son sm:text-4xl">Cổ thư Tử Vi Đẩu Số</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-[#5a4a36]">Bản trích yếu tiếng Việt của ba bộ cổ thư, có đoạn được diễn giải lại để dễ đọc. Đây là tài liệu về quan niệm truyền thống, không phải bản nguyên văn có khảo chứng.</p>
        <p className="mt-2.5 leading-relaxed text-[#5a4a36]">Xem <a href="/phuong-phap" className="text-son underline font-medium">nguồn và phương pháp biên soạn</a> hoặc bắt đầu với <a href="/huong-dan/cach-doc-la-so-tu-vi" className="text-son underline font-medium">hướng dẫn đọc lá số</a> để hiểu các thuật ngữ trong bản trích yếu.</p>
      </div>
      <div className="mt-6 space-y-4">
        {BOOKS.map((b,index) => (
          <a key={b.slug} href={`/co-thu/${b.slug}`} className="book-card group">
            <span className="book-card-number">{String(index+1).padStart(2,'0')}</span>
            <div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-serif text-2xl font-bold text-son group-hover:text-[#781414] transition-colors">{b.title}</span>
                <span className="text-sm font-medium text-[#8a7a62]">{b.hanTitle} · {b.era} · {b.author}</span>
              </div>
              <p className="mt-1.5 text-sm text-[#5a4a36] leading-relaxed">{b.intro}</p>
            </div>
            <span className="text-son text-lg transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </main>
  );
}
