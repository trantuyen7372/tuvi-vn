'use client';
import { useEffect, useState } from 'react';
import { money } from '@/lib/commerce/config';
interface OrderView { code: number; amount: number; product: string; email: string; status: string; expires: number; credits: number; provider: string; checkoutUrl: string; qrImage?: string; input?:{name?:string;year?:number}; transfer?:{accountNumber:string;bankBin:string;description?:string}|null; readings: { token: string; status: string }[] }
const labels: Record<string,string> = { pending: 'Chờ chuyển khoản', paid: 'Đã thanh toán', expired: 'Đơn đã hết hạn', failed: 'Chưa tạo được thanh toán', refunded: 'Đã ghi nhận hoàn tiền', cancelled: 'Đã hủy' };
export default function OrderStatus({ token }: { token: string }) {
  const [order, setOrder] = useState<OrderView>(), [error, setError] = useState(''), [busy, setBusy] = useState(false),[now,setNow]=useState(Date.now()),[copied,setCopied]=useState('');
  useEffect(()=>{if(order?.status!=='pending')return;const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer);},[order?.status]);
  async function copy(value:string,label:string){try{await navigator.clipboard.writeText(value);setCopied('Đã sao chép '+label);}catch{setCopied('Chưa sao chép được tự động. Bạn có thể chọn và sao chép thông tin hiển thị.');}}
  const remaining=order?Math.max(0,Math.ceil((order.expires-now)/1000)):0;
  useEffect(() => {
    let stopped = false, timer: ReturnType<typeof setTimeout>;
    async function load() {
      try { const res = await fetch(`/api/orders/${token}`, { cache: 'no-store' }); const data = await res.json();
        if (!res.ok) throw new Error(data.error); if (stopped) return;
        setOrder(data);setNow(Date.now()); setError(''); if (data.status === 'paid') try { localStorage.setItem('tuvi-order', token); } catch {}
        if (data.status === 'pending') timer = setTimeout(load, 3000);
      } catch (e) { if (!stopped) { setError((e as Error).message); timer = setTimeout(load, 10000); } }
    }
    void load(); return () => { stopped = true; clearTimeout(timer); };
  }, [token]);
  async function open() {
    setBusy(true); setError('');
    try { const res = await fetch('/api/readings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderToken: token }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error); location.assign(data.url);
    } catch (e) { setError((e as Error).message); setBusy(false); }
  }
  // Tự mở bài của lá số đã đặt sau khi webhook xác nhận, kể cả tải lại trang.
  useEffect(() => { if (order?.status === 'paid' && !order.readings.length) void open(); }, [order?.status]); // eslint-disable-line react-hooks/exhaustive-deps
  return <main className="mx-auto max-w-2xl px-4 py-10"><div className="rounded-xl border border-[#d9c7a3] bg-white p-6">
    <h1 className="font-serif text-2xl font-bold text-son">{order ? labels[order.status] || order.status : 'Đang tải đơn hàng…'}</h1>
    {order && <div className="mt-4 space-y-4"><p>Đơn <b>{order.code}</b> · <b>{money(order.amount)}</b></p>
      {order.input&&<p>Bài cho <b>{order.input.name||'lá số đã chọn'}</b> · Năm xem <b>{order.input.year}</b></p>}
      {order.status === 'pending' && <><p role="timer" aria-live="off" className="font-bold text-son">{remaining>0?`Thời gian còn lại: ${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`:'Đã hết thời gian giữ đơn. Đang kiểm tra trạng thái; không chuyển thêm.'}</p><p>Đơn hết hạn lúc {new Date(order.expires).toLocaleString('vi-VN')}. Chuyển đúng số tiền và nội dung có sẵn trong mã QR.</p>
        {remaining>0&&order.qrImage&&<><img className="mx-auto w-64" src={order.qrImage} alt="Mã QR thanh toán đơn hàng"/><a className="btn-outline" href={order.qrImage} download={`QR-tuvi-${order.code}.png`}>Tải ảnh QR</a><p className="text-sm">Dùng cùng điện thoại: tải ảnh QR rồi chọn ảnh trong ứng dụng ngân hàng nếu ứng dụng hỗ trợ. Kiểm tra người nhận, số tiền và nội dung trước khi xác nhận.</p></>}
        {remaining>0&&order.transfer&&<div className="space-y-2 rounded-lg border border-[#d9c7a3] p-3 text-sm"><p>Mã ngân hàng: {order.transfer.bankBin}</p><p className="break-all">Số tài khoản: <b>{order.transfer.accountNumber}</b></p><button className="btn-outline" onClick={()=>void copy(order.transfer!.accountNumber,'số tài khoản')}>Sao chép số tài khoản</button>{order.transfer.description&&<><p className="break-all">Nội dung: <b>{order.transfer.description}</b></p><button className="btn-outline" onClick={()=>void copy(order.transfer!.description!,'nội dung chuyển khoản')}>Sao chép nội dung</button></>}</div>}
        {copied&&<p role="status" className="text-sm">{copied}</p>}
        {remaining>0&&order.checkoutUrl && <a className="btn" href={order.checkoutUrl} target="_blank" rel="noreferrer">Mở thanh toán PayOS</a>}
        {order.provider === 'mock' && <p className="rounded bg-amber-50 p-3">Đơn thử, không chuyển tiền. Quản trị xác nhận trong trang quản trị để kiểm tra luồng.</p>}
        <p className="text-sm">Trang tự kiểm tra trạng thái. Việc quay lại từ trang thanh toán không thay thế xác nhận giao dịch.</p></>}
      {order.status === 'expired' && <p>Đơn đã quá 30 phút. Nếu đã chuyển tiền, hãy liên hệ hỗ trợ kèm mã đơn để đối soát; không chuyển thêm.</p>}
      {order.status === 'paid' && <><p>Còn <b>{order.credits}</b> lượt. Email nhận kết quả: {order.email}.</p><button className="btn" disabled={busy} onClick={() => void open()}>{busy ? 'Đang mở…' : 'Mở luận giải lá số đã đặt'}</button>
        <a className="btn-outline ml-2" href="/">Lập lá số khác để dùng lượt</a></>}
      <p className="text-sm">Hãy lưu đường link này để xem lại đơn và dùng các lượt còn lại. Giữ kín link vì có thông tin cá nhân.</p>
      {order.readings.map(r => <a key={r.token} className="block underline" href={`/luan-giai/${r.token}`}>Xem bài luận đã tạo ({r.status})</a>)}
    </div>}{error && <p role="alert" className="mt-4 text-son">{error}</p>}
  </div></main>;
}
