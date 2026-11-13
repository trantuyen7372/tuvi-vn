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
  const isMenh = p.name === 'Mệnh';
  return (
    <button
      type="button"
      aria-label={`Xem cung ${p.name}`}
      aria-pressed={selected}
      onClick={onClick}
      style={{ gridRow: row, gridColumn: col }}
      className={`chart-palace flex min-w-0 min-h-[214px] flex-col border border-[#dac6a3] p-2.5 text-left text-[11px] font-normal leading-snug transition duration-150 ${
        selected
          ? 'z-10 bg-gradient-to-b from-[#fff3da] to-[#fffaf0] ring-2 ring-son shadow-md'
          : isMenh
            ? 'bg-gradient-to-b from-[#fffdf7] to-[#fbf3e4] hover:bg-[#fff6e6]'
            : 'bg-[#fffefb] hover:bg-[#fff8ec]'
      } ${p.isYearlyNow ? 'outline outline-2 -outline-offset-4 outline-[#c58b18]' : ''}`}
    >
      <div className="flex items-center justify-between gap-1 border-b border-[#eadbc0]/80 pb-1.5">
        <span className="shrink-0 rounded bg-[#f4ead7] px-1.5 py-0.5 text-[10px] font-medium text-[#6e5d47]">{p.stem} {p.branch}</span>
        <span className="text-right font-serif text-[12.5px] font-bold uppercase tracking-wide text-son">
          {p.name}
          {p.isBody && <span className="ml-1 rounded bg-son px-1.5 py-0.5 font-sans text-[9.5px] font-semibold tracking-normal text-white shadow-sm">Thân</span>}
        </span>
      </div>
      <div className="chart-major my-2 flex min-h-[46px] flex-col justify-center gap-0.5 rounded-md bg-[#faf3e6]/60 px-1 py-1 text-[14px] leading-5">
        {p.major.length ? p.major.map((s) => <Star key={s.name} s={s} />) : <span className="text-center text-[11px] font-normal italic text-[#8a7a62]">Vô chính diệu</span>}
      </div>
      <div className="chart-minor grid grid-cols-2 items-start gap-x-2 text-[10.5px] leading-4">
        <div className="min-w-0 space-y-1">{p.minor.map((s) => <Star key={s.name} s={s} />)}</div>
        <div className="min-w-0 space-y-1">{p.adjective.map((s) => <Star key={s.name} s={s} />)}</div>
      </div>
      <div className="mt-auto flex items-center justify-between gap-1 border-t border-[#e5d5b8]/60 pt-1.5 text-[10px] font-normal text-[#786752]">
        <span className="font-medium">{p.changsheng}</span>
        <span className={p.isDecadalNow ? 'rounded bg-son px-1.5 py-0.5 font-bold text-white shadow-sm' : 'rounded bg-[#f3ead8] px-1 text-[#5c4d3a] font-medium'}>{p.decadal[0]}–{p.decadal[1]}</span>
      </div>
      {p.yearlyName && <div className="mt-0.5 text-right text-[10px] font-medium text-[#a36e08]">LN: {p.yearlyName}</div>}
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
    <div className="min-w-0 rounded-2xl border-2 border-[#cfb892] bg-gradient-to-b from-[#f4ead6] to-[#ede0c8] p-1.5 shadow-[0_14px_38px_rgba(62,40,18,0.09)]">
      <div className="px-2.5 py-2 text-xs">
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1" aria-label="Chú giải màu ngũ hành">
          <span className="font-semibold text-[#4a3b2a]">Ngũ hành:</span>
          {(Object.entries(FIVE_ELEMENTS) as [FiveElement, typeof FIVE_ELEMENTS[FiveElement]][]).map(([name, palette]) => (
            <span key={name} className="relative inline-flex items-center gap-1 font-medium" style={{color: palette.color}}>
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full border border-black/20 shadow-sm" style={{backgroundColor: palette.swatch}} />
              {name}<span className="sr-only">: {palette.label}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-[#d6c29f]" role="region" aria-label="Lá số 12 cung, cuộn ngang trên màn hình nhỏ" tabIndex={0}>
      <div className="grid min-w-[720px] grid-cols-4 grid-rows-4">
        {chart.palaces.map((p) => (
          <Cell key={p.branch} p={p} selected={selected === p.name} onClick={() => onSelect(p.name)} />
        ))}
        <div style={{ gridRow: '2 / span 2', gridColumn: '2 / span 2' }} className="relative flex flex-col items-center justify-center border border-[#d6c29f] bg-gradient-to-b from-[#fffdf8] via-[#fbf4e6] to-[#f6ead4] p-5 text-center shadow-inner">
          <div className="pointer-events-none absolute inset-2.5 rounded-lg border border-[#decba8]/70" aria-hidden="true" />
          <span className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#947651]">Thiên Bàn Mệnh Số</span>
          <div className="max-w-full break-words font-serif text-2xl font-bold text-son [overflow-wrap:anywhere]">{chart.input.name || 'Lá số Tử Vi'}</div>
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-[#e2d1b3] bg-white/80 px-3 py-0.5 text-xs font-medium text-[#544331]">{chart.input.gender === 'nu' ? 'Nữ mệnh' : 'Nam mệnh'} · tuổi {chart.zodiac}</div>
          <dl className="mt-3.5 grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-1.5 rounded-xl border border-[#e6d7bc] bg-white/75 px-4 py-3 text-left text-[12.5px] shadow-sm">
            <dt className="font-medium text-[#8a755b]">Dương lịch</dt><dd className="font-medium text-[#2b2118]">{chart.solarDate}</dd>
            <dt className="font-medium text-[#8a755b]">Âm lịch</dt><dd className="font-medium text-[#2b2118]">{chart.lunarText}</dd>
            <dt className="font-medium text-[#8a755b]">Giờ sinh</dt><dd className="font-medium text-[#2b2118]">{chart.time} ({chart.timeRange})</dd>
            <dt className="font-medium text-[#8a755b]">Can chi</dt><dd className="font-medium text-[#2b2118]">{chart.canChi}</dd>
            <dt className="font-medium text-[#8a755b]">Cục</dt><dd className="font-bold" style={{color: element ? FIVE_ELEMENTS[element].color : undefined}}>{chart.cuc}</dd>
            <dt className="font-medium text-[#8a755b]">Mệnh chủ</dt><dd className="font-semibold text-[#3d2e1e]">{chart.menhChu}</dd>
            <dt className="font-medium text-[#8a755b]">Thân chủ</dt><dd className="font-semibold text-[#3d2e1e]">{chart.thanChu}</dd>
            <dt className="font-medium text-[#8a755b]">Xem năm</dt><dd className="font-semibold text-son">{chart.year} ({chart.yearlyNow.stem} {chart.yearlyNow.branch}) · {chart.nominalAge} tuổi</dd>
          </dl>
        </div>
      </div>
      </div>
    </div>
  );
}
