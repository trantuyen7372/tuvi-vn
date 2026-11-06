'use client';
import {LEVEL_LABEL} from '@/lib/patterns/labels';
import type {PatternView} from '@/lib/patterns';

const LEVEL_STYLE: Record<PatternView['level'], string> = {
  excellent: 'bg-son text-white',
  good: 'bg-green-700 text-white',
  neutral: 'bg-[#e8dcc2] text-muc',
  caution: 'bg-gray-700 text-white',
};

export default function PatternsCard({ patterns }: { patterns: PatternView[] }) {
  return (
    <section className="rounded-xl border border-[#d9c7a3] bg-white p-5">
      <h2 className="font-serif text-2xl font-bold text-son">Cách cục trong lá số</h2>
      {patterns.length === 0 ? (
        <p className="mt-2 text-[#5a4a36]">Lá số không rơi vào cách cục đặc biệt nào trong 45 cách cục được kiểm tra. Điều này rất bình thường, phần luận giải sẽ dựa vào từng sao, từng cung.</p>
      ) : (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {patterns.map((p, i) => (
            <article key={i} className="rounded-lg border border-[#eadfc6] p-3">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-serif text-lg font-bold">{p.name}</h3>
                <span className={`rounded px-2 py-0.5 text-xs font-semibold ${LEVEL_STYLE[p.level]}`}>{LEVEL_LABEL[p.level]}</span>
                <span className="text-xs text-[#8a7a62]">Cung {p.palaces.join(', ')}</span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-[#3d3124]">{p.description}</p>
              {(p.bonus.length > 0 || p.breaking.length > 0) && (
                <ul className="mt-1.5 space-y-0.5 text-xs">
                  {p.bonus.map((b) => <li key={b} className="text-green-800">+ {b}</li>)}
                  {p.breaking.map((b) => <li key={b} className="text-son">− {b}</li>)}
                </ul>
              )}
              {p.source && <p className="mt-1.5 text-[11px] italic text-[#8a7a62]">{p.source}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
