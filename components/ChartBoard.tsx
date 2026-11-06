'use client';
import {BRANCH_GRID} from '@/lib/chart-layout';
import type {ChartView,PalaceView,StarView} from '@/lib/tuvi';

const MUTAGEN_COLOR: Record<string, string> = {
  'Lộc': 'bg-green-700',
  'Quyền': 'bg-purple-700',
  'Khoa': 'bg-blue-700',
  'Kỵ': 'bg-gray-800',
};

function Star({ s }: { s: StarView }) {
  const strong = ['Miếu', 'Vượng'].includes(s.brightness ?? '');
  const weak = s.brightness === 'Hãm';
  return (
    <span className="mr-1 inline-flex items-center whitespace-nowrap">
      <span
        className={
          s.kind === 'chinh'
            ? `font-bold ${weak ? 'text-[#6b5b45]' : 'text-son'}`
            : s.kind === 'phu'
              ? 'font-semibold text-[#3a5a40]'
              : 'text-[#7a6a52]'
        }
      >
        {s.name}
      </span>
      {s.brightness && <span className={`ml-0.5 text-[10px] ${strong ? 'text-son' : 'text-[#8a7a62]'}`}>({s.brightness[0]})</span>}
      {s.mutagen && (
        <span className={`ml-0.5 rounded px-1 text-[10px] font-bold text-white ${MUTAGEN_COLOR[s.mutagen] ?? 'bg-gray-600'}`}>{s.mutagen}</span>
      )}
    </span>
  );
}

function Cell({ p, selected, onClick }: { p: PalaceView; selected: boolean; onClick: () => void }) {
  const [row, col] = BRANCH_GRID[p.branch] ?? [1, 1];
  return (
    <button
      type="button"
      aria-label={`Xem cung ${p.name}`}
      aria-pressed={selected}
      onClick={onClick}
      style={{ gridRow: row, gridColumn: col }}
      className={`flex min-h-[170px] flex-col border border-[#d9c7a3] p-1.5 text-left text-[12px] leading-snug transition ${
        selected ? 'bg-[#fff1d6] ring-2 ring-son' : 'bg-white hover:bg-[#fffaf0]'
      } ${p.isYearlyNow ? 'outline outline-2 -outline-offset-4 outline-vang' : ''}`}
    >
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] text-[#8a7a62]">{p.stem} {p.branch}</span>
        <span className="font-serif text-[13px] font-bold uppercase text-son">
          {p.name}
          {p.isBody && <span className="ml-1 rounded bg-son px-1 text-[10px] text-white">Thân</span>}
        </span>
      </div>
      <div className="mt-1 min-h-[20px] text-[13px]">
        {p.major.length ? p.major.map((s) => <Star key={s.name} s={s} />) : <span className="italic text-[#8a7a62]">Vô chính diệu</span>}
      </div>
      <div className="mt-0.5">{p.minor.map((s) => <Star key={s.name} s={s} />)}</div>
      <div className="mt-0.5 text-[11px] text-[#7a6a52]">{p.adjective.map((s) => s.name).join(' · ')}</div>
      <div className="mt-auto flex items-end justify-between pt-1 text-[11px] text-[#8a7a62]">
        <span>{p.changsheng}</span>
        <span className={p.isDecadalNow ? 'rounded bg-son px-1 font-bold text-white' : 'font-semibold'}>{p.decadal[0]}–{p.decadal[1]}</span>
      </div>
      {p.yearlyName && <div className="text-right text-[10px] text-vang">LN: {p.yearlyName}</div>}
    </button>
  );
}

export default function ChartBoard({
  chart,
  selected,
  onSelect,
}: {
  chart: ChartView;
  selected: string | null;
  onSelect: (name: string) => void;
}) {
  return (
    <div className="min-w-0 overflow-x-auto rounded-xl border border-[#d9c7a3] bg-[#f6eedd] p-1" role="region" aria-label="Lá số 12 cung, cuộn ngang trên màn hình nhỏ" tabIndex={0}>
      <div className="grid min-w-[720px] grid-cols-4 grid-rows-4">
        {chart.palaces.map((p) => (
          <Cell key={p.branch} p={p} selected={selected === p.name} onClick={() => onSelect(p.name)} />
        ))}
        <div style={{ gridRow: '2 / span 2', gridColumn: '2 / span 2' }} className="flex flex-col items-center justify-center border border-[#d9c7a3] bg-[#fffaf0] p-4 text-center">
          <div className="max-w-full break-words font-serif text-2xl font-bold text-son [overflow-wrap:anywhere]">{chart.input.name || 'Lá số Tử Vi'}</div>
          <div className="mt-1 text-sm">{chart.input.gender === 'nu' ? 'Nữ' : 'Nam'} · tuổi {chart.zodiac}</div>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-left text-[13px]">
            <dt className="text-[#8a7a62]">Dương lịch</dt><dd>{chart.solarDate}</dd>
            <dt className="text-[#8a7a62]">Âm lịch</dt><dd>{chart.lunarText}</dd>
            <dt className="text-[#8a7a62]">Giờ sinh</dt><dd>{chart.time} ({chart.timeRange})</dd>
            <dt className="text-[#8a7a62]">Can chi</dt><dd>{chart.canChi}</dd>
            <dt className="text-[#8a7a62]">Cục</dt><dd>{chart.cuc}</dd>
            <dt className="text-[#8a7a62]">Mệnh chủ</dt><dd>{chart.menhChu}</dd>
            <dt className="text-[#8a7a62]">Thân chủ</dt><dd>{chart.thanChu}</dd>
            <dt className="text-[#8a7a62]">Xem năm</dt><dd>{chart.year} ({chart.yearlyNow.stem} {chart.yearlyNow.branch}) · {chart.nominalAge} tuổi</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
