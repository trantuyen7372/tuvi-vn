'use client';

import { useState } from 'react';
import {
  analyzeCompatibility,
  type CompatibilityResult,
  type Gender,
  type Purpose,
  type PersonInput,
} from '@/lib/compatibility';
import ShareWidget from './ShareWidget';

const DEFAULT_P1: PersonInput = {
  name: 'Nguyễn Văn Nam',
  gender: 'nam',
  year: 1995,
  month: 8,
  day: 15,
  hour: 'Tý (23h-01h)',
};

const DEFAULT_P2: PersonInput = {
  name: 'Trần Thị Mai',
  gender: 'nu',
  year: 1998,
  month: 5,
  day: 20,
  hour: 'Mão (05h-07h)',
};

const HOURS = [
  'Tý (23h–01h)',
  'Sửu (01h–03h)',
  'Dần (03h–05h)',
  'Mão (05h–07h)',
  'Thìn (07h–09h)',
  'Tỵ (09h–11h)',
  'Ngọ (11h–13h)',
  'Mùi (13h–15h)',
  'Thân (15h–17h)',
  'Dậu (17h–19h)',
  'Tuất (19h–21h)',
  'Hợi (21h–23h)',
];

const TIER_COLORS = {
  'Đại Cát': { badge: 'bg-amber-100 text-amber-900 border-amber-300', ring: 'border-amber-500 text-amber-800' },
  'Cát Lợi': { badge: 'bg-emerald-100 text-emerald-900 border-emerald-300', ring: 'border-emerald-600 text-emerald-800' },
  'Bình Hòa': { badge: 'bg-stone-100 text-stone-800 border-stone-300', ring: 'border-stone-400 text-stone-800' },
  'Thách Thức': { badge: 'bg-rose-100 text-rose-900 border-rose-300', ring: 'border-rose-500 text-rose-800' },
};

export default function CompatibilityView() {
  const [purpose, setPurpose] = useState<Purpose>('hon-nhan');
  const [p1, setP1] = useState<PersonInput>(DEFAULT_P1);
  const [p2, setP2] = useState<PersonInput>(DEFAULT_P2);
  const [result, setResult] = useState<CompatibilityResult | null>(() =>
    analyzeCompatibility(DEFAULT_P1, DEFAULT_P2, 'hon-nhan')
  );

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    const res = analyzeCompatibility(p1, p2, purpose);
    setResult(res);
  };

  return (
    <div className="compatibility-container space-y-8">
      {/* Input Form Section */}
      <section className="rounded-2xl border border-[#d8c5a6] bg-[#fffdfa] p-6 sm:p-8 shadow-sm" aria-labelledby="form-heading">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ebdcc7] pb-4">
          <div>
            <p className="site-eyebrow">
              <span className="eyebrow-line" /> ĐỐI CHIẾU LÁ SỐ & BẢN MỆNH
            </p>
            <h2 id="form-heading" className="font-serif text-2xl sm:text-3xl font-bold text-son">
              Nhập thông tin hai người
            </h2>
          </div>

          {/* Purpose Tabs */}
          <div className="flex rounded-xl border border-[#d8c5a6] bg-[#fbf5eb] p-1 text-xs">
            <button
              type="button"
              onClick={() => {
                setPurpose('hon-nhan');
                if (result) setResult(analyzeCompatibility(p1, p2, 'hon-nhan'));
              }}
              className={`rounded-lg px-4 py-2 font-bold transition-all ${
                purpose === 'hon-nhan' ? 'bg-[#991b1b] text-white shadow-sm' : 'text-[#6e5842] hover:text-son'
              }`}
            >
              💍 Hôn nhân & Tình duyên
            </button>
            <button
              type="button"
              onClick={() => {
                setPurpose('lam-an');
                if (result) setResult(analyzeCompatibility(p1, p2, 'lam-an'));
              }}
              className={`rounded-lg px-4 py-2 font-bold transition-all ${
                purpose === 'lam-an' ? 'bg-[#991b1b] text-white shadow-sm' : 'text-[#6e5842] hover:text-son'
              }`}
            >
              💼 Làm ăn & Hợp tác
            </button>
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Person 1 */}
            <div className="rounded-xl border border-[#e5d5be] bg-[#fffcf7] p-5">
              <div className="flex items-center justify-between border-b border-[#ebdcc7] pb-2.5">
                <h3 className="font-serif text-base font-bold text-son">✦ Người thứ nhất</h3>
                <span className="text-xs text-[#8c7456]">
                  {p1.gender === 'nam' ? 'Nam mệnh' : 'Nữ mệnh'}
                </span>
              </div>

              <div className="mt-4 space-y-3.5 text-xs">
                <div>
                  <label htmlFor="p1-name" className="block font-semibold text-[#544331]">
                    Họ và tên
                  </label>
                  <input
                    id="p1-name"
                    type="text"
                    value={p1.name}
                    onChange={(e) => setP1({ ...p1, name: e.target.value })}
                    className="input mt-1 w-full text-xs"
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="p1-gender" className="block font-semibold text-[#544331]">
                      Giới tính
                    </label>
                    <select
                      id="p1-gender"
                      value={p1.gender}
                      onChange={(e) => setP1({ ...p1, gender: e.target.value as Gender })}
                      className="input mt-1 w-full text-xs"
                    >
                      <option value="nam">Nam</option>
                      <option value="nu">Nữ</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="p1-year" className="block font-semibold text-[#544331]">
                      Năm sinh (Dương lịch)
                    </label>
                    <input
                      id="p1-year"
                      type="number"
                      min={1920}
                      max={2030}
                      value={p1.year}
                      onChange={(e) => setP1({ ...p1, year: Number(e.target.value) })}
                      className="input mt-1 w-full text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="p1-month" className="block font-semibold text-[#544331]">
                      Tháng sinh (Dương)
                    </label>
                    <select
                      id="p1-month"
                      value={p1.month}
                      onChange={(e) => setP1({ ...p1, month: Number(e.target.value) })}
                      className="input mt-1 w-full text-xs"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m}>Tháng {m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="p1-day" className="block font-semibold text-[#544331]">
                      Ngày sinh (Dương)
                    </label>
                    <select
                      id="p1-day"
                      value={p1.day}
                      onChange={(e) => setP1({ ...p1, day: Number(e.target.value) })}
                      className="input mt-1 w-full text-xs"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>Ngày {d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="p1-hour" className="block font-semibold text-[#544331]">
                    Giờ sinh
                  </label>
                  <select
                    id="p1-hour"
                    value={p1.hour}
                    onChange={(e) => setP1({ ...p1, hour: e.target.value })}
                    className="input mt-1 w-full text-xs"
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Person 2 */}
            <div className="rounded-xl border border-[#e5d5be] bg-[#fffcf7] p-5">
              <div className="flex items-center justify-between border-b border-[#ebdcc7] pb-2.5">
                <h3 className="font-serif text-base font-bold text-son">✦ Người thứ hai</h3>
                <span className="text-xs text-[#8c7456]">
                  {p2.gender === 'nam' ? 'Nam mệnh' : 'Nữ mệnh'}
                </span>
              </div>

              <div className="mt-4 space-y-3.5 text-xs">
                <div>
                  <label htmlFor="p2-name" className="block font-semibold text-[#544331]">
                    Họ và tên
                  </label>
                  <input
                    id="p2-name"
                    type="text"
                    value={p2.name}
                    onChange={(e) => setP2({ ...p2, name: e.target.value })}
                    className="input mt-1 w-full text-xs"
                    placeholder="Trần Thị B"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="p2-gender" className="block font-semibold text-[#544331]">
                      Giới tính
                    </label>
                    <select
                      id="p2-gender"
                      value={p2.gender}
                      onChange={(e) => setP2({ ...p2, gender: e.target.value as Gender })}
                      className="input mt-1 w-full text-xs"
                    >
                      <option value="nu">Nữ</option>
                      <option value="nam">Nam</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="p2-year" className="block font-semibold text-[#544331]">
                      Năm sinh (Dương lịch)
                    </label>
                    <input
                      id="p2-year"
                      type="number"
                      min={1920}
                      max={2030}
                      value={p2.year}
                      onChange={(e) => setP2({ ...p2, year: Number(e.target.value) })}
                      className="input mt-1 w-full text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="p2-month" className="block font-semibold text-[#544331]">
                      Tháng sinh (Dương)
                    </label>
                    <select
                      id="p2-month"
                      value={p2.month}
                      onChange={(e) => setP2({ ...p2, month: Number(e.target.value) })}
                      className="input mt-1 w-full text-xs"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m}>Tháng {m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="p2-day" className="block font-semibold text-[#544331]">
                      Ngày sinh (Dương)
                    </label>
                    <select
                      id="p2-day"
                      value={p2.day}
                      onChange={(e) => setP2({ ...p2, day: Number(e.target.value) })}
                      className="input mt-1 w-full text-xs"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>Ngày {d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="p2-hour" className="block font-semibold text-[#544331]">
                    Giờ sinh
                  </label>
                  <select
                    id="p2-hour"
                    value={p2.hour}
                    onChange={(e) => setP2({ ...p2, hour: e.target.value })}
                    className="input mt-1 w-full text-xs"
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-[#ebdcc7] pt-5">
            <button
              type="submit"
              className="btn px-8 py-3.5 text-sm font-bold shadow-md hover:scale-[1.01]"
            >
              ✦ Bình Giải Độ Tương Hợp Giữa Hai Tuổi ✦
            </button>
          </div>
        </form>
      </section>

      {/* Result Display Section */}
      {result && (
        <section className="compatibility-result space-y-6" aria-labelledby="result-heading">
          {/* Executive Overview Hero Card */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-[#b8860b] bg-gradient-to-b from-[#fffefc] via-[#fbf7ee] to-[#f6ecda] p-6 sm:p-8 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5d2b7] pb-5">
              <div>
                <span
                  className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${
                    TIER_COLORS[result.ratingTier].badge
                  }`}
                >
                  ✦ KẾT QUẢ ĐỐI CHIẾU: {result.ratingTier.toUpperCase()}
                </span>
                <h2 id="result-heading" className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-son">
                  {result.title}
                </h2>
                <p className="mt-1 text-xs text-[#6e5842]">
                  Mục đích: {result.purpose === 'hon-nhan' ? 'Hôn nhân & Tình duyên' : 'Làm ăn & Hợp tác đối tác'}
                </p>
              </div>

              {/* Total Score Badge */}
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-son/40 bg-white/90 px-6 py-4 shadow-inner">
                <span className="text-[11px] font-bold text-[#8a7259] uppercase tracking-wider">
                  Điểm Tương Hợp
                </span>
                <span className="font-serif text-4xl sm:text-5xl font-black text-son">
                  {result.totalScore}
                  <span className="text-xl font-normal text-[#8c7456]">/100</span>
                </span>
              </div>
            </div>

            {/* General Verdict Paragraph */}
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-[#403020]">
              {result.generalVerdict}
            </p>

            {/* Two Persons Quick Compare Cards */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
              <div className="rounded-xl border border-[#ebdcc7] bg-[#fffdf9] p-4">
                <span className="font-bold text-son text-sm block">
                  {result.p1.name} ({result.p1.gender === 'nam' ? 'Nam' : 'Nữ'})
                </span>
                <div className="mt-2 space-y-1 text-[#544331]">
                  <p>• Năm sinh: <b>{result.p1.year} ({result.p1.canChi})</b></p>
                  <p>• Nạp âm: <b>{result.p1.napAm} ({result.p1.element})</b></p>
                  <p>• Cung Phi: <b>{result.p1.quai}</b></p>
                </div>
              </div>

              <div className="rounded-xl border border-[#ebdcc7] bg-[#fffdf9] p-4">
                <span className="font-bold text-son text-sm block">
                  {result.p2.name} ({result.p2.gender === 'nam' ? 'Nam' : 'Nữ'})
                </span>
                <div className="mt-2 space-y-1 text-[#544331]">
                  <p>• Năm sinh: <b>{result.p2.year} ({result.p2.canChi})</b></p>
                  <p>• Nạp âm: <b>{result.p2.napAm} ({result.p2.element})</b></p>
                  <p>• Cung Phi: <b>{result.p2.quai}</b></p>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Pillars of Analysis */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {result.aspects.map((aspect, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#e2d2bb] bg-[#fffefa] p-5 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-[#f0e2cf] pb-2.5">
                  <h3 className="font-serif text-sm font-bold text-son">
                    {idx + 1}. {aspect.title}
                  </h3>
                  <span className="rounded-md bg-[#faf4ea] px-2 py-0.5 text-xs font-bold text-[#8c6729]">
                    {aspect.score}/{aspect.maxScore} điểm
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-[#78644e]">
                  <span>{aspect.p1Value}</span>
                  <span className="font-bold text-son">⇄</span>
                  <span>{aspect.p2Value}</span>
                </div>

                <div className="mt-2.5 rounded-lg border border-[#eddac2] bg-[#fffbf4] p-2.5 text-xs">
                  <span className="font-bold text-son block">✦ {aspect.relationship}</span>
                  <p className="mt-1 leading-relaxed text-[#4d3d2c]">{aspect.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Highlights & Remedies Section */}
          <div className="rounded-2xl border border-[#d8c5a6] bg-[#fffdfa] p-6 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-son border-b border-[#ebdcc7] pb-3">
              ✦ Lời khuyên hóa giải & Chiến lược hòa hợp
            </h3>

            <div className="mt-4 space-y-2.5 text-xs sm:text-sm leading-relaxed text-[#403020]">
              {result.remedies.map((rem, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-son text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <p>{rem}</p>
                </div>
              ))}
            </div>

            {/* Share and Chart Link */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#ebdcc7] pt-4">
              <ShareWidget
                title={`Bình giải hợp tuổi: ${result.p1.name} & ${result.p2.name} (${result.totalScore}/100đ)`}
                text={`Điểm tương hợp đạt ${result.totalScore}/100 (${result.ratingTier}): "${result.title}" trên Xem Tử Vi Online`}
                label="Chia sẻ kết quả"
              />

              <a
                href="/#lap-la-so"
                className="inline-flex items-center gap-2 rounded-xl border border-son bg-son px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#781313]"
              >
                <span>Lập lá số Tử Vi trọn đời cho từng người</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
