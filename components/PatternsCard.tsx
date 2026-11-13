'use client';
import {LEVEL_LABEL} from '@/lib/patterns/labels';
import type {PatternView} from '@/lib/patterns';

const LEVEL_STYLE: Record<PatternView['level'], string> = {
  excellent: 'bg-gradient-to-r from-[#9b1c1c] to-[#801414] text-[#fff9ee] border border-[#b83333] shadow-sm',
  good: 'bg-gradient-to-r from-[#1c6f41] to-[#14532f] text-[#f2fbf5] border border-[#238c53] shadow-sm',
  neutral: 'bg-[#f4ebd9] text-[#5c4728] border border-[#d8c5a6]',
  caution: 'bg-[#473c33] text-[#f7f3eb] border border-[#6b5b4f]',
};

export default function PatternsCard({ patterns }: { patterns: PatternView[] }) {
  return (
    <section className="rounded-xl border border-[#d8c5a6] border-t-3 border-t-[#b5894c] bg-gradient-to-b from-[#fffefc] to-[#fbf7ee] p-5 sm:p-6 shadow-[0_10px_28px_rgba(68,44,18,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ebdcc7] pb-3 mb-4">
        <div>
          <p className="site-eyebrow">CHIÊM NGHIỆM ĐẶC THÙ</p>
          <h2 className="font-serif text-2xl font-bold text-son">Cách cục trong lá số</h2>
        </div>
        <span className="text-xs font-medium text-[#7c6952] bg-[#f4ebd9] border border-[#dec9ab] px-2.5 py-1 rounded-full">
          {patterns.length > 0 ? `${patterns.length} cách cục ứng chiếu` : 'Không có cách cục biệt lập'}
        </span>
      </div>
      {patterns.length === 0 ? (
        <p className="mt-2 text-[#5a4a36] leading-relaxed">
          Lá số không rơi vào cách cục đặc biệt nào trong 45 cách cục được kiểm tra. Điều này rất bình thường, phần luận giải sẽ dựa vào từng sao, từng cung phối chiếu.
        </p>
      ) : (
        <div className="grid gap-3.5 md:grid-cols-2">
          {patterns.map((p, i) => (
            <article
              key={i}
              className="flex flex-col justify-between rounded-xl border border-[#e5d8c1] bg-[#fffdfa] p-4 transition-all duration-200 hover:border-[#b59b78] hover:shadow-sm"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-serif text-lg font-bold text-[#2d2218]">{p.name}</h3>
                  <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${LEVEL_STYLE[p.level]}`}>
                    {LEVEL_LABEL[p.level]}
                  </span>
                  <span className="rounded-md bg-[#f5ede0] border border-[#e5d8c1] px-2 py-0.5 text-xs text-[#6e583b]">
                    Cung {p.palaces.join(', ')}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#3d3124]">{p.description}</p>
                {(p.bonus.length > 0 || p.breaking.length > 0) && (
                  <ul className="mt-2.5 flex flex-wrap gap-1.5 text-xs">
                    {p.bonus.map((b) => (
                      <li key={b} className="rounded-md bg-[#edf8f1] border border-[#c3e8ce] px-2 py-0.5 text-[#14532d] font-medium">
                        + {b}
                      </li>
                    ))}
                    {p.breaking.map((b) => (
                      <li key={b} className="rounded-md bg-[#fdf2f2] border border-[#f7c8c8] px-2 py-0.5 text-[#9b1c1c] font-medium">
                        − {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {p.source && (
                <p className="mt-3 border-t border-[#f0e4d2] pt-2 text-[11px] italic text-[#8a755d]">
                  Trích yếu: {p.source}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
