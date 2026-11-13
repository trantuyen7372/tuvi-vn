import { STAR_BY_NAME, type StarInfo } from '@/lib/stars';

const TOPIC_BY_PALACE: Record<string, { key: keyof StarInfo; label: string }> = {
  'Quan Lộc': { key: 'career', label: 'Sự nghiệp' },
  'Tài Bạch': { key: 'wealth', label: 'Tài lộc' },
  'Phu Thê': { key: 'love', label: 'Tình duyên' },
  'Tật Ách': { key: 'health', label: 'Sức khoẻ' },
};

/** Ghi chú ý nghĩa các chính tinh trong một cung. */
export default function StarNotes({ palace, stars }: { palace: string; stars: string[] }) {
  const infos = stars.map((n) => STAR_BY_NAME[n]).filter(Boolean);
  if (!infos.length) return null;
  const topic = TOPIC_BY_PALACE[palace];
  return (
    <div className="mt-4 space-y-3 border-t border-[#ebdcc7] pt-4">
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c6729]">
        ✦ Ý NGHĨA CHÍNH TINH TẠI CUNG
      </span>
      {infos.map((s) => (
        <div key={s.slug} className="rounded-xl border border-[#e5d8c3] bg-[#fffdfa] p-3.5 shadow-xs">
          <div className="flex items-baseline justify-between">
            <span className="font-serif font-bold text-son text-base">{s.name}</span>
            <span className="text-xs text-[#7c6952] italic">{s.element} · {s.nature}</span>
          </div>
          <div className="mt-1 text-xs text-[#8c6729] font-medium">{s.keywords.join(' · ')}</div>
          <p className="mt-2 text-xs leading-relaxed text-[#3d2f21]">
            {topic ? <><b>{topic.label}:</b> {s[topic.key] as string}</> : s.coQuyet}
          </p>
          <a href={`/sao/${s.slug}`} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-son underline">
            Xem đầy đủ về sao {s.name} →
          </a>
        </div>
      ))}
    </div>
  );
}
