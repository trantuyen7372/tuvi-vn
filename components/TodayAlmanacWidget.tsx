'use client';

import { useMemo } from 'react';
import { getAlmanacDay } from '@/lib/almanac';

export default function TodayAlmanacWidget() {
  const today = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return getAlmanacDay(`${y}-${m}-${d}`);
  }, []);

  return (
    <section className="site-container my-10" aria-labelledby="today-almanac-heading">
      <div className="relative overflow-hidden rounded-2xl border border-[#d8c5a6] bg-gradient-to-br from-[#fffefc] via-[#fbf7ed] to-[#f6ecda] p-6 sm:p-8 shadow-sm">
        {/* Background celestial accent */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-radial from-[#d9b45a]/15 to-transparent blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          {/* Left Info Column */}
          <div className="max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#b8860b]" aria-hidden="true">✦</span>
              <p className="site-eyebrow text-xs uppercase tracking-wider text-[#8c6729]">
                HÔM NAY CỦA BẠN · LỊCH VẠN NIÊN
              </p>
            </div>

            <h2 id="today-almanac-heading" className="mt-1 font-serif text-2xl font-bold text-son sm:text-3xl">
              {today.dayOfWeek}, {today.solarDay}/{today.solarMonth}/{today.solarYear}
            </h2>

            <p className="mt-1.5 text-sm font-medium text-[#5c4a35]">
              {today.lunarFullText} · <span className="text-[#8c6729]">Can Chi ngày: <b>{today.canChiDay}</b></span>
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span
                className={`rounded-full px-2.5 py-0.5 font-bold ${
                  today.isHoangDao
                    ? 'border border-emerald-300 bg-emerald-100 text-emerald-900'
                    : 'border border-stone-300 bg-stone-100 text-stone-700'
                }`}
              >
                {today.dayType} · {today.hoangDaoStar}
              </span>

              <span className="rounded-full border border-[#ebdcc7] bg-[#fffdfa] px-2.5 py-0.5 font-semibold text-[#63503b]">
                Trực {today.truc.name} ({today.truc.rating === 'cat' ? 'Cát nhật' : 'Bình hòa'})
              </span>

              <span className="rounded-full border border-[#ebdcc7] bg-[#fffdfa] px-2.5 py-0.5 font-semibold text-[#63503b]">
                {today.elementNapAm}
              </span>
            </div>

            {/* Auspicious Hours Strip */}
            <div className="mt-4">
              <span className="text-xs font-bold text-[#63503b]">Giờ Hoàng Đạo trong ngày:</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {today.gioHoangDao.map((h) => (
                  <span
                    key={h.branch}
                    className="rounded-md border border-[#e5d6be] bg-[#fffefa] px-2 py-0.5 text-xs text-[#523f2c]"
                  >
                    <b className="text-son">{h.branch}</b> <span className="text-[11px] text-[#8a765e]">({h.timeRange})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Action Column */}
          <div className="flex flex-col items-start gap-3 md:items-end md:self-center">
            <a
              href="/xem-ngay"
              className="inline-flex items-center gap-2 rounded-xl border border-son/30 bg-gradient-to-r from-son to-[#781313] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-son hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>Xem Lịch Vạn Niên & Chọn Ngày</span>
              <span aria-hidden="true">→</span>
            </a>
            <span className="text-xs text-[#8a7762]">
              Xem ngày tốt cưới hỏi, khai trương, xuất hành...
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
