'use client';

import { useState } from 'react';
import { getQueXam, type QueXam, type QueTier } from '@/lib/xin-xam';

const TOPICS = [
  { id: 'general', label: 'Tất cả việc / Tổng quan' },
  { id: 'career', label: '💼 Công danh & Sự nghiệp' },
  { id: 'wealth', label: '💰 Tài lộc & Làm ăn' },
  { id: 'love', label: '💖 Tình duyên & Hôn nhân' },
  { id: 'health', label: '🌿 Sức khỏe & Bình an' },
  { id: 'travel', label: '🚗 Xuất hành & Đi xa' },
];

const TIER_BADGE: Record<QueTier, { bg: string; text: string; border: string }> = {
  'Thượng Thượng': { bg: 'bg-amber-100', text: 'text-amber-900', border: 'border-amber-300' },
  'Thượng Cát': { bg: 'bg-emerald-100', text: 'text-emerald-900', border: 'border-emerald-300' },
  'Trung Cát': { bg: 'bg-blue-100', text: 'text-blue-900', border: 'border-blue-300' },
  'Trung Bình': { bg: 'bg-stone-100', text: 'text-stone-800', border: 'border-stone-300' },
  'Hạ Hạ': { bg: 'bg-rose-100', text: 'text-rose-900', border: 'border-rose-300' },
};

export default function XinXamWidget() {
  const [step, setStep] = useState<'idle' | 'shaking' | 'drawn' | 'revealed'>('idle');
  const [topic, setTopic] = useState('general');
  const [question, setQuestion] = useState('');
  const [queNumber, setQueNumber] = useState<number | null>(null);
  const [queData, setQueData] = useState<QueXam | null>(null);

  const startShake = () => {
    setStep('shaking');
    const randomNum = Math.floor(Math.random() * 100) + 1;
    setTimeout(() => {
      setQueNumber(randomNum);
      setQueData(getQueXam(randomNum));
      setStep('drawn');
    }, 2000);
  };

  const revealQue = () => {
    setStep('revealed');
  };

  const reset = () => {
    setStep('idle');
    setQueNumber(null);
    setQueData(null);
    setQuestion('');
  };

  return (
    <section className="xin-xam-container rounded-2xl border border-[#d8c5a6] bg-gradient-to-b from-[#fffefc] via-[#fbf7ed] to-[#f7eedc] p-6 sm:p-8 shadow-sm">
      {step === 'idle' && (
        <div className="mx-auto max-w-xl text-center">
          {/* Bamboo Tube Illustration */}
          <div className="mx-auto mb-6 flex h-40 w-32 items-center justify-center">
            <svg viewBox="0 0 120 160" fill="none" className="h-full w-full drop-shadow-md">
              {/* Bamboo Sticks */}
              <line x1="45" y1="20" x2="45" y2="90" stroke="#b8860b" strokeWidth="3" strokeLinecap="round" />
              <line x1="55" y1="10" x2="55" y2="90" stroke="#991b1b" strokeWidth="4" strokeLinecap="round" />
              <line x1="65" y1="15" x2="65" y2="90" stroke="#b8860b" strokeWidth="3" strokeLinecap="round" />
              <line x1="75" y1="25" x2="75" y2="90" stroke="#8c6729" strokeWidth="3" strokeLinecap="round" />
              <line x1="35" y1="30" x2="40" y2="90" stroke="#8c6729" strokeWidth="3" strokeLinecap="round" />
              {/* Bamboo Cylinder */}
              <rect x="25" y="60" width="70" height="95" rx="6" fill="#f4ebd9" stroke="#b5894c" strokeWidth="2.5" />
              <line x1="25" y1="75" x2="95" y2="75" stroke="#d4b47e" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="25" y1="135" x2="95" y2="135" stroke="#d4b47e" strokeWidth="2" strokeDasharray="3 3" />
              {/* Star emblem */}
              <circle cx="60" cy="105" r="14" fill="#991b1b" />
              <text x="60" y="110" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">
                靈
              </text>
            </svg>
          </div>

          <h2 className="font-serif text-2xl font-bold text-son sm:text-3xl">
            Tĩnh tâm lắc ống xăm Quan Âm
          </h2>
          <p className="mt-2 text-sm text-[#5a4a36]">
            Thành tâm nghĩ về một việc đang băn khoăn, lắc ống xăm để đón nhận lời khuyên cổ truyền.
          </p>

          <div className="mt-6 space-y-4 text-left">
            <div>
              <label htmlFor="xam-topic" className="block text-xs font-semibold text-[#8c6729] mb-1.5">
                CHỌN VIỆC MUỐN HỎI:
              </label>
              <select
                id="xam-topic"
                className="input w-full"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                {TOPICS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="xam-question" className="block text-xs font-semibold text-[#8c6729] mb-1.5">
                CÂU HỎI TRONG LÒNG (TÙY CHỌN):
              </label>
              <input
                id="xam-question"
                type="text"
                maxLength={100}
                placeholder="Ví dụ: Công việc sắp tới có thuận lợi không? Có nên đầu tư lúc này?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="input w-full"
              />
            </div>
          </div>

          <div className="mt-7">
            <button
              type="button"
              onClick={startShake}
              className="btn w-full py-3.5 text-base font-bold shadow-lg"
            >
              Lắc Ống Xăm ✦ Cầu Quẻ Linh Ứng
            </button>
            <p className="mt-2.5 text-xs text-[#8a755d]">
              Mỗi ngày nên xin một quẻ cho một việc để giữ trọn ý nghĩa chiêm nghiệm.
            </p>
          </div>
        </div>
      )}

      {step === 'shaking' && (
        <div className="mx-auto max-w-md py-12 text-center">
          <div className="mx-auto mb-6 flex h-44 w-36 items-center justify-center animate-bounce">
            <svg viewBox="0 0 120 160" fill="none" className="h-full w-full rotate-3 drop-shadow-xl transition-transform">
              <line x1="45" y1="15" x2="45" y2="90" stroke="#b8860b" strokeWidth="3" />
              <line x1="55" y1="5" x2="55" y2="90" stroke="#991b1b" strokeWidth="4" />
              <line x1="65" y1="10" x2="65" y2="90" stroke="#b8860b" strokeWidth="3" />
              <rect x="25" y="60" width="70" height="95" rx="6" fill="#f4ebd9" stroke="#b5894c" strokeWidth="2.5" />
              <circle cx="60" cy="105" r="14" fill="#991b1b" />
              <text x="60" y="110" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">
                靈
              </text>
            </svg>
          </div>
          <h3 className="font-serif text-2xl font-bold text-son">
            Đang lắc ống xăm...
          </h3>
          <p className="mt-2 text-sm text-[#6e5842] animate-pulse">
            Tĩnh tâm định khí, một quẻ xăm đang ứng hiện...
          </p>
        </div>
      )}

      {step === 'drawn' && queData && (
        <div className="mx-auto max-w-md py-8 text-center">
          <div className="mx-auto mb-5 flex h-48 w-20 flex-col items-center justify-between rounded-lg border-2 border-son bg-gradient-to-b from-[#fbf3e4] to-[#f4e2be] p-3 shadow-xl">
            <span className="font-serif text-xs font-bold text-son">QUAN ÂM</span>
            <span className="font-serif text-4xl font-extrabold text-[#2d2013]">
              {queNumber}
            </span>
            <span className="text-[11px] font-semibold text-[#8c6729]">LINH QUẺ</span>
          </div>

          <h3 className="font-serif text-2xl font-bold text-son">
            Đã rơi thẻ xăm số {queNumber}!
          </h3>
          <p className="mt-2 text-sm text-[#5c4a35]">
            Quẻ xăm ứng hiện cho tâm nguyện của bạn. Hãy mở quẻ để đọc bài thơ tứ tuyệt và lời bình giải.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={revealQue}
              className="btn py-3 text-sm font-bold shadow-md"
            >
              Mở Lời Quẻ Xăm Số {queNumber} →
            </button>
            <button
              type="button"
              onClick={reset}
              className="text-xs text-[#8a755d] underline hover:text-son"
            >
              Lắc lại ống xăm
            </button>
          </div>
        </div>
      )}

      {step === 'revealed' && queData && (
        <div className="space-y-6">
          {/* Top Result Card */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-[#d4b584] bg-[#fffefa] p-6 sm:p-8 shadow-md">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#ebdcc7] pb-4">
              <div>
                <p className="site-eyebrow text-xs uppercase tracking-wider text-[#8c6729]">
                  QUẺ XĂM QUAN ÂM SỐ {queData.number}
                </p>
                <h2 className="font-serif text-2xl font-bold text-son sm:text-3xl">
                  {queData.title}
                </h2>
              </div>

              <span
                className={`rounded-full border px-3.5 py-1 text-xs font-bold shadow-xs ${
                  TIER_BADGE[queData.tier].bg
                } ${TIER_BADGE[queData.tier].text} ${TIER_BADGE[queData.tier].border}`}
              >
                {queData.tier}
              </span>
            </div>

            {/* Poem Section (Dual Column: Han-Viet & Vietnamese translation) */}
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-[#ebdcc7] bg-[#fbf6ec] p-5">
                <span className="block text-xs font-semibold uppercase tracking-wider text-[#8c6729] mb-2">
                  THƠ TỨ TUYỆT (HÁN VIỆT)
                </span>
                <div className="font-serif text-sm leading-relaxed text-[#382b1d] italic space-y-1">
                  {queData.hanPoem.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#d9c5a7] bg-[#fffdf9] p-5 border-l-4 border-l-son">
                <span className="block text-xs font-semibold uppercase tracking-wider text-son mb-2">
                  DỊCH NGHĨA TIẾNG VIỆT
                </span>
                <div className="font-serif text-sm font-medium leading-relaxed text-[#2d2116] space-y-1">
                  {queData.viPoem.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Historical Story / Context */}
            <div className="mt-5 rounded-xl border border-[#e8dcc8] bg-[#fdfbf6] p-4 text-xs text-[#524130] leading-relaxed">
              <b className="text-[#8c6729] block mb-1">📜 ĐIỂN TÍCH XƯA:</b>
              <p>{queData.story}</p>
            </div>

            {/* Summary Interpretation */}
            <div className="mt-5 border-t border-[#ebdcc7] pt-4">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#8c6729] mb-1">
                LỜI GIẢI TỔNG QUAN
              </span>
              <p className="font-serif text-base font-semibold leading-relaxed text-[#3b2b1d]">
                {queData.summary}
              </p>
            </div>

            {/* Detailed Matters Grid */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
              <div className="rounded-lg border border-[#eddcc9] bg-[#fffefa] p-3">
                <b className="text-son block mb-1">✦ Bản mệnh:</b>
                <p className="text-[#594735]">{queData.details.banMenh}</p>
              </div>

              <div className="rounded-lg border border-[#eddcc9] bg-[#fffefa] p-3">
                <b className="text-son block mb-1">✦ Cầu tài & Kinh doanh:</b>
                <p className="text-[#594735]">{queData.details.cauTai}</p>
              </div>

              <div className="rounded-lg border border-[#eddcc9] bg-[#fffefa] p-3">
                <b className="text-son block mb-1">✦ Công danh & Thi cử:</b>
                <p className="text-[#594735]">{queData.details.congDanh}</p>
              </div>

              <div className="rounded-lg border border-[#eddcc9] bg-[#fffefa] p-3">
                <b className="text-son block mb-1">✦ Hôn nhân & Tình duyên:</b>
                <p className="text-[#594735]">{queData.details.honNhan}</p>
              </div>

              <div className="rounded-lg border border-[#eddcc9] bg-[#fffefa] p-3">
                <b className="text-son block mb-1">✦ Xuất hành & Đi xa:</b>
                <p className="text-[#594735]">{queData.details.xuatHanh}</p>
              </div>

              <div className="rounded-lg border border-[#eddcc9] bg-[#fffefa] p-3">
                <b className="text-son block mb-1">✦ Tật bệnh & Sức khỏe:</b>
                <p className="text-[#594735]">{queData.details.benhTat}</p>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[#ebdcc7] pt-5">
              <button
                type="button"
                onClick={reset}
                className="btn-outline px-5 py-2.5 text-xs font-bold"
              >
                ← Xin Quẻ Khác
              </button>

              <a
                href="/#lap-la-so"
                className="inline-flex items-center gap-2 rounded-xl border border-son bg-son px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#781313]"
              >
                <span>Xem Lá Số Tử Vi Trọn Đời Để Thấu Hiểu Toàn Diện</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
