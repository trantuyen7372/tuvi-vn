'use client';
import {Suspense,useState} from 'react';
import CelestialMark from './CelestialMark';
import {useRouter,useSearchParams} from 'next/navigation';
import {notifyAuthChanged,safeCustomerDestination} from '@/lib/customers/client';
type Mode='login'|'signup'|'forgot'|'reset'|'verify';
const titles:Record<Mode,string>={login:'Đăng nhập',signup:'Tạo tài khoản',forgot:'Quên mật khẩu',reset:'Đặt lại mật khẩu',verify:'Xác minh email'};
function AuthForm({mode}:{mode:Mode}){
  const router=useRouter(),q=useSearchParams();
  const[email,setEmail]=useState(''),[password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[message,setMessage]=useState(''),[demoUrl,setDemoUrl]=useState('');
  const [verified,setVerified]=useState(false);
  const next=q.get('next')||'/tai-khoan',destination=safeCustomerDestination(next);
  async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError('');setMessage('');
    try{
      if(['signup','reset'].includes(mode)&&password!==confirm)throw Error('Hai mật khẩu chưa trùng nhau');
      const res=await fetch(`/api/auth/${mode}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,token:q.get('token')||''})}),data=await res.json();
      if(!res.ok)throw Error(data.error);
      if(mode==='forgot'){setMessage(data.message);setDemoUrl(data.demoUrl||'');return;}
      notifyAuthChanged();
      if(mode==='verify'){setVerified(true);setMessage('Email đã được xác minh. Mở tài khoản để kiểm tra lượt trải nghiệm và chọn lá số muốn xem.');return;}
      try{localStorage.removeItem('tuvi-order');}catch{}
      router.replace(destination);router.refresh();
    }catch(e){setError((e as Error).message);}finally{setBusy(false);}
  }
  return <main className="auth-page"><aside className="auth-intro"><CelestialMark/><p className="site-eyebrow">GÓC RIÊNG CỦA BẠN</p><h2>Lưu một lá số.<br/>Đọc lại nhiều lần.</h2><p>Giữ lá số và bài luận trong một nơi, để tiếp tục tìm hiểu khi bạn muốn.</p><a href="/bai-luan-mau" className="text-link">Khám phá bài luận mẫu ↗</a></aside><section className="auth-card"><h1 className="font-serif text-3xl font-bold text-son">{titles[mode]}</h1>
    <p className="mt-3 text-sm">{mode==='signup'?'Lưu lá số, xem lại bài luận trên nhiều thiết bị. Lượt trải nghiệm miễn phí được cấp sau khi xác minh email.':mode==='login'?'Dùng email và mật khẩu của bạn để mở lịch sử lá số, bài luận.':mode==='verify'?'Bấm xác nhận để hoàn tất xác minh địa chỉ email.':'Link khôi phục chỉ dùng một lần và có thời hạn.'}</p>
    <form className="mt-5 space-y-4" onSubmit={submit}>
      {['login','signup','forgot'].includes(mode)&&<label className="block">Email<input className="input mt-1" type="email" required maxLength={254} autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></label>}
      {['login','signup','reset'].includes(mode)&&<label className="block">{mode==='reset'?'Mật khẩu mới':'Mật khẩu'}<input className="input mt-1" type="password" required minLength={mode==='login'?1:12} maxLength={128} autoComplete={mode==='login'?'current-password':'new-password'} value={password} onChange={e=>setPassword(e.target.value)}/></label>}
      {['signup','reset'].includes(mode)&&<label className="block">Nhập lại mật khẩu<input className="input mt-1" type="password" required minLength={12} maxLength={128} autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)}/></label>}
      {mode==='signup'&&<><p className="text-xs text-[#6b5b45]">Mật khẩu từ 12 ký tự. Nếu email chưa được xác minh hoặc chưa nhận được thư, hãy lưu mật khẩu an toàn; quyền xem lại đơn cũ theo email chỉ được mở sau xác minh.</p><label className="flex items-start gap-2 text-sm"><input className="mt-1" type="checkbox" required/>Tôi đồng ý Điều khoản sử dụng và Chính sách bảo mật.</label><p className="text-xs"><a className="underline" href="/chinh-sach/dieu-khoan">Đọc điều khoản</a> · <a className="underline" href="/chinh-sach/bao-mat">Đọc chính sách bảo mật</a></p></>}
      {!verified&&<button className="btn w-full" disabled={busy}>{busy?'Đang xử lý…':mode==='forgot'?'Gửi link khôi phục':mode==='verify'?'Xác nhận email':titles[mode]}</button>}
      {error&&<div role="alert" className="text-son"><p>{error}</p>{mode==='verify'&&<p className="mt-2 text-sm">Nếu link đã hết hạn hoặc được dùng trước đó, <a className="underline" href="/tai-khoan">mở tài khoản</a> để kiểm tra trạng thái và gửi lại thư xác minh. Bạn có thể cần đăng nhập.</p>}</div>}{message&&<p role="status">{message}</p>}
      {demoUrl&&<p className="rounded bg-amber-50 p-3 text-sm">Môi trường thử: <a className="underline" href={demoUrl}>Mở thư khôi phục thử</a>. Không có email thật được gửi.</p>}
    </form>
    <nav className="mt-5 flex flex-wrap gap-4 text-sm"><a className="underline" href={`/dang-nhap?next=${encodeURIComponent(destination)}`}>Đăng nhập</a><a className="underline" href={`/dang-ky?next=${encodeURIComponent(destination)}`}>Tạo tài khoản</a><a className="underline" href="/quen-mat-khau">Quên mật khẩu</a><a className="underline" href="/tai-khoan">Tài khoản của tôi</a></nav>
  </section></main>;
}
export default function CustomerAuth({mode}:{mode:Mode}){return <Suspense fallback={<p className="p-6">Đang tải…</p>}><AuthForm mode={mode}/></Suspense>;}
