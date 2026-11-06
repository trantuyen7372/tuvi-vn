import type { Metadata } from 'next';
import { BOOKS } from '@/lib/classics';
import {publicMetadata} from '@/lib/seo';

export const metadata: Metadata = publicMetadata('/co-thu','Cổ thư Tử Vi Đẩu Số – trích yếu tiếng Việt','Đọc trích yếu Cốt Tuỷ Phú, Tử Vi Đẩu Số Toàn Tập và Toàn Thư bằng tiếng Việt; tìm hiểu nguyên lý xem sao, cung và vận hạn.');

export default function CoThu() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold text-son">Cổ thư Tử Vi Đẩu Số</h1>
      <p className="mt-2 text-[#5a4a36]">Trích yếu những đoạn cốt lõi của ba bộ sách gốc, dịch sang tiếng Việt.</p>
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
