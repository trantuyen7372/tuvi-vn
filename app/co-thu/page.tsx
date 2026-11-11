import type { Metadata } from 'next';
import { BOOKS } from '@/lib/classics';
import {publicMetadata} from '@/lib/seo';

export const metadata: Metadata = publicMetadata('/co-thu','Cổ thư Tử Vi Đẩu Số – trích yếu tiếng Việt','Đọc trích yếu Cốt Tuỷ Phú, Tử Vi Đẩu Số Toàn Tập và Toàn Thư bằng tiếng Việt; tìm hiểu nguyên lý xem sao, cung và vận hạn.');

export default function CoThu() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold text-son">Cổ thư Tử Vi Đẩu Số</h1>
      <p className="mt-2 leading-relaxed text-[#5a4a36]">Bản trích yếu tiếng Việt của ba bộ cổ thư, có đoạn được diễn giải lại để dễ đọc. Đây là tài liệu về quan niệm truyền thống, không phải bản nguyên văn có khảo chứng.</p>
      <p className="mt-3 leading-relaxed text-[#5a4a36]">Xem <a href="/phuong-phap" className="text-son underline">nguồn và phương pháp biên soạn</a> hoặc bắt đầu với <a href="/huong-dan/cach-doc-la-so-tu-vi" className="text-son underline">hướng dẫn đọc lá số</a> để hiểu các thuật ngữ trong bản trích yếu.</p>
      <div className="mt-6 space-y-3">
        {BOOKS.map((b) => (
          <a key={b.slug} href={`/co-thu/${b.slug}`} className="block rounded-xl border border-[#d9c7a3] bg-white p-5 hover:border-son">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-serif text-2xl font-bold text-son">{b.title}</span>
              <span className="text-[#8a7a62]">{b.hanTitle} · {b.era} · {b.author}</span>
            </div>
            <p className="mt-1 text-sm text-[#5a4a36]">{b.intro}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
