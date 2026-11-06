import type { Metadata } from 'next';
import { STARS } from '@/lib/stars';
import {publicMetadata} from '@/lib/seo';

export const metadata: Metadata = publicMetadata('/sao','14 chính tinh trong Tử Vi – ý nghĩa từng sao','Tìm hiểu 14 chính tinh, tính chất và cách đọc sao trong các cung. Đối chiếu ý nghĩa truyền thống với chính tinh và phụ tinh trên lá số của bạn.');

export default function SaoIndex() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold text-son">14 chính tinh trong Tử Vi</h1>
      <p className="mt-2 text-[#5a4a36]">Bấm vào từng sao để xem tính chất, cung hợp, sự nghiệp, tình duyên, tài lộc và sức khoẻ.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STARS.map((s) => (
          <a key={s.slug} href={`/sao/${s.slug}`} className="rounded-xl border border-[#d9c7a3] bg-white p-4 hover:border-son">
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-xl font-bold text-son">{s.name}</span>
              <span className="text-xs text-[#8a7a62]">{s.element}</span>
            </div>
            <div className="mt-1 text-sm text-[#6b5b45]">{s.keywords.join(' · ')}</div>
          </a>
        ))}
      </div>
    </main>
  );
}
