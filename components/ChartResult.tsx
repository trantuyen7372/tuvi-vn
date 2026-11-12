'use client';
import {useRef,useState} from 'react';
import ChartBoard from './ChartBoard';
import Reading from './Checkout';
import PatternsCard from './PatternsCard';
import StarNotes from './StarNotes';
import FreePreview from './FreePreview';
import type {ChartView} from '@/lib/tuvi';
import {TrackChartCreated} from './FunnelTracker';

function PalaceDetail({ chart, name }: { chart: ChartView; name: string | null }) {
  const p = chart.palaces.find((x) => x.name === name);
  if (!p) return <p className="text-sm text-[#8a7a62]">Bấm vào một cung trên lá số để xem chi tiết.</p>;
  return (
    <div className="text-sm">
      <h3 className="font-serif text-lg font-bold text-son">Cung {p.name} · {p.stem} {p.branch}</h3>
      <p className="mt-1"><b>Chính tinh:</b> {p.major.length ? p.major.map((s) => `${s.name}${s.brightness ? ` (${s.brightness})` : ''}${s.mutagen ? ` hoá ${s.mutagen}` : ''}`).join(', ') : 'Vô chính diệu'}</p>
      {p.minor.length > 0 && <p><b>Phụ tinh:</b> {p.minor.map((s) => s.name + (s.mutagen ? ` hoá ${s.mutagen}` : '')).join(', ')}</p>}
      {p.adjective.length > 0 && <p><b>Tạp diệu:</b> {p.adjective.map((s) => s.name).join(', ')}</p>}
      <p><b>Tràng sinh:</b> {p.changsheng} · <b>Bác sĩ:</b> {p.boshi}</p>
      <p><b>Đại hạn:</b> {p.decadal[0]} – {p.decadal[1]} tuổi{p.isDecadalNow ? ' (đang đi)' : ''}</p>
      {p.yearlyName && <p><b>Năm {chart.year}:</b> là cung {p.yearlyName} của Lưu niên{p.isYearlyNow ? ' (Lưu niên Mệnh)' : ''}</p>}
      <a className="mt-4 block rounded-lg border border-[#d9c7a3] p-3 text-son underline" href="#mo-bai-luan">Xem cách luận tổ hợp sao tại {p.name} cùng các lớp hạn →</a>
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
