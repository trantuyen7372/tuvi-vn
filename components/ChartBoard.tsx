'use client';
import {BRANCH_GRID} from '@/lib/chart-layout';
import {FIVE_ELEMENTS,starElement,cucElement,type FiveElement} from '@/lib/five-elements';
import type {ChartView,PalaceView,StarView} from '@/lib/tuvi';

const MUTAGEN_COLOR: Record<string, string> = {
  'Lộc': 'bg-green-700',
  'Quyền': 'bg-purple-700',
  'Khoa': 'bg-blue-700',
  'Kỵ': 'bg-gray-800',
};

function Star({ s }: { s: StarView }) {
  const element = starElement(s.name);
  return (
    <span className={`relative flex min-w-0 flex-wrap items-baseline gap-x-0.5 gap-y-0.5 ${s.kind === 'chinh' ? 'justify-center' : ''}`} title={element ? `${s.name} · hành ${element}` : undefined}>
      <span className="inline-flex items-baseline whitespace-nowrap">
        <span
          className={s.kind === 'chinh' ? 'font-extrabold' : s.kind === 'phu' ? 'font-semibold' : 'font-normal'}
          style={{color: element ? FIVE_ELEMENTS[element].color : '#6b5b45'}}
        >
          {s.name}
        </span>
        {element && <span className="sr-only">, hành {element}</span>}
        {s.brightness && <span className="ml-0.5 text-[9px] font-normal text-[#8a7a62]" title={s.brightness}>({s.brightness[0]})</span>}
      </span>
      {s.mutagen && (
        <span className={`rounded px-1 text-[9px] font-bold leading-4 text-white ${MUTAGEN_COLOR[s.mutagen] ?? 'bg-gray-600'}`}>{s.mutagen}</span>
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
      className={`chart-palace flex min-w-0 min-h-[210px] flex-col border border-[#d9c7a3] p-2 text-left text-[11px] font-normal leading-snug transition ${
        selected ? 'bg-[#fff1d6] ring-2 ring-son' : 'bg-white hover:bg-[#fffaf0]'
      } ${p.isYearlyNow ? 'outline outline-2 -outline-offset-4 outline-vang' : ''}`}
    >
      <div className="flex items-baseline justify-between gap-1">
        <span className="shrink-0 text-[10px] font-normal text-[#8a7a62]">{p.stem} {p.branch}</span>
        <span className="text-right font-serif text-[12px] font-bold uppercase text-son">
          {p.name}
          {p.isBody && <span className="ml-1 rounded bg-son px-1 text-[10px] text-white">Thân</span>}
        </span>
      </div>
      <div className="chart-major my-2 flex min-h-[44px] flex-col justify-center gap-0.5 text-[14px] leading-5">
        {p.major.length ? p.major.map((s) => <Star key={s.name} s={s} />) : <span className="text-center text-[11px] font-normal italic text-[#8a7a62]">Vô chính diệu</span>}
      </div>
      <div className="chart-minor grid grid-cols-2 items-start gap-x-2 text-[10px] leading-4">
        <div className="min-w-0 space-y-1">{p.minor.map((s) => <Star key={s.name} s={s} />)}</div>
        <div className="min-w-0 space-y-1">{p.adjective.map((s) => <Star key={s.name} s={s} />)}</div>
      </div>
      <div className="mt-auto flex items-end justify-between gap-1 border-t border-[#d9c7a3]/40 pt-1 text-[10px] font-normal text-[#8a7a62]">
        <span>{p.changsheng}</span>
        <span className={p.isDecadalNow ? 'rounded bg-son px-1 font-bold text-white' : 'font-medium'}>{p.decadal[0]}–{p.decadal[1]}</span>
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
  const element = cucElement(chart.cuc);
  return (
    <div className="min-w-0 rounded-xl border border-[#d9c7a3] bg-[#f6eedd] p-1">
      <div className="px-2 py-2 text-xs">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1" aria-label="Chú giải màu ngũ hành">
          <span className="font-semibold">Ngũ hành:</span>
          {(Object.entries(FIVE_ELEMENTS) as [FiveElement, typeof FIVE_ELEMENTS[FiveElement]][]).map(([name, palette]) => (
            <span key={name} className="relative inline-flex items-center gap-1" style={{color: palette.color}}>
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full border border-black/20" style={{backgroundColor: palette.swatch}} />
              {name}<span className="sr-only">: {palette.label}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto" role="region" aria-label="Lá số 12 cung, cuộn ngang trên màn hình nhỏ" tabIndex={0}>
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
            <dt className="text-[#8a7a62]">Cục</dt><dd className="font-semibold" style={{color: element ? FIVE_ELEMENTS[element].color : undefined}}>{chart.cuc}</dd>
            <dt className="text-[#8a7a62]">Mệnh chủ</dt><dd>{chart.menhChu}</dd>
            <dt className="text-[#8a7a62]">Thân chủ</dt><dd>{chart.thanChu}</dd>
            <dt className="text-[#8a7a62]">Xem năm</dt><dd>{chart.year} ({chart.yearlyNow.stem} {chart.yearlyNow.branch}) · {chart.nominalAge} tuổi</dd>
          </dl>
        </div>
      </div>
      </div>
    </div>
  );
}
