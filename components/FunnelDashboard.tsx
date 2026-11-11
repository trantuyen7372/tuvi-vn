import {money} from '@/lib/commerce/config';
import type {FunnelEvent,FunnelSource,funnelReport} from '@/lib/funnel';
type Report=ReturnType<typeof funnelReport>;
const labels:Record<FunnelEvent,string>={visit:'Vào website',chart_created:'Lập lá số',preview_view:'Xem phần đọc thử',pricing_view:'Xem bảng giá',order_created:'Tạo đơn',purchase:'Thanh toán được xác nhận',reading_opened:'Mở bài hoàn chỉnh'};
const sources:Record<FunnelSource,string>={direct:'Trực tiếp / nội bộ',google:'Google',facebook:'Facebook',tiktok:'TikTok',zalo:'Zalo',email:'Email',other:'Nguồn khác'};
const products:Record<string,string>={single:'1 lá số',family:'Gia đình',deep:'Chuyên sâu'};

export default function FunnelDashboard({report}:{report:Report|null|undefined}) {
  if(!report)return <section className="rounded-xl border border-[#d9c7a3] bg-white p-5"><h2 className="text-xl font-bold">Hành trình mua và doanh thu</h2><p className="mt-3 text-sm">Chưa lấy được thống kê hành trình. Đơn hàng và thanh toán vẫn hoạt động độc lập.</p></section>;
  const total=report.steps.find(step=>step.event==='visit')?.visits||0;
  return <section className="rounded-xl border border-[#d9c7a3] bg-white p-5">
    <h2 className="text-xl font-bold">Hành trình mua và doanh thu</h2>
    {!report.enabled&&<p className="mt-3 text-sm text-son">Đang tắt thu thập hành trình. Dữ liệu thanh toán vẫn lấy từ đơn hàng được xác nhận.</p>}
    <p className="mt-2 text-sm text-[#6b5b45]">Dùng bộ lọc ngày ở trên. Hành trình tính theo các phiên bắt đầu trong khoảng đã chọn, lưu tối đa {report.retentionDays} ngày. Khách có thể bỏ qua bước; các hàng không phải chuỗi bắt buộc.</p>
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[
      ['Phiên được đo',String(total)],['Đơn trả tiền được xác nhận',String(report.payments.paidOrders)],['Doanh thu sau hoàn tiền',money(report.payments.net)],['Đã ghi nhận hoàn tiền',money(report.payments.refunded)],
    ].map(([title,value])=><div key={title} className="rounded-lg bg-[#fbf6ec] p-4"><p className="text-sm text-[#6b5b45]">{title}</p><p className="mt-2 break-words text-2xl font-bold text-son">{value}</p></div>)}</div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2"><div><h3 className="font-bold">Từ lượt vào đến mở bài</h3><ol className="mt-4 space-y-3">{report.steps.map(step=>{
      const percent=total?Math.round(step.visits/total*1000)/10:0;
      return <li key={step.event}><div className="flex justify-between gap-3 text-sm"><span>{labels[step.event]}</span><span className="whitespace-nowrap font-semibold">{step.visits} · {total?`${percent}%`:'—'}</span></div><div className="mt-1 h-2 overflow-hidden rounded-full bg-[#f0e7d5]"><div className="h-full rounded-full bg-son" style={{width:`${Math.min(percent,100)}%`}}/></div></li>;
    })}</ol><p className="mt-4 text-xs leading-relaxed text-[#6b5b45]">Mỗi bước chỉ tính một lần trong phiên. Lượt xem có thể thiếu khi chặn đo lường hoặc tắt JavaScript. Tạo đơn, thanh toán và mở bài được ghi từ máy chủ; đơn mô phỏng, lượt tặng và đơn 0đ không tính là doanh thu.</p></div>
      <div><h3 className="font-bold">Nguồn mang tới phiên truy cập</h3>{report.sources.length?<div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{['Nguồn','Phiên','Lập lá số','Tạo đơn','Trả tiền'].map(label=><th key={label} className="border-b p-2">{label}</th>)}</tr></thead><tbody>{report.sources.map(row=><tr key={row.source}><td className="border-b p-2">{sources[row.source]}</td><td className="border-b p-2">{row.visits}</td><td className="border-b p-2">{row.charts}</td><td className="border-b p-2">{row.orders}</td><td className="border-b p-2">{row.purchases}</td></tr>)}</tbody></table></div>:<p className="mt-4 text-sm">Chưa có phiên được đo trong khoảng này. Thống kê bắt đầu từ khi bản cập nhật được triển khai.</p>}
      <p className="mt-3 text-xs leading-relaxed text-[#6b5b45]">Nguồn là lần đầu vào trong phiên; không lưu URL đầy đủ. Dùng utm_source=google, facebook, tiktok, zalo hoặc email để phân biệt kênh.</p>
      <h3 className="mt-6 font-bold">Gói đã được trả tiền</h3>{report.products.length?<ul className="mt-3 space-y-2 text-sm">{report.products.map(row=><li key={row.product}>{products[row.product]||row.product}: {row.paidOrders} đơn · còn {money(row.net)} sau hoàn tiền</li>)}</ul>:<p className="mt-3 text-sm">Chưa có đơn trả tiền được xác nhận trong khoảng này.</p>}</div></div>
    <p className="mt-5 border-t border-[#d9c7a3] pt-4 text-xs leading-relaxed text-[#6b5b45]">Tiền tính theo ngày giao dịch được xác nhận, kể cả khi trình duyệt không gửi sự kiện. Số đơn và số phiên trả tiền có thể khác nhau. Doanh thu chưa trừ phí thanh toán, AI, hạ tầng và hỗ trợ.</p>
  </section>;
}
