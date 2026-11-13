import type { Metadata } from 'next';
import { STARS } from '@/lib/stars';
import {publicMetadata} from '@/lib/seo';

export const metadata: Metadata = publicMetadata('/sao','14 chính tinh trong Tử Vi – ý nghĩa từng sao','Tìm hiểu 14 chính tinh, tính chất và cách đọc sao trong các cung. Đối chiếu ý nghĩa truyền thống với chính tinh và phụ tinh trên lá số của bạn.');

const ELEMENT_BADGE: Record<string, string> = {
  'Thổ': 'bg-[#fbf3e5] text-[#7a5522] border-[#e2d0b5]',
  'Mộc': 'bg-[#edf8f1] text-[#166534] border-[#c3e8ce]',
  'Hoả': 'bg-[#fdf2f2] text-[#991b1b] border-[#f8c8c8]',
  'Kim': 'bg-[#fef9ec] text-[#854d0e] border-[#f5dc9e]',
  'Thuỷ': 'bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]',
};

const ELEMENT_BORDER: Record<string, string> = {
  'Thổ': 'border-t-[#b5894c]',
  'Mộc': 'border-t-[#166534]',
  'Hoả': 'border-t-[#991b1b]',
  'Kim': 'border-t-[#ca8a04]',
  'Thuỷ': 'border-t-[#2563eb]',
};

export default function SaoIndex() {
  return (
    <main className="editorial-page mx-auto max-w-5xl px-4 py-10">
      <div className="relative mb-8 rounded-2xl border border-[#dcc9af] bg-gradient-to-r from-[#fffdf9] via-[#fcf5e8] to-[#f7eedc] p-7 shadow-sm">
        <p className="site-eyebrow mb-2"><span className="eyebrow-line" /> TỦ SÁCH TỬ VI / TRA CỨU</p>
        <h1 className="font-serif text-3xl font-bold text-son sm:text-4xl">14 chính tinh trong Tử Vi</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-[#5a4a36]">Bấm vào từng sao để xem ý nghĩa truyền thống, ví dụ cách đọc và bản trích yếu cổ thư liên quan. Một sao cần được đọc cùng cung và toàn bộ bố cục, không quyết định tính cách hay sự kiện của một người.</p>
        <p className="mt-2.5 leading-relaxed text-[#5a4a36]">Nếu mới bắt đầu, hãy đọc <a href="/huong-dan/chinh-tinh-va-phu-tinh" className="text-son underline font-medium">chính tinh và phụ tinh là gì</a> và <a href="/huong-dan/y-nghia-12-cung" className="text-son underline font-medium">ý nghĩa 12 cung</a> trước khi tra từng sao.</p>
      </div>
      
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STARS.map((s, index) => (
          <a
            key={s.slug}
            href={`/sao/${s.slug}`}
            className={`group flex flex-col justify-between rounded-xl border border-[#e0d3bf] border-t-3 ${ELEMENT_BORDER[s.element] || 'border-t-son'} bg-gradient-to-b from-[#fffefc] to-[#fbf6ec] p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#b5894c] hover:shadow-md`}
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#ebdcc7] pb-2.5 mb-3.5">
                <span className="text-[10px] font-bold tracking-widest text-[#947854] uppercase">
                  CHÍNH TINH · {String(index + 1).padStart(2, '0')}
                </span>
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${ELEMENT_BADGE[s.element] || 'bg-amber-50 text-amber-900 border-amber-200'}`}>
                  ✦ Hành {s.element}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-serif text-2xl font-bold text-son group-hover:text-[#781414] transition-colors">
                  {s.name}
                </span>
                <span className="text-xs text-[#7c6952] italic">{s.nature}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.keywords.map((kw) => (
                  <span key={kw} className="rounded-md bg-[#f4ebd9] border border-[#e4d5be] px-2 py-0.5 text-xs text-[#5e4b35] font-medium">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#ebdcc7] flex items-center justify-between text-xs font-semibold text-son">
              <span>Khám phá ý nghĩa</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
