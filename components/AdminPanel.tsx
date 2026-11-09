'use client';
import { useState } from 'react';
import { money } from '@/lib/commerce/config';
interface AdminOrder { id: string; code: number; email: string; product: string; amount: number; status: string; remaining: number; provider: string; created: number; reading_tokens: string | null }
interface Payment { id: string; order_code: number; amount: number; reason: string }
interface PaymentConfiguration {provider:string;enabled:boolean;configurationComplete:boolean;checks:{field:string;label:string;configured:boolean}[];webhookUrl:string|null;confirmedAt:number|null;canConfirmWebhook:boolean}
interface Dashboard { orders: AdminOrder[]; revenue: {day:string;revenue:number;orders:number}[]; monthly:{month:string;revenue:number}[]; usage:{known_cost:number;calls:number;unknown_cost_calls:number}; payments:Payment[]; coupons:{code:string;percent:number;max_uses:number}[]; emailFailures:{id:string;email_status:string}[];paymentConfiguration?:PaymentConfiguration }
export default function AdminPanel() {
  const [data, setData] = useState<Dashboard>(), [password,setPassword]=useState(''), [error,setError]=useState(''), [notice,setNotice]=useState('');
  const [status,setStatus]=useState(''), [from,setFrom]=useState(''), [to,setTo]=useState('');
  const [code,setCode]=useState(''), [percent,setPercent]=useState(100), [maxUses,setMaxUses]=useState(1), [days,setDays]=useState(7), [busy,setBusy]=useState(false), [recoveredLink,setRecoveredLink]=useState('');
  const query = new URLSearchParams({status,from,to}).toString();
  async function load() {
    setError('');
    try { const response=await fetch(`/api/admin?${query}`,{cache:'no-store'}), result=await response.json();
      if(!response.ok)throw Error(result.error);setData(result);
    }catch(e){setError((e as Error).message);}
  }
  async function login() {
    setError('');setBusy(true);
    try {const response=await fetch('/api/admin/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});const result=await response.json();if(!response.ok)throw Error(result.error);setPassword('');await load();}
    catch(e){setError((e as Error).message);}finally{setBusy(false);}
  }
  async function action(payload: Record<string,unknown>) {
    setBusy(true);setError('');setNotice('');setRecoveredLink('');
    try {const response=await fetch('/api/admin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const result=await response.json();if(!response.ok)throw Error(result.error);setNotice(result.message||'Đã lưu thao tác.');if(result.url)setRecoveredLink(location.origin+result.url);await load();}
    catch(e){setError((e as Error).message);}finally{setBusy(false);}
  }
  return <main className="mx-auto max-w-6xl space-y-6 px-4 py-10"><h1 className="font-serif text-3xl font-bold text-son">Quản trị thanh toán</h1>
    {!data ? <form className="max-w-md space-y-3" onSubmit={e=>{e.preventDefault();void login();}}><label>Mật khẩu quản trị<input type="password" className="input mt-1" required value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" /></label><button disabled={busy} className="btn">Đăng nhập</button><button type="button" className="btn-outline ml-2" onClick={()=>void load()}>Dùng phiên đang có</button></form> : <>
      <div className="flex flex-wrap gap-3"><label>Trạng thái<select className="input" value={status} onChange={e=>setStatus(e.target.value)}><option value="">Tất cả</option>{['pending','paid','expired','failed','refunded','cancelled'].map(s=><option key={s}>{s}</option>)}</select></label><label>Từ ngày<input className="input" type="date" value={from} onChange={e=>setFrom(e.target.value)} /></label><label>Đến ngày<input className="input" type="date" value={to} onChange={e=>setTo(e.target.value)} /></label>
        <button className="btn self-end" onClick={()=>void load()}>Lọc</button><a className="btn-outline self-end" href={`/api/admin?${query}&format=csv`}>Xuất CSV</a>
        <button className="btn-outline self-end" onClick={async()=>{await fetch('/api/admin/session',{method:'DELETE'});setData(undefined);}}>Đăng xuất</button></div>
      {data.paymentConfiguration&&<section className="rounded-xl border border-[#d9c7a3] bg-white p-4"><h2 className="text-xl font-bold">Kết nối thanh toán PayOS</h2>
        <p className="mt-2">{data.paymentConfiguration.enabled?'Đang bật nhận thanh toán.':'Đang tắt nhận thanh toán.'} Kênh: {data.paymentConfiguration.provider==='payos'?'PayOS':'Mô phỏng'}.</p>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">{data.paymentConfiguration.checks.map(check=><li key={check.field}>{check.configured?'✓ Đã cấu hình':'○ Còn thiếu'}: {check.label} <code>({check.field})</code></li>)}</ul>
        <p className="mt-3 text-sm">Điền các mục còn thiếu trong .env.local trên máy chạy website và khởi động lại ứng dụng. Trang này không hiển thị giá trị khóa.</p>
        {data.paymentConfiguration.webhookUrl&&<p className="mt-3 break-all text-sm">Webhook: <code>{data.paymentConfiguration.webhookUrl}</code></p>}
        <p className="mt-2 text-sm">{data.paymentConfiguration.confirmedAt?'Đã xác minh qua trang quản trị lúc '+new Date(data.paymentConfiguration.confirmedAt).toLocaleString('vi-VN'): 'Chưa có xác nhận webhook cho kênh và tên miền này trong trang quản trị.'}</p>
        <button className="btn-outline mt-3" disabled={busy||data.paymentConfiguration.provider!=='payos'||!data.paymentConfiguration.canConfirmWebhook} onClick={()=>void action({action:'confirm-payos-webhook'})}>Xác minh và đăng ký webhook PayOS</button>
        <p className="mt-2 text-sm">PayOS sẽ gửi một webhook kiểm tra tới website. Thao tác này cập nhật địa chỉ webhook của kênh, không tạo đơn hoặc chuyển tiền. Chỉ bật PAYMENTS_ENABLED=1 sau khi hoàn tất cấu hình và kiểm thử giao dịch.</p>
      </section>}
      <section className="rounded-xl border bg-white p-4"><h2 className="text-xl font-bold">Doanh thu và AI</h2>
        <p>Chi phí AI đã có đơn giá: {money(data.usage.known_cost)} · {data.usage.calls} lần gọi · {data.usage.unknown_cost_calls || 0} lần chưa có đơn giá.</p><p className="text-sm">Đơn giá API là số bạn cấu hình để ước tính; cần đối chiếu hóa đơn nhà cung cấp. Đơn ghi nhận hoàn tiền được loại khỏi doanh thu.</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2"><div><h3 className="font-bold">Theo tháng</h3>{data.monthly.map(r=><p key={r.month}>{r.month}: {money(r.revenue)}</p>)}</div><div><h3 className="font-bold">Theo ngày</h3>{data.revenue.slice(0,31).map(r=><p key={r.day}>{r.day}: {money(r.revenue)} ({r.orders} đơn)</p>)}</div></div></section>
      <section><h2 className="mb-3 text-xl font-bold">Đơn hàng (tối đa 200 đơn gần nhất)</h2><div className="overflow-x-auto"><table className="w-full bg-white text-left text-sm"><thead><tr>{['Mã / email','Gói / tiền','Trạng thái / lượt','Thao tác'].map(h=><th className="border p-3" key={h}>{h}</th>)}</tr></thead><tbody>{data.orders.map(o=><tr key={o.id}><td className="border p-3">{o.code}<br/>{o.email}<br/><small>{new Date(o.created).toLocaleString('vi-VN')}</small></td><td className="border p-3">{o.product}<br/>{money(o.amount)}</td><td className="border p-3">{o.status}<br/>Còn {o.remaining} lượt</td><td className="space-y-2 border p-3">
        {o.provider==='mock' && ['pending','expired'].includes(o.status) && <button className="btn-outline" disabled={busy} onClick={()=>void action({action:'confirm-test',orderId:o.id})}>Xác nhận đơn thử</button>}
        {o.status==='paid' && <><button className="btn-outline" disabled={busy} onClick={()=>{const count=prompt('Tặng bao nhiêu lượt? (1–20)','1');if(count)void action({action:'grant',orderId:o.id,count:Number(count)});}}>Tặng lượt</button>{' '}<button className="btn-outline" disabled={busy} onClick={()=>{const reason=prompt('Chỉ ghi nhận sau khi bạn đã hoàn tiền bên ngoài hệ thống. Nhập lý do và thông tin đối soát:');if(reason)void action({action:'refund',orderId:o.id,reason});}}>Ghi nhận đã hoàn tiền</button></>}
        {o.reading_tokens?.split(',').map((t,i)=><a key={t} href={`/luan-giai/${t}`} target="_blank" rel="noreferrer" className="block underline">Xem kết quả {i+1}</a>)}
        {o.status==='paid'&&o.email!=='da-xoa'&&<button className="btn-outline" disabled={busy} onClick={()=>{const reason=prompt('Chỉ cấp lại sau khi xác minh chủ đơn qua email và giao dịch. Link đơn cũ sẽ mất hiệu lực; link bài luận giữ nguyên. Nhập căn cứ xác minh:');if(reason)void action({action:'recover-link',orderId:o.id,reason});}}>Cấp lại link đơn</button>}
        <button className="text-son underline" disabled={busy} onClick={()=>{const reason=prompt('Xóa ngày giờ sinh, email và bài luận của đơn này theo yêu cầu đã xác minh. Nhập lý do:');if(reason)void action({action:'erase',orderId:o.id,reason});}}>Xóa thông tin cá nhân</button>
      </td></tr>)}</tbody></table></div></section>
      <section className="rounded-xl border bg-white p-4"><h2 className="text-xl font-bold">Tạo mã giảm giá</h2><form className="mt-3 flex flex-wrap gap-3" onSubmit={e=>{e.preventDefault();void action({action:'coupon',code,percent,maxUses,days});}}>
        <label>Mã<input className="input" required value={code} onChange={e=>setCode(e.target.value)} pattern="[A-Za-z0-9_-]{3,32}" /></label><label>Giảm (%)<input className="input" type="number" min="1" max="100" value={percent} onChange={e=>setPercent(+e.target.value)} /></label><label>Số lần dùng<input className="input" type="number" min="1" max="10000" value={maxUses} onChange={e=>setMaxUses(+e.target.value)} /></label><label>Hiệu lực (ngày)<input className="input" type="number" min="1" max="365" value={days} onChange={e=>setDays(+e.target.value)} /></label><button className="btn self-end" disabled={busy}>Tạo mã</button></form>
        {data.coupons.map(c=><p key={c.code} className="mt-2">{c.code}: giảm {c.percent}%, tối đa {c.max_uses} lần</p>)}</section>
      <section><h2 className="text-xl font-bold">Giao dịch cần đối soát</h2>{!data.payments.length && <p>Không có giao dịch chờ.</p>}{data.payments.map(p=><div key={p.id} className="mt-2 rounded border bg-white p-3"><p>{p.id} · đơn {p.order_code} · {money(p.amount)} · {p.reason}</p><button className="btn-outline mt-2" disabled={busy} onClick={()=>{const order=data.orders.find(o=>o.code===p.order_code);if(!order){setError('Hãy lọc để tìm đơn tương ứng trước khi đối soát.');return;}const reason=prompt('Đã kiểm tra giao dịch thực nhận đúng mã đơn, đúng số tiền. Nhập lý do chấp nhận:');if(reason)void action({action:'reconcile',orderId:order.id,paymentId:p.id,reason});}}>Chấp nhận sau đối soát</button></div>)}</section>
      <section><h2 className="text-xl font-bold">Email chưa gửi thành công</h2>{data.emailFailures.map(r=><p className="mt-2" key={r.id}>{r.email_status} · <button className="underline" disabled={busy} onClick={()=>void action({action:'resend',readingId:r.id})}>Gửi lại email</button></p>)}</section>
    </>}{error && <p role="alert" className="text-son">{error}</p>}{notice && <p role="status">{notice}</p>}
    {recoveredLink&&<div className="rounded border border-son bg-white p-4"><p>Link đơn mới — chỉ gửi riêng cho chủ đơn đã xác minh. Link đơn cũ đã bị vô hiệu:</p><a className="break-all underline" href={recoveredLink}>{recoveredLink}</a></div>}
  </main>;
}
