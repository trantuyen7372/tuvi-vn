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
    <div className="mt-3 space-y-3 border-t border-[#eadfc6] pt-3">
      {infos.map((s) => (
        <div key={s.slug}>
          <div className="flex items-baseline justify-between">
            <span className="font-serif font-bold text-son">{s.name}</span>
            <span className="text-xs text-[#8a7a62]">{s.element} · {s.nature}</span>
          </div>
          <div className="text-xs text-[#6b5b45]">{s.keywords.join(' · ')}</div>
          <p className="mt-1 text-[13px] leading-relaxed">
            {topic ? <><b>{topic.label}:</b> {s[topic.key] as string}</> : s.coQuyet}
          </p>
          <a href={`/sao/${s.slug}`} className="text-xs font-semibold text-son underline">Xem đầy đủ về sao {s.name}</a>
        </div>
      ))}
    </div>
  );
}
