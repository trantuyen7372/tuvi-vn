'use client';
import { useState } from 'react';
import type { ChartView, PalaceView, StarView } from '@/lib/tuvi';
import { FIVE_ELEMENTS, starElement, type FiveElement } from '@/lib/five-elements';

const STAR_SLUGS: Record<string, string> = {
  'Tử Vi': 'tu-vi',
  'Thiên Cơ': 'thien-co',
  'Thái Dương': 'thai-duong',
  'Vũ Khúc': 'vu-khuc',
  'Thiên Đồng': 'thien-dong',
  'Liêm Trinh': 'liem-trinh',
  'Thiên Phủ': 'thien-phu',
  'Thái Âm': 'thai-am',
  'Tham Lang': 'tham-lang',
  'Cự Môn': 'cu-mon',
  'Thiên Tướng': 'thien-tuong',
  'Thiên Lương': 'thien-luong',
  'Thất Sát': 'that-sat',
  'Phá Quân': 'pha-quan',
};

const BRIGHTNESS_BADGE: Record<string, { label: string; cls: string }> = {
  'Miếu': { label: 'Miếu địa (M)', cls: 'bg-amber-100 text-amber-900 border-amber-300' },
  'Vượng': { label: 'Vượng địa (V)', cls: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  'Đắc': { label: 'Đắc địa (Đ)', cls: 'bg-blue-100 text-blue-900 border-blue-300' },
  'Bình': { label: 'Bình hòa (B)', cls: 'bg-stone-100 text-stone-700 border-stone-300' },
  'Hãm': { label: 'Hãm địa (H)', cls: 'bg-rose-100 text-rose-900 border-rose-300' },
};

const MUTAGEN_META: Record<string, { title: string; color: string; desc: string; icon: string }> = {
  'Lộc': { title: 'Hóa Lộc', color: 'bg-emerald-700 text-white', desc: 'Chủ về tài lộc, cơ duyên hanh thông, sự phong phú và nguồn dưỡng chất tinh thần.', icon: '🟢' },
  'Quyền': { title: 'Hóa Quyền', color: 'bg-purple-700 text-white', desc: 'Chủ về uy quyền, sức ảnh hưởng, bản lĩnh tự chủ, khả năng nắm giữ trọng trách.', icon: '🟣' },
  'Khoa': { title: 'Hóa Khoa', color: 'bg-blue-700 text-white', desc: 'Chủ về danh vọng, thi cử, học vấn, danh tiếng minh bạch và khả năng cứu giải tai ách.', icon: '🔵' },
  'Kỵ': { title: 'Hóa Kỵ', color: 'bg-zinc-800 text-white', desc: 'Chủ về trở ngại, nghiệp lực, vướng mắc cảm xúc; nơi cần sự cẩn trọng và tu dưỡng.', icon: '⚫' },
};

interface StarLocation {
  name: string;
  slug?: string;
  element?: FiveElement;
  palaceName: string;
  palaceBranch: string;
  brightness?: string;
  mutagen?: string;
}

export default function StarCatalogSheet({ chart }: { chart: ChartView }) {
  const [tab, setTab] = useState<'major' | 'mutagen' | 'assistants'>('major');

  // 1. Locate all 14 Major stars
  const majorStars: StarLocation[] = Object.keys(STAR_SLUGS).map((name) => {
    let foundPalace: PalaceView | undefined;
    let foundStar: StarView | undefined;
    for (const p of chart.palaces) {
      const s = p.major.find((m) => m.name === name);
      if (s) {
        foundPalace = p;
        foundStar = s;
        break;
      }
    }
    return {
      name,
      slug: STAR_SLUGS[name],
      element: starElement(name),
      palaceName: foundPalace ? foundPalace.name : '—',
      palaceBranch: foundPalace ? foundPalace.branch : '—',
      brightness: foundStar?.brightness,
      mutagen: foundStar?.mutagen,
    };
  });

  // 2. Locate Tứ Hóa
  const mutagens: { mutagen: string; starName: string; palaceName: string; palaceBranch: string; element?: FiveElement }[] = [];
  ['Lộc', 'Quyền', 'Khoa', 'Kỵ'].forEach((mKey) => {
    for (const p of chart.palaces) {
      for (const s of [...p.major, ...p.minor]) {
        if (s.mutagen === mKey) {
          mutagens.push({
            mutagen: mKey,
            starName: s.name,
            palaceName: p.name,
            palaceBranch: p.branch,
            element: starElement(s.name),
          });
        }
      }
    }
  });

  // 3. Locate Cát Tinh & Sát Tinh
  const helperGroup = [
    { title: 'Tả Phù & Hữu Bật', desc: 'Quý nhân phò trợ, đồng minh đắc lực, tăng thêm trợ lực thành công.', stars: ['Tả Phù', 'Hữu Bật'] },
    { title: 'Thiên Khôi & Thiên Việt', desc: 'Thiên Ất Quý Nhân, cơ hội quý giá từ cấp trên hoặc người đi trước.', stars: ['Thiên Khôi', 'Thiên Việt'] },
    { title: 'Văn Xương & Văn Khúc', desc: 'Văn tinh khoa giáp, tài năng học thuật, bằng cấp và khiếu thẩm mỹ.', stars: ['Văn Xương', 'Văn Khúc'] },
    { title: 'Lộc Tồn & Thiên Mã', desc: 'Lộc trời ban, sự tháo vát, năng động, bôn ba tạo dựng cơ nghiệp.', stars: ['Lộc Tồn', 'Thiên Mã'] },
  ];

  const challengerGroup = [
    { title: 'Kình Dương & Đà La', desc: 'Gươm đao, mũi nhọn, sự va chạm, tính kiên cường vượt trở ngại.', stars: ['Kình Dương', 'Đà La'] },
    { title: 'Hỏa Tinh & Linh Tinh', desc: 'Sức nóng, tính bộc phát bất ngờ, thử thách lòng kiên nhẫn.', stars: ['Hỏa Tinh', 'Linh Tinh'] },
    { title: 'Địa Không & Địa Kiếp', desc: 'Biến thiên thăng trầm, tư duy khác biệt, xu hướng ngộ đạo triết lý.', stars: ['Địa Không', 'Địa Kiếp'] },
  ];

  const findStarPalace = (sName: string) => {
    for (const p of chart.palaces) {
      if (p.major.some((s) => s.name === sName) || p.minor.some((s) => s.name === sName) || p.adjective.some((s) => s.name === sName)) {
        return `Cung ${p.name} (${p.branch})`;
      }
    }
    return '—';
  };

  return (
    <section className="mt-8 rounded-2xl border border-[#d8c5a6] bg-gradient-to-b from-[#fffefc] to-[#fbf6ec] p-6 shadow-sm" aria-labelledby="star-sheet-title">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ebdcc7] pb-4">
        <div>
          <p className="site-eyebrow">✦ BẢNG TINH TÚ LÁ SỐ ✦</p>
          <h2 id="star-sheet-title" className="font-serif text-2xl font-bold text-son">
            Hệ thống sao & Tứ Hóa bản mệnh
          </h2>
        </div>
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Bộ lọc danh mục sao">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'major'}
            onClick={() => setTab('major')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              tab === 'major'
                ? 'bg-son text-white shadow-sm'
                : 'bg-white/80 border border-[#dbcbb2] text-[#63503b] hover:bg-[#faeed9]'
            }`}
          >
            14 Chính tinh ({majorStars.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'mutagen'}
            onClick={() => setTab('mutagen')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              tab === 'mutagen'
                ? 'bg-son text-white shadow-sm'
                : 'bg-white/80 border border-[#dbcbb2] text-[#63503b] hover:bg-[#faeed9]'
            }`}
          >
            Tứ Hóa ({mutagens.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'assistants'}
            onClick={() => setTab('assistants')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              tab === 'assistants'
                ? 'bg-son text-white shadow-sm'
                : 'bg-white/80 border border-[#dbcbb2] text-[#63503b] hover:bg-[#faeed9]'
            }`}
          >
            Cát tinh & Sát tinh
          </button>
        </div>
      </div>

      {tab === 'major' && (
        <div className="mt-5 space-y-4">
          <p className="text-xs text-[#705e48] leading-relaxed">
            Vị trí và độ sáng của 14 chính tinh định hình cốt cách, tài năng và hướng phát triển của bạn trên 12 cung số:
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {majorStars.map((s) => {
              const bMeta = s.brightness ? BRIGHTNESS_BADGE[s.brightness] : null;
              const elementStyle = s.element ? FIVE_ELEMENTS[s.element] : null;
              return (
                <div
                  key={s.name}
                  className="flex flex-col justify-between rounded-xl border border-[#e4d6c1] bg-[#fffefb] p-3.5 shadow-sm transition-all hover:border-[#b5894c] hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-[#f0e4d0] pb-2">
                    <span className="font-serif text-lg font-bold" style={{ color: elementStyle ? elementStyle.color : '#8f1818' }}>
                      {s.name}
                    </span>
                    {s.element && (
                      <span className="rounded-full border border-[#e4d6c1] bg-[#faf3e6] px-2 py-0.5 text-[10px] font-semibold text-[#735e45]">
                        Hành {s.element}
                      </span>
                    )}
                  </div>
                  <div className="my-2.5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8c7a65]">Cung tọa thủ:</span>
                      <span className="font-semibold text-son">
                        Cung {s.palaceName} ({s.palaceBranch})
                      </span>
                    </div>
                    {bMeta && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#8c7a65]">Đắc hãm:</span>
                        <span className={`rounded border px-1.5 py-0.5 text-[10.5px] font-semibold ${bMeta.cls}`}>
                          {bMeta.label}
                        </span>
                      </div>
                    )}
                    {s.mutagen && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#8c7a65]">Biến hóa:</span>
                        <span className="rounded bg-son px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                          Hóa {s.mutagen}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-auto border-t border-[#f0e4d0] pt-2 text-right">
                    <a
                      href={`/sao/${s.slug}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-son hover:underline"
                    >
                      Tra cứu ý nghĩa <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'mutagen' && (
        <div className="mt-5 space-y-4">
          <p className="text-xs text-[#705e48] leading-relaxed">
            Tứ Hóa (Lộc - Quyền - Khoa - Kỵ) phản ánh 4 luồng năng lượng biến hóa quan trọng nhất từ Can năm sinh của bạn:
          </p>
          <div className="grid gap-3.5 sm:grid-cols-2">
            {mutagens.map((m) => {
              const meta = MUTAGEN_META[m.mutagen] || {
                title: `Hóa ${m.mutagen}`,
                color: 'bg-gray-700 text-white',
                desc: '',
                icon: '✦',
              };
              return (
                <div
                  key={`${m.mutagen}-${m.starName}`}
                  className="rounded-xl border border-[#dccbb0] bg-[#fffefc] p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-[#eedec7] pb-2.5">
                    <span className="inline-flex items-center gap-1.5 font-serif text-base font-bold text-[#2b1f14]">
                      <span aria-hidden="true">{meta.icon}</span>
                      {meta.title}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${meta.color}`}>
                      {m.starName} Hóa {m.mutagen}
                    </span>
                  </div>
                  <div className="mt-2.5 text-xs text-[#524130]">
                    <p className="font-semibold text-son">
                      Tọa thủ tại: Cung {m.palaceName} (Địa chi {m.palaceBranch})
                    </p>
                    <p className="mt-1.5 leading-relaxed text-[#6b5842]">{meta.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'assistants' && (
        <div className="mt-5 space-y-6">
          <div>
            <h3 className="font-serif text-base font-bold text-[#1b6b3e] flex items-center gap-2">
              <span>✦ Lục Cát Tinh & Quý Trợ Tinh</span>
            </h3>
            <p className="mt-1 text-xs text-[#705e48]">Các cặp sao chủ về quý nhân, trợ lực, trí tuệ và cơ hội phát đạt:</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {helperGroup.map((item) => (
                <div key={item.title} className="rounded-xl border border-[#cfdfd2] bg-[#f8fcf9] p-3.5">
                  <h4 className="font-serif text-sm font-bold text-[#14532d]">{item.title}</h4>
                  <p className="mt-1 text-xs text-[#40624a] leading-relaxed">{item.desc}</p>
                  <div className="mt-2.5 flex flex-wrap gap-2 text-xs">
                    {item.stars.map((s) => (
                      <span key={s} className="rounded-md border border-[#c3dec7] bg-white px-2 py-0.5 font-medium text-[#1e5631]">
                        <b>{s}:</b> {findStarPalace(s)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-base font-bold text-[#991b1b] flex items-center gap-2">
              <span>✦ Lục Sát Tinh & Thử Thách Bản Mệnh</span>
            </h3>
            <p className="mt-1 text-xs text-[#705e48]">Các cặp sao chủ về sóng gió, tôi luyện bản lĩnh và các khúc quanh cuộc đời:</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {challengerGroup.map((item) => (
                <div key={item.title} className="rounded-xl border border-[#ebd0d0] bg-[#fdf8f8] p-3.5">
                  <h4 className="font-serif text-sm font-bold text-[#881337]">{item.title}</h4>
                  <p className="mt-1 text-xs text-[#6e3737] leading-relaxed">{item.desc}</p>
                  <div className="mt-2.5 flex flex-wrap gap-2 text-xs">
                    {item.stars.map((s) => (
                      <span key={s} className="rounded-md border border-[#f3c2c2] bg-white px-2 py-0.5 font-medium text-[#991b1b]">
                        <b>{s}:</b> {findStarPalace(s)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
