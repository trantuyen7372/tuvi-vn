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
        if(!res.ok&&[401,403,404].includes(res.status)){if(!stopped){setOrder(undefined);setError(data.error);if(res.status===401)location.replace('/dang-nhap?next='+encodeURIComponent('/don-hang/'+token));}return;}
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
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border border-[#d8c5a6] border-t-4 border-t-son bg-gradient-to-b from-[#fffefc] to-[#fcf7ed] p-6 sm:p-8 shadow-[0_14px_38px_rgba(68,44,18,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ebdcc7] pb-4">
          <div>
            <p className="site-eyebrow">TRẠNG THÁI GIAO DỊCH</p>
            <h1 className="font-serif text-2xl font-bold text-son sm:text-3xl">
              {order ? labels[order.status] || order.status : 'Đang tải đơn hàng…'}
            </h1>
          </div>
          {order && (
            <span className="rounded-full bg-[#f4ead6] border border-[#d9c5a3] px-3.5 py-1 text-xs font-semibold text-[#6d573b]">
              Đơn #{order.code}
            </span>
          )}
        </div>

        {order && (
          <div className="mt-5 space-y-5">
            <div className="rounded-xl border border-[#e5d8c1] bg-[#fffdf9] p-4 text-sm text-[#443627]">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-[#7c6952]">Tổng thanh toán:</span>
                <span className="font-serif text-2xl font-bold text-son">{money(order.amount)}</span>
              </div>
              {order.input && (
                <p className="mt-2 text-xs text-[#7c6952] border-t border-[#f2e7d7] pt-2">
                  Bài cho: <b>{order.input.name || 'lá số đã chọn'}</b> · Năm xem <b>{order.input.year}</b>
                </p>
              )}
            </div>

            {order.status === 'pending' && (
              <>
                <div className="rounded-xl border border-[#eed7bd] bg-[#fff6e6] p-4 text-center">
                  <p role="timer" aria-live="off" className="font-bold text-base text-son">
                    {remaining > 0
                      ? `⏱ Thời gian còn lại: ${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`
                      : 'Đã hết thời gian giữ đơn. Đang kiểm tra trạng thái; không chuyển thêm.'}
                  </p>
                  <p className="mt-1 text-xs text-[#7c6952]">
                    Đơn hết hạn lúc {new Date(order.expires).toLocaleString('vi-VN')}. Chuyển đúng số tiền và nội dung có sẵn trong mã QR.
                  </p>
                </div>

                {remaining > 0 && order.qrImage && (
                  <div className="rounded-xl border border-[#e2d5c0] bg-white p-5 text-center shadow-xs">
                    <img className="mx-auto w-64 rounded-lg border border-[#eee5d5] p-2 shadow-xs" src={order.qrImage} alt="Mã QR thanh toán đơn hàng" />
                    <div className="mt-4">
                      <a className="btn-outline inline-block" href={order.qrImage} download={`QR-tuvi-${order.code}.png`}>
                        Tải ảnh QR
                      </a>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-[#7c6952]">
                      Dùng cùng điện thoại: tải ảnh QR rồi chọn ảnh trong ứng dụng ngân hàng nếu ứng dụng hỗ trợ. Kiểm tra người nhận, số tiền và nội dung trước khi xác nhận.
                    </p>
                  </div>
                )}

                {remaining > 0 && order.transfer && (
                  <div className="space-y-3 rounded-xl border border-[#d9c7a3] bg-[#fffdfa] p-4 text-sm">
                    <div className="flex items-center justify-between border-b border-[#f2e7d7] pb-2">
                      <span className="text-xs text-[#7c6952]">Mã ngân hàng</span>
                      <b className="font-mono text-[#332516]">{order.transfer.bankBin}</b>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#7c6952]">Số tài khoản</span>
                        <b className="font-mono text-base text-[#332516]">{order.transfer.accountNumber}</b>
                      </div>
                      <button
                        className="btn-outline mt-1.5 w-full text-xs"
                        onClick={() => void copy(order.transfer!.accountNumber, 'số tài khoản')}
                      >
                        Sao chép số tài khoản
                      </button>
                    </div>
                    {order.transfer.description && (
                      <div className="border-t border-[#f2e7d7] pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#7c6952]">Nội dung</span>
                          <b className="font-mono text-sm text-son">{order.transfer.description}</b>
                        </div>
                        <button
                          className="btn-outline mt-1.5 w-full text-xs"
                          onClick={() => void copy(order.transfer!.description!, 'nội dung chuyển khoản')}
                        >
                          Sao chép nội dung
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {copied && (
                  <p role="status" className="rounded-lg bg-[#eaf7ee] border border-[#bee6ca] p-2 text-center text-xs font-medium text-[#166534]">
                    {copied}
                  </p>
                )}

                {remaining > 0 && order.checkoutUrl && (
                  <a className="btn block text-center" href={order.checkoutUrl} target="_blank" rel="noreferrer">
                    Mở thanh toán PayOS
                  </a>
                )}

                {order.provider === 'mock' && (
                  <p className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 leading-relaxed">
                    Đơn thử, không chuyển tiền. Quản trị xác nhận trong trang quản trị để kiểm tra luồng.
                  </p>
                )}

                <p className="text-xs text-[#8a755d] leading-relaxed">
                  Trang tự kiểm tra trạng thái. Việc quay lại từ trang thanh toán không thay thế xác nhận giao dịch.
                </p>
              </>
            )}

            {order.status === 'expired' && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-950">
                Đơn đã quá 30 phút. Nếu đã chuyển tiền, hãy liên hệ hỗ trợ kèm mã đơn để đối soát; không chuyển thêm.
              </div>
            )}

            {order.status === 'paid' && (
              <div className="space-y-4">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
                  <p>
                    Còn <b>{order.credits}</b> lượt. Email nhận kết quả: {order.email}.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="btn" disabled={busy} onClick={() => void open()}>
                    {busy ? 'Đang mở…' : 'Mở luận giải lá số đã đặt'}
                  </button>
                  <a className="btn-outline" href="/">
                    Lập lá số khác để dùng lượt
                  </a>
                </div>
              </div>
            )}

            <p className="text-xs text-[#8a755d] border-t border-[#ebdcc7] pt-3 leading-relaxed">
              Đơn hàng và bài luận được lưu trong tài khoản. Bạn cần đăng nhập đúng tài khoản sở hữu để xem lại và dùng lượt còn lại.
            </p>

            {order.readings.map((r) => (
              <a key={r.token} className="block text-sm text-son underline font-medium" href={`/luan-giai/${r.token}`}>
                Xem bài luận đã tạo ({r.status}) →
              </a>
            ))}
          </div>
        )}

        {error && <p role="alert" className="mt-4 text-sm text-son">{error}</p>}
      </div>
    </main>
  );
}
