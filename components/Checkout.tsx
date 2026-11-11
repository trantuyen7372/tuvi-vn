'use client';
import { useEffect, useId, useState } from 'react';
import { useRouter,useSearchParams } from 'next/navigation';
import { PRODUCTS, money, familySaving } from '@/lib/commerce/config';
import FunnelSection from './FunnelSection';
import {inputToQuery,type BirthInput} from '@/lib/birth-input';
import {READING_FOCUS,READING_SITUATIONS,type ReadingFocus} from '@/lib/reading-preferences';
export default function Checkout({ input }: { input: BirthInput }) {
  const router = useRouter(), id = useId(),query=useSearchParams();
  const [product, setProduct] = useState<string>(PRODUCTS.some(p=>p.id===query.get('goi'))?query.get('goi')!:'single'), [coupon, setCoupon] = useState('');
  const [focus, setFocus] = useState<string>(input.reading?.focus || ''), [situation, setSituation] = useState<string>(input.reading?.situation || ''), [note, setNote] = useState<string>(input.reading?.note || '');
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [wallet, setWallet] = useState('');
  const [account,setAccount]=useState<{customer:{email:string;verified:boolean}|null;paymentsEnabled:boolean;deepAvailable?:boolean}|null>(null),[message,setMessage]=useState('');
  useEffect(() => { try { setWallet(localStorage.getItem('tuvi-order') || ''); } catch {} }, []);
  useEffect(()=>{fetch('/api/auth/me',{cache:'no-store'}).then(r=>r.json()).then(data=>{setAccount(data);}).catch(()=>setAccount({customer:null,paymentsEnabled:false}));},[]);
  useEffect(()=>{if(account&&!account.deepAvailable&&product==='deep')setProduct('single');},[account,product]);
  const customInput: BirthInput = { ...input, ...(focus ? { reading: { focus: focus as ReadingFocus, ...(situation ? { situation } : {}), ...(note.trim() ? { note: note.trim() } : {}) } } : {}) };
  async function submit(existing = false) {
    if(!account?.customer){router.push('/dang-nhap?next='+encodeURIComponent('/la-so?'+inputToQuery(input)+'&goi='+product));return;}
    if(!account.customer.verified){router.push('/tai-khoan');return;}
    setBusy(true); setError('');
    try {
      const res = await fetch(existing ? '/api/readings' : '/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(existing ? { orderToken: wallet, input: customInput } : { input: customInput, product, coupon }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error);
      router.push(data.url);
    } catch (e) { setError((e as Error).message || 'Không kết nối được máy chủ'); }
    finally { setBusy(false); }
  }
  const preferenceFields = <details className="rounded-lg border border-[#d9c7a3] bg-[#fffaf0] p-4" open={product === 'deep' || !!focus}>
    <summary className="cursor-pointer text-sm font-bold">Chia sẻ vấn đề đang quan tâm để đi sâu hơn (tùy chọn)</summary>
    <div className="mt-3 space-y-3 text-sm">
      <label className="block" htmlFor={id + '-focus'}>Chủ đề trọng tâm
        <select id={id + '-focus'} className="input mt-1" value={focus} onChange={e => { setFocus(e.target.value); setSituation(''); if (!e.target.value) setNote(''); }}>
          <option value="">Đọc tổng thể các cung và vận hạn</option>
          {Object.entries(READING_FOCUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </label>
      {focus && <>
        <label className="block" htmlFor={id + '-sit'}>Hoàn cảnh hiện tại (tùy chọn)
          <select id={id + '-sit'} className="input mt-1" value={situation} onChange={e => setSituation(e.target.value)}>
            <option value="">Không cung cấp</option>
            {Object.entries(READING_SITUATIONS[focus as ReadingFocus]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="block" htmlFor={id + '-note'}>Điều đang băn khoăn (tùy chọn, tối đa 400 ký tự)
          <textarea id={id + '-note'} className="input mt-1" rows={2} maxLength={400} value={note} onChange={e => setNote(e.target.value)} placeholder="Ví dụ: đang cân nhắc chuyển việc hoặc mở rộng hướng kinh doanh trong năm nay…" />
        </label>
      </>}
    </div>
  </details>;
  if(!account)return <section className="rounded-xl border border-[#d9c7a3] bg-white p-5"><p>Đang mở quyền xem luận giải…</p></section>;
  if(!account.paymentsEnabled){
    const next=encodeURIComponent('/la-so?'+inputToQuery(input));
    return <section className="rounded-xl border border-[#d9c7a3] bg-white p-5"><h2 className="font-serif text-2xl font-bold text-son">Xem luận giải của tôi</h2><p className="mt-3">Website đang mở trải nghiệm, chưa thu tiền. Bản luận giải thích sao và các tổ hợp tại từng cung, nối với đại hạn và từng năm; được lưu để đọc lại trong tài khoản.</p><p className="mt-2 text-sm">Hiện hỗ trợ ngày sinh dương lịch từ 1950 đến 2026. Bài luận có năm đã chọn và tối đa bốn năm tiếp theo, mang tính tham khảo.</p>
      {account.customer?<div className="mt-4 space-y-4">{!account.customer.verified&&<p className="text-sm">Bạn cần <a className="underline" href="/tai-khoan">xác minh email trong tài khoản</a> để nhận lượt trải nghiệm miễn phí.</p>}{preferenceFields}<div className="flex flex-wrap gap-3"><button className="btn" disabled={busy} onClick={async()=>{setBusy(true);setError('');try{const r=await fetch('/api/account/readings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({input:customInput})});const j=await r.json();if(!r.ok)throw Error(j.error);router.push(j.url);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}}>{busy?'Đang mở…':'Mở bài luận của lá số này'}</button><button className="btn-outline" disabled={busy} onClick={async()=>{setBusy(true);setError('');try{const r=await fetch('/api/account/profiles',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({input:customInput})});const j=await r.json();if(!r.ok)throw Error(j.error);setMessage('Đã lưu lá số trong tài khoản.');}catch(e){setError((e as Error).message);}finally{setBusy(false);}}}>Lưu lá số vào tài khoản</button><a className="btn-outline" href="/tai-khoan">Tài khoản của tôi</a></div></div>:<div className="mt-4 flex flex-wrap gap-3"><a className="btn" href={`/dang-nhap?next=${next}`}>Đăng nhập để xem bài của tôi</a><a className="btn-outline" href={`/dang-ky?next=${next}`}>Tạo tài khoản trải nghiệm</a></div>}
      {error&&<p role="alert" className="mt-3 text-son">{error}</p>}{message&&<p role="status" className="mt-3">{message}</p>}
    </section>;
  }
  const products=PRODUCTS.filter(p=>p.id!=='deep'||account.deepAvailable);
  const selected=products.find(p=>p.id===product)||products[0];
  return <FunnelSection event="pricing_view" className="rounded-xl border border-[#d9c7a3] bg-white p-5">
    <h2 className="font-serif text-2xl font-bold text-son">Xem luận giải đầy đủ</h2>
    <p className="mt-3 text-sm">Lá số, cách cục và trích cổ thư ở trên được xem miễn phí. Mở bài luận giải gồm bản mệnh, sự nghiệp, tài lộc, tình duyên và vận năm {input.year}; kết quả được lưu để xem lại.</p>
    <p className="mt-2 text-sm"><a className="underline" href="/bai-luan-mau">Xem cách trình bày trước khi mua</a> · Mua một lần, xem lại bài đã lưu không mất thêm lượt.</p>
    <form className="no-print mt-4 space-y-4" onSubmit={e => { e.preventDefault(); void submit(); }}>
      <div className={`grid gap-3 ${products.length===3?'sm:grid-cols-3':'sm:grid-cols-2'}`}>{products.map(p => <label key={p.id} className={`cursor-pointer rounded-lg border p-4 ${product === p.id ? 'border-son bg-[#fff6e5]' : 'border-[#d9c7a3]'}`}>
        <input type="radio" name="product" value={p.id} checked={product === p.id} onChange={() => setProduct(p.id)} /> <b>{p.name}</b>
        {p.id==='deep'&&<span className="mt-2 block text-xs font-bold text-son">Đi sâu theo vấn đề bạn chọn</span>}{p.id==='family'&&<span className="mt-2 block text-xs font-bold text-son">Dành cho nhiều lá số</span>}
        {p.id==='single'&&<span className="mt-2 block text-xs font-semibold text-son">Phù hợp khi xem lần đầu</span>}
        <span className="mt-1 block">{money(p.price)} · {p.credits} lượt</span>
        {p.id==='family'&&<span className="mt-2 block text-sm font-semibold text-son">{money(p.price/p.credits)}/lượt · tiết kiệm {money(familySaving())} so với mua lẻ</span>}
        <span className="mt-1 block text-xs text-[#6b5b45]">{p.summary}</span>
      </label>)}</div>
      <ul className="grid gap-2 rounded-lg bg-[#fffaf0] p-3 text-sm sm:grid-cols-2"><li>✓ Luận đủ 12 cung</li><li>✓ Đại hạn và các chặng tiếp theo khi có dữ liệu</li><li>✓ Năm {input.year} đến {Math.min(input.year+4,2100)}</li><li>✓ Xem lại bài đã lưu · In / lưu PDF</li></ul>
      {account.customer?.verified?preferenceFields:<p className="text-sm text-[#6b5b45]">Bạn có thể chọn chủ đề và thêm hoàn cảnh riêng sau khi đăng nhập, xác minh email.</p>}
      {account.customer&&<label className="block">Email nhận kết quả<input className="input mt-1" type="email" required maxLength={254} value={account.customer.email} readOnly autoComplete="email" /></label>}
      {account.customer?.verified&&<details><summary className="cursor-pointer text-sm underline">Có mã ưu đãi? Nhập tại đây</summary><label className="mt-2 block">Mã giảm giá (nếu có)<input className="input mt-1" maxLength={32} value={coupon} onChange={e => setCoupon(e.target.value)} /></label></details>}
      <p className="text-xs text-[#6b5b45]">Tiếp tục nghĩa là bạn đồng ý <a className="underline" href="/chinh-sach/dieu-khoan">Điều khoản</a> và <a className="underline" href="/chinh-sach/bao-mat">Chính sách bảo mật</a>. Nội dung mang tính tham khảo, giải trí.</p>
      <p className="rounded-lg bg-[#fff6e5] p-3 text-sm">Bạn sẽ thấy số tiền cuối cùng sau giảm giá trên đơn trước khi chuyển khoản. Gói gia đình có 5 lượt cho nhiều lá số, không gia hạn định kỳ.</p>
      <p className="text-sm">Đang chọn: <b>{selected.name}</b> · <b>{money(selected.price)}</b>{coupon.trim()?' trước khi áp dụng mã ưu đãi.':'.'} {selected.id==='deep'?'Bài chuyên sâu được AI biên soạn theo vấn đề bạn chọn.':'Bài được cá nhân hóa từ kho nội dung sao–cung.'}</p>
      {!account.customer&&<p className="text-sm text-[#6b5b45]">Đăng nhập hoặc tạo tài khoản ở bước tiếp theo để giữ riêng đơn hàng và bài luận. Chưa có khoản thu ở bước này.</p>}
      {account.customer&&!account.customer.verified&&<p className="text-sm text-son">Xác minh email trong tài khoản trước khi đặt đơn.</p>}
      <button className="btn" disabled={busy}>{busy ? 'Đang xử lý…' : !account.customer?'Đăng nhập để tiếp tục':!account.customer.verified?'Xác minh email để tiếp tục':`Tiếp tục với gói ${money(selected.price)}`}</button>
      {wallet && <button className="btn-outline ml-2" type="button" disabled={busy} onClick={() => void submit(true)}>Dùng lượt đã mua</button>}
      {wallet && <a className="block text-sm underline" href={`/don-hang/${wallet}`}>Xem gói đã mua và số lượt còn lại</a>}
      {error && <p role="alert" className="text-son">{error}</p>}
    </form>
  </FunnelSection>;
}
