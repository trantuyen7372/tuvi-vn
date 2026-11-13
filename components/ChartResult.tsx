'use client';
import {useRef,useState} from 'react';
import ChartBoard from './ChartBoard';
import Reading from './Checkout';
import PatternsCard from './PatternsCard';
import StarNotes from './StarNotes';
import FreePreview from './FreePreview';
import StarCatalogSheet from './StarCatalogSheet';
import type {ChartView} from '@/lib/tuvi';
import {FIVE_ELEMENTS,starElement} from '@/lib/five-elements';
import {TrackChartCreated} from './FunnelTracker';

function PalaceDetail({ chart, name }: { chart: ChartView; name: string | null }) {
  const p = chart.palaces.find((x) => x.name === name);
  if (!p) return <p className="text-sm text-[#8a7a62]">Bấm vào một cung trên lá số để xem chi tiết.</p>;
  return (
    <div className="text-sm">
      <div className="flex items-center justify-between border-b border-[#eadbc0] pb-2 mb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c6729]">Cung Vị Đang Chọn</span>
          <h3 className="font-serif text-xl font-bold text-son">Cung {p.name} · {p.stem} {p.branch}</h3>
        </div>
        {p.isBody && <span className="rounded bg-son px-2 py-0.5 text-xs font-semibold text-white shadow-sm">Thân cư</span>}
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-xs font-bold text-[#63503b] block mb-1">Chính tinh:</span>
          {p.major.length ? (
            <div className="flex flex-wrap gap-1.5">
              {p.major.map((s) => {
                const el = starElement(s.name);
                const elStyle = el ? FIVE_ELEMENTS[el] : null;
                return (
                  <span
                    key={s.name}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#dfceb1] bg-white px-2.5 py-1 text-xs font-bold shadow-sm"
                    style={{ color: elStyle ? elStyle.color : '#8f1818' }}
                  >
                    <span>{s.name}</span>
                    {s.brightness && <span className="text-[10px] font-semibold text-[#8a7a62]">({s.brightness})</span>}
                    {s.mutagen && <span className="rounded bg-son px-1 text-[9px] font-bold text-white leading-4">Hóa {s.mutagen}</span>}
                  </span>
                );
              })}
            </div>
          ) : (
            <span className="inline-block rounded-md bg-[#faf3e6] px-2.5 py-1 text-xs italic text-[#8a7a62]">Vô chính diệu (mượn sao cung xung chiếu)</span>
          )}
        </div>

        {p.minor.length > 0 && (
          <div>
            <span className="text-xs font-bold text-[#63503b] block mb-1">Phụ tinh:</span>
            <div className="flex flex-wrap gap-1">
              {p.minor.map((s) => {
                const el = starElement(s.name);
                const elStyle = el ? FIVE_ELEMENTS[el] : null;
                return (
                  <span
                    key={s.name}
                    className="inline-flex items-center gap-1 rounded-md border border-[#e5d8c1] bg-[#fffdfa] px-2 py-0.5 text-[11px] font-medium"
                    style={{ color: elStyle ? elStyle.color : '#5c4a35' }}
                  >
                    <span>{s.name}</span>
                    {s.brightness && <span className="text-[9px] text-[#8a7a62]">({s.brightness})</span>}
                    {s.mutagen && <span className="rounded bg-son px-1 text-[8.5px] font-bold text-white">Hóa {s.mutagen}</span>}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {p.adjective.length > 0 && (
          <div>
            <span className="text-xs font-bold text-[#63503b] block mb-1">Tạp diệu:</span>
            <div className="flex flex-wrap gap-1">
              {p.adjective.map((s) => (
                <span key={s.name} className="rounded bg-[#f5ede0] border border-[#e8ddcb] px-1.5 py-0.5 text-[10px] text-[#6b5842]">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 border-t border-[#eadbc0] pt-2 text-xs">
          <div><span className="text-[#8a7a62]">Tràng sinh:</span> <b className="text-[#3b2d1f]">{p.changsheng}</b></div>
          <div><span className="text-[#8a7a62]">Bác sĩ:</span> <b className="text-[#3b2d1f]">{p.boshi}</b></div>
          <div><span className="text-[#8a7a62]">Đại hạn:</span> <b className="text-son">{p.decadal[0]}–{p.decadal[1]} tuổi</b>{p.isDecadalNow ? ' (đang đi)' : ''}</div>
          {p.yearlyName && <div><span className="text-[#8a7a62]">Lưu niên:</span> <b className="text-[#b5894c]">{p.yearlyName}</b></div>}
        </div>
      </div>

      <a className="mt-4 block rounded-lg border border-[#d9c7a3] bg-gradient-to-r from-[#fffdfa] to-[#fbf4e6] p-3 text-son font-medium underline shadow-sm transition-colors hover:border-[#b5894c]" href="#mo-bai-luan">
        Xem cách luận tổ hợp sao tại {p.name} cùng các lớp hạn →
      </a>
      <StarNotes palace={p.name} stars={p.major.map((s) => s.name)} />
    </div>
  );
}

export default function ChartResult({chart}:{chart:ChartView}){
  const [selected,setSelected]=useState<string|null>('Mệnh');
  const dialog=useRef<HTMLDialogElement>(null);
  const menh=chart.palaces.find(p=>p.name==='Mệnh');
  const body=chart.palaces.find(p=>p.isBody);
  const decade=chart.palaces.find(p=>p.isDecadalNow);

  return (
    <main className="chart-page mx-auto max-w-6xl px-4 py-6">
      <TrackChartCreated/><div className="chart-page-heading no-print"><div><p className="site-eyebrow">LÁ SỐ CỦA BẠN</p><h1>Khám phá lá số Tử Vi</h1></div><p>Chọn một cung để xem các sao và lớp vận hạn.</p></div>
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
        <a href="/" className="btn-outline">← Lập lá số khác</a><a href="#mo-bai-luan" className="btn">Đọc luận giải của tôi →</a>
        <div className="text-xs text-[#8a7a62]">
          Viền vàng: cung Lưu niên Mệnh năm {chart.year} · Số đỏ: đại hạn đang đi
        </div>
      </div>
      <section className="chart-overview" aria-labelledby="chart-overview-title">
        <p className="site-eyebrow">BẮT ĐẦU ĐỌC LÁ SỐ</p><h2 id="chart-overview-title">Nhìn nhanh lá số của bạn</h2>
        <dl><div><dt>Cung Mệnh</dt><dd>{menh?.major.length?menh.major.map(s=>s.name).join(', '):'Vô chính diệu'}{menh&&<span>Tại {menh.branch}</span>}</dd></div><div><dt>Thân cư</dt><dd>{body?.name||'—'}<span>Đọc cùng cung Mệnh</span></dd></div><div><dt>Đại hạn năm {chart.year}</dt><dd>{decade?`${decade.decadal[0]}–${decade.decadal[1]} tuổi`:'Chưa có trong phạm vi lá số'}{decade&&<span>Tại cung {decade.name}</span>}</dd></div></dl>
        <p>Đây là các mốc trên lá số. Đọc phần tổng quan bên dưới để hiểu cách các sao và cung phối hợp.</p>
      </section>
      <div className="chart-tools no-print"><p>Vuốt ngang để xem đủ 12 cung. Chọn một cung để đọc chi tiết bên dưới.</p><button type="button" className="btn-outline" onClick={()=>dialog.current?.showModal()} aria-haspopup="dialog">Phóng to lá số <span aria-hidden="true">⤢</span></button></div>
      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ChartBoard chart={chart} selected={selected} onSelect={setSelected} />
        <aside className="chart-detail no-print">
          <PalaceDetail chart={chart} name={selected} />
        </aside>
      </div>
      <StarCatalogSheet chart={chart} />
      <div className="mt-6"><FreePreview input={chart.input}/></div>
      <div id="mo-bai-luan" tabIndex={-1} className="mt-6 scroll-mt-5"><Reading input={chart.input}/></div>
      <div className="mt-6"><PatternsCard patterns={chart.patterns}/></div>
      <dialog ref={dialog} className="chart-dialog" aria-labelledby="expanded-chart-title" onClick={event=>{if(event.target===event.currentTarget||(event.target instanceof Element&&event.target.closest('a[href^="#"]')))dialog.current?.close();}}>
        <div className="chart-dialog-heading"><div><h2 id="expanded-chart-title">Lá số 12 cung</h2><p>Vuốt ngang để xem các cung. Chọn cung để đọc chi tiết ngay bên dưới.</p></div><button type="button" className="btn-outline" onClick={()=>dialog.current?.close()} autoFocus>Đóng <span aria-hidden="true">×</span></button></div>
        <ChartBoard chart={chart} selected={selected} onSelect={setSelected}/>
        <div className="chart-detail"><PalaceDetail chart={chart} name={selected}/></div>
      </dialog>
    </main>
  );
}
