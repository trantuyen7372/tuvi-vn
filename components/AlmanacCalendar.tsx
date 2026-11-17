'use client';

import { useState, useMemo } from 'react';
import { getAlmanacDay, getAlmanacMonth, type AlmanacDay } from '@/lib/almanac';

const ACTIVITIES = [
  { id: 'all', label: 'Tất cả ngày' },
  { id: 'khaiTruong', label: 'Khai trương & Mở hàng' },
  { id: 'cuoiHoi', label: 'Cưới hỏi & Hôn nhân' },
  { id: 'xuatHanh', label: 'Xuất hành & Đi xa' },
  { id: 'dongTho', label: 'Động thổ & Làm nhà' },
  { id: 'nhapTrach', label: 'Nhập trạch & Về nhà mới' },
  { id: 'giaoDich', label: 'Ký kết & Giao dịch' },
  { id: 'cauTai', label: 'Cầu tài & Mở kho' },
] as const;

type ActivityId = typeof ACTIVITIES[number]['id'];

const WEEKDAY_HEADERS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export default function AlmanacCalendar({ initialDate }: { initialDate?: string }) {
  const todayStr = useMemo(() => {
    if (initialDate) return initialDate;
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [initialDate]);

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const [currentYear, setCurrentYear] = useState<number>(() => {
    return Number(selectedDate.split('-')[0]) || 2026;
  });

  const [currentMonth, setCurrentMonth] = useState<number>(() => {
    return Number(selectedDate.split('-')[1]) || 11;
  });

  const [filter, setFilter] = useState<ActivityId>('all');

  const monthDays = useMemo(() => {
    return getAlmanacMonth(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const selectedDayData: AlmanacDay = useMemo(() => {
    return getAlmanacDay(selectedDate);
  }, [selectedDate]);

  // First day of month padding (Monday start)
  const paddingDays = useMemo(() => {
    const firstDay = new Date(Date.UTC(currentYear, currentMonth - 1, 1, 12, 0, 0));
    const dayOfWeek = firstDay.getUTCDay(); // 0 is Sunday
    // If Sunday (0), return 6 padding days; if Monday (1), return 0; if Tuesday (2), return 1, etc.
    return (dayOfWeek + 6) % 7;
  }, [currentYear, currentMonth]);

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const jumpToToday = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = String(now.getDate()).padStart(2, '0');
    setCurrentYear(y);
    setCurrentMonth(m);
    setSelectedDate(`${y}-${String(m).padStart(2, '0')}-${d}`);
  };

  return (
    <div className="almanac-container space-y-6">
      {/* Activity Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5d8c3] pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8c6729]">Mục đích chọn ngày:</span>
          <div className="mt-2 flex flex-wrap gap-1.5" role="tablist" aria-label="Lọc theo mục đích công việc">
            {ACTIVITIES.map((act) => {
              const active = filter === act.id;
              return (
                <button
                  key={act.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(act.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? 'bg-son text-white shadow-sm'
                      : 'border border-[#dccbb4] bg-[#fffdfa] text-[#5c4a35] hover:border-[#b5894c] hover:bg-[#faf4e8]'
                  }`}
                >
                  {act.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={jumpToToday}
          className="rounded-lg border border-[#cfbfa8] bg-[#fbf5e9] px-3 py-1.5 text-xs font-bold text-son transition-colors hover:border-son hover:bg-[#faeed9]"
        >
          Hôm nay
        </button>
      </div>

      {/* Main Split Layout: Calendar (Left) & Day Detail (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Calendar Grid Section */}
        <section className="rounded-2xl border border-[#d8c5a6] bg-[#fffefc] p-4 sm:p-6 shadow-sm lg:col-span-7" aria-label="Lịch vạn niên theo tháng">
          {/* Month Header Controller */}
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              aria-label="Tháng trước"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d9c7a3] bg-[#fffdf9] text-sm font-bold text-[#63503b] hover:bg-[#f5ebd8] hover:text-son transition-colors"
            >
              ‹
            </button>

            <div className="text-center">
              <h2 className="font-serif text-xl font-bold text-[#2e2318] sm:text-2xl">
                Tháng {currentMonth}, {currentYear}
              </h2>
              <p className="text-xs text-[#8a7a62]">
                Lịch vạn niên Âm Dương · Tử Vi Đẩu Số
              </p>
            </div>

            <button
              type="button"
              onClick={nextMonth}
              aria-label="Tháng sau"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d9c7a3] bg-[#fffdf9] text-sm font-bold text-[#63503b] hover:bg-[#f5ebd8] hover:text-son transition-colors"
            >
              ›
            </button>
          </div>

          {/* Weekday Names Header */}
          <div className="grid grid-cols-7 gap-1 border-b border-[#ebdcc7] pb-2 text-center text-xs font-semibold text-[#8c6729]">
            {WEEKDAY_HEADERS.map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Day Cells Grid */}
          <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-1.5" role="grid" aria-label={`Lịch tháng ${currentMonth} năm ${currentYear}`}>
            {/* Blank padding cells */}
            {Array.from({ length: paddingDays }).map((_, i) => (
              <div key={`pad-${i}`} className="h-14 sm:h-16 rounded-lg opacity-20" aria-hidden="true" />
            ))}

            {/* Actual day cells */}
            {monthDays.map((d) => {
              const isSelected = d.solarDate === selectedDate;
              const isToday = d.solarDate === todayStr;

              // Filter match
              let isMatch = true;
              if (filter !== 'all') {
                isMatch = Boolean(d.suitableFor[filter as keyof typeof d.suitableFor]);
              }

              return (
                <button
                  key={d.solarDate}
                  type="button"
                  onClick={() => setSelectedDate(d.solarDate)}
                  className={`relative flex h-14 sm:h-16 flex-col items-center justify-between rounded-lg p-1 transition-all ${
                    isSelected
                      ? 'border-2 border-son bg-[#fff9ed] shadow-md ring-1 ring-son/30'
                      : 'border border-[#eddcc7] bg-[#fffefb] hover:border-[#b5894c] hover:bg-[#faf4e8]'
                  } ${!isMatch && filter !== 'all' ? 'opacity-40 grayscale-[40%]' : ''}`}
                >
                  {/* Top: Solar day number */}
                  <span
                    className={`text-sm sm:text-base font-bold leading-none ${
                      isSelected ? 'text-son' : isToday ? 'text-[#b8860b]' : 'text-[#35271a]'
                    }`}
                  >
                    {d.solarDay}
                  </span>

                  {/* Middle: Lunar date */}
                  <span className="text-[10px] sm:text-[11px] font-medium text-[#7d6952] leading-none">
                    {d.lunarDay === 1 ? `${d.lunarDay}/${d.lunarMonth}` : d.lunarDay}
                  </span>

                  {/* Bottom indicator dot / badge */}
                  <div className="flex items-center gap-1">
                    {d.isHoangDao ? (
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-emerald-600"
                        title={`Ngày Hoàng Đạo (${d.hoangDaoStar})`}
                      />
                    ) : (
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-stone-300"
                        title="Ngày Hắc Đạo"
                      />
                    )}
                    {isMatch && filter !== 'all' && (
                      <span className="h-1.5 w-1.5 rounded-full bg-son" title="Hợp việc đã chọn" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend Footer */}
          <div className="mt-4 flex flex-wrap items-center justify-between border-t border-[#ebdcc7] pt-3 text-[11px] text-[#78644f]">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600" /> Ngày Hoàng Đạo (Cát)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-stone-300" /> Ngày Hắc Đạo
              </span>
              {filter !== 'all' && (
                <span className="inline-flex items-center gap-1.5 text-son font-medium">
                  <span className="h-2 w-2 rounded-full bg-son" /> Rất hợp việc đã chọn
                </span>
              )}
            </div>
            <span className="italic text-[#998770]">Số nhỏ bên dưới là ngày Âm lịch</span>
          </div>
        </section>

        {/* Selected Day Detail Panel */}
        <aside className="rounded-2xl border border-[#d8c5a6] bg-gradient-to-b from-[#fffefc] to-[#fbf6ec] p-5 sm:p-6 shadow-sm lg:col-span-5" aria-label="Chi tiết ngày đã chọn">
          <div className="border-b border-[#eadbc3] pb-4">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-serif text-2xl font-bold text-son">
                {selectedDayData.dayOfWeek}, {selectedDayData.solarDay}/{selectedDayData.solarMonth}/{selectedDayData.solarYear}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  selectedDayData.isHoangDao
                    ? 'border border-emerald-300 bg-emerald-100 text-emerald-900'
                    : 'border border-stone-300 bg-stone-100 text-stone-700'
                }`}
              >
                {selectedDayData.dayType} · {selectedDayData.hoangDaoStar}
              </span>
            </div>

            <p className="mt-1 text-sm font-medium text-[#6e583f]">
              {selectedDayData.lunarFullText}
            </p>
            <p className="mt-0.5 text-xs text-[#8c6729]">
              Can Chi ngày: <b>{selectedDayData.canChiDay}</b> · Tháng: <b>{selectedDayData.canChiMonth}</b> · Năm: <b>{selectedDayData.canChiYear}</b>
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-[#ebdcc7] bg-[#fffdfa] p-3">
              <span className="block text-[11px] font-semibold text-[#8a7a62]">THẬP NHỊ TRỰC</span>
              <span className="font-serif text-base font-bold text-son">Trực {selectedDayData.truc.name}</span>
              <p className="mt-0.5 text-[11px] text-[#5c4a35] leading-relaxed">{selectedDayData.truc.meaning}</p>
            </div>

            <div className="rounded-xl border border-[#ebdcc7] bg-[#fffdfa] p-3">
              <span className="block text-[11px] font-semibold text-[#8a7a62]">NGŨ HÀNH NẠP ÂM</span>
              <span className="font-serif text-base font-bold text-[#2e2318]">{selectedDayData.elementNapAm}</span>
              <p className="mt-0.5 text-[11px] text-[#5c4a35] leading-relaxed">Hành {selectedDayData.element} cát vượng</p>
            </div>
          </div>

          {/* 28 Mansions Info */}
          <div className="mt-3 rounded-xl border border-[#ebdcc7] bg-[#fffdfa] p-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#8a7a62]">NHỊ THẬP BÁT TÚ</span>
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${selectedDayData.sao28.isGood ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'}`}>
                {selectedDayData.sao28.isGood ? 'Cát tinh' : 'Bình thường / Thận trọng'}
              </span>
            </div>
            <p className="mt-1 text-sm font-bold text-[#352516]">
              {selectedDayData.sao28.animal} (Hành {selectedDayData.sao28.element})
            </p>
            <p className="mt-0.5 text-[11px] text-[#5e4b36] leading-relaxed">
              {selectedDayData.sao28.meaning}
            </p>
          </div>

          {/* Giờ Hoàng Đạo Section */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-sm font-bold text-[#382b1d]">
                Giờ Hoàng Đạo trong ngày ({selectedDayData.gioHoangDao.length} khung giờ):
              </h3>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {selectedDayData.gioHoangDao.map((h) => (
                <div
                  key={h.branch}
                  className="flex items-center justify-between rounded-lg border border-[#e8dcc8] bg-[#fffefa] px-2.5 py-1.5 text-xs"
                >
                  <div>
                    <b className="text-son">{h.branch}</b>{' '}
                    <span className="text-[11px] text-[#7a6750]">({h.timeRange})</span>
                  </div>
                  <span className="text-[10px] font-medium text-[#8c6729]">{h.star}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Good & Bad Activities */}
          <div className="mt-4 space-y-3">
            <div>
              <span className="text-xs font-bold text-emerald-800 block mb-1">
                ✓ Việc thuận lợi, cát lành nên làm:
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedDayData.goodActivities.map((act) => (
                  <span
                    key={act}
                    className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-900"
                  >
                    {act}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-rose-800 block mb-1">
                ✕ Việc nên hạn chế hoặc cẩn trọng:
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedDayData.badActivities.map((act) => (
                  <span
                    key={act}
                    className="rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-900"
                  >
                    {act}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Conflicting Ages */}
          <div className="mt-4 border-t border-[#eadbc3] pt-3 text-xs">
            <span className="text-[#8a7a62]">Tuổi xung khắc trong ngày:</span>{' '}
            <span className="font-semibold text-[#54422e]">
              {selectedDayData.tuoiXung.join(', ')}
            </span>
          </div>

          {/* CTA Link to Lá Số */}
          <div className="mt-5 border-t border-[#eadbc3] pt-4">
            <a
              href={`/#lap-la-so`}
              className="block w-full rounded-xl border border-[#d9c7a3] bg-gradient-to-r from-[#fffdfa] to-[#fbf4e6] p-3 text-center text-xs font-bold text-son shadow-sm transition-all hover:border-[#b5894c] hover:bg-[#faeed9]"
            >
              Lập lá số Tử Vi trọn đời cho bản thân →
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
