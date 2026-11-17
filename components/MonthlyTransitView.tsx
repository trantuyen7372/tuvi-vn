'use client';

import { useState } from 'react';
import type { ChartView } from '@/lib/tuvi';
import { calculateMonthlyTransits, type MonthlyTransit, type MonthlyRating } from '@/lib/monthly-transit';

interface MonthlyTransitViewProps {
  chart: ChartView;
}

const RATING_STYLE: Record<MonthlyRating, { badge: string; border: string; bg: string; text: string }> = {
  'Đại Cát': { badge: 'bg-amber-100 text-amber-900 border-amber-300', border: 'border-amber-300', bg: 'bg-[#fffdf5]', text: 'text-amber-800' },
  'Cát Lợi': { badge: 'bg-emerald-100 text-emerald-900 border-emerald-300', border: 'border-emerald-300', bg: 'bg-[#f7fbf8]', text: 'text-emerald-800' },
  'Bình Hòa': { badge: 'bg-stone-100 text-stone-800 border-stone-300', border: 'border-stone-200', bg: 'bg-[#fffefc]', text: 'text-[#665744]' },
  'Cẩn Trọng': { badge: 'bg-rose-100 text-rose-900 border-rose-300', border: 'border-rose-300', bg: 'bg-[#fff8f8]', text: 'text-rose-800' },
};

export default function MonthlyTransitView({ chart }: MonthlyTransitViewProps) {
  const transits = calculateMonthlyTransits(chart);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'interactive' | 'all'>('interactive');

  const current = transits.find((t) => t.month === selectedMonth) || transits[0];

  const greatMonths = transits.filter((t) => t.rating === 'Đại Cát' || t.rating === 'Cát Lợi');
  const cautionMonths = transits.filter((t) => t.rating === 'Cẩn Trọng');

  return (
    <section className="monthly-transit-card mt-8 rounded-2xl border border-[#d8c5a6] bg-[#fffdf9] p-5 sm:p-7 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ebdcc7] pb-4">
        <div>
          <p className="site-eyebrow">
            <span className="eyebrow-line" /> LƯU NGUYỆT CHI TIẾT
          </p>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-son">
            Vận hạn 12 tháng âm lịch năm {chart.year}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-[#e5d8c3] bg-[#faf4ea] p-1 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('interactive')}
            className={`rounded px-3 py-1.5 font-medium transition-colors ${
              viewMode === 'interactive' ? 'bg-[#991b1b] text-white shadow-sm' : 'text-[#705c47] hover:text-son'
            }`}
          >
            Từng tháng
          </button>
          <button
            type="button"
            onClick={() => setViewMode('all')}
            className={`rounded px-3 py-1.5 font-medium transition-colors ${
              viewMode === 'all' ? 'bg-[#991b1b] text-white shadow-sm' : 'text-[#705c47] hover:text-son'
            }`}
          >
            Xem cả năm
          </button>
        </div>
      </div>

      {/* Year Highlights Quick Summary */}
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs">
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold">
            ✓
          </span>
          <p className="text-emerald-900 leading-relaxed">
            <b>Tháng đắc tài, vượng khí:</b>{' '}
            {greatMonths.length > 0
              ? greatMonths.map((m) => m.monthLabel).join(', ')
              : 'Năng lượng bình ổn đều đặn qua các tháng.'}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/70 p-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white font-bold">
            !
          </span>
          <p className="text-rose-900 leading-relaxed">
            <b>Tháng cần phòng hao hụt, thị phi:</b>{' '}
            {cautionMonths.length > 0
              ? cautionMonths.map((m) => m.monthLabel).join(', ')
              : 'Năm nay không có tháng nào bị sát tinh hội tụ nặng.'}
          </p>
        </div>
      </div>

      {viewMode === 'interactive' ? (
        <div className="mt-6">
          {/* Month selector chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {transits.map((t) => {
              const isSelected = t.month === selectedMonth;
              const isGreat = t.rating === 'Đại Cát' || t.rating === 'Cát Lợi';
              const isCaution = t.rating === 'Cẩn Trọng';

              return (
                <button
                  key={t.month}
                  type="button"
                  onClick={() => setSelectedMonth(t.month)}
                  className={`flex shrink-0 flex-col items-center rounded-xl border px-3 py-2 text-xs transition-all ${
                    isSelected
                      ? 'border-son bg-son text-white shadow-md scale-105'
                      : 'border-[#e0d0b8] bg-[#fffefc] text-[#554532] hover:border-son/60 hover:bg-[#faf4ea]'
                  }`}
                >
                  <span className="font-bold">{t.monthLabel}</span>
                  <span
                    className={`mt-1 text-[10px] ${
                      isSelected
                        ? 'text-white/90'
                        : isGreat
                        ? 'text-emerald-700 font-semibold'
                        : isCaution
                        ? 'text-rose-700 font-semibold'
                        : 'text-[#88745c]'
                    }`}
                  >
                    {t.rating}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Month Detail Card */}
          <div
            className={`mt-5 rounded-2xl border ${RATING_STYLE[current.rating].border} ${RATING_STYLE[current.rating].bg} p-5 sm:p-6 shadow-sm`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eadbc5] pb-3">
              <div>
                <span
                  className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                    RATING_STYLE[current.rating].badge
                  }`}
                >
                  ✦ Vận Khí {current.rating.toUpperCase()}
                </span>
                <h4 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-son">
                  {current.lunarName} · {current.palaceName}
                </h4>
              </div>

              <div className="rounded-xl border border-[#e2d2ba] bg-[#fffefa] px-3.5 py-1.5 text-xs text-[#6e5840]">
                Trọng tâm: <b className="text-son">{current.focusArea}</b>
              </div>
            </div>

            {/* Stars influencing this month */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#806950] font-semibold">Sao chiếu cung:</span>
              {current.majorStars.length > 0 ? (
                current.majorStars.map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-[#dfcbb1] bg-[#fffcf6] px-2 py-0.5 font-bold text-son"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="italic text-[#907b64]">Vô chính diệu</span>
              )}

              {current.auspiciousStars.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-800"
                >
                  {s}
                </span>
              ))}

              {current.warningStars.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-rose-800"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Summary & Advice */}
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#50402f]">
              <p>
                <b>Nhận định tháng:</b> {current.summary}
              </p>
              <div className="rounded-xl border border-[#e5d4bb] bg-[#fffdf9] p-3 text-xs leading-relaxed">
                <span className="font-bold text-son">✦ Lời khuyên hành động:</span>{' '}
                <span className="text-[#453625]">{current.actionAdvice}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Full Year List View */
        <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {transits.map((t) => (
            <div
              key={t.month}
              className={`rounded-xl border ${RATING_STYLE[t.rating].border} ${RATING_STYLE[t.rating].bg} p-4 text-xs shadow-sm`}
            >
              <div className="flex items-center justify-between border-b border-[#ebdcc7] pb-2">
                <span className="font-serif font-bold text-son text-sm">{t.lunarName}</span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${RATING_STYLE[t.rating].badge}`}>
                  {t.rating}
                </span>
              </div>
              <p className="mt-1.5 text-[#735e45]">
                Cung cai quản: <b>{t.palaceName}</b>
              </p>
              <p className="mt-1 text-[#50402f] leading-relaxed line-clamp-3">
                {t.summary}
              </p>
              <div className="mt-2.5 border-t border-[#f0e2cf] pt-2 text-[11px] text-[#4a3a28]">
                <b>Lời khuyên:</b> {t.actionAdvice}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-5 border-t border-[#ebdcc7] pt-3 text-right text-[11px] text-[#857058]">
        Lưu nguyệt vận hành theo vòng tuần hoàn địa bàn âm lịch năm {chart.year} · Đối chiếu cùng đại hạn & cung vị để đắc thời.
      </p>
    </section>
  );
}
