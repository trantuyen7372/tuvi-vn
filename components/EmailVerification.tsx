'use client';
import {useEffect,useState} from 'react';

export default function EmailVerification({email,welcomeCredits,delivery,onVerified}:{
  email:string;welcomeCredits:number;delivery?:{status:string;created:number}|null;onVerified:()=>Promise<void>;
}){
  const [status,setStatus]=useState(delivery?.status||''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[demoUrl,setDemoUrl]=useState('');
  useEffect(()=>{setStatus(delivery?.status||'');},[delivery?.status,delivery?.created]);
  async function resend(){
    setBusy(true);setError('');setDemoUrl('');
    try{
      const response=await fetch('/api/auth/resend',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}),result=await response.json();
      if(!response.ok)throw Error(result.error||'Chưa gửi được thư xác minh. Vui lòng thử lại sau.');
      if(result.status==='verified'){await onVerified();return;}
      setStatus(result.status);setDemoUrl(result.demoUrl||'');
    }catch(e){setError((e as Error).message);}finally{setBusy(false);}
  }
  return <div className="mt-4 space-y-3 rounded-lg border border-[#d9c7a3] bg-white p-4" aria-label="Xác minh email tài khoản">
    <h3 className="font-bold">Xác minh email để hoàn tất đăng ký</h3>
    <p className="text-sm">Email chưa xác minh. {welcomeCredits>0?`Xác minh email để nhận ${welcomeCredits} lượt trải nghiệm miễn phí, chỉ cấp một lần cho mỗi tài khoản. `:''}Bạn vẫn có thể lưu lá số; đơn cũ theo email chỉ được nhận lại sau xác minh.</p>
    <div role="status" className="space-y-2 text-sm">
      {status==='sent'&&<><p>Thư xác minh đã được gửi đến <strong className="break-all">{email}</strong>.</p><p>Kiểm tra Hộp thư đến và mục Thư rác/Spam. Link có hiệu lực 24 giờ và chỉ dùng một lần.</p></>}
      {status==='demo'&&<p>Đây là môi trường thử, không gửi email thật. Bạn có thể tạo link thử bằng nút bên dưới.</p>}
      {(status==='failed'||status==='not_configured')&&<p>Chưa gửi được thư xác minh. Tài khoản đã được tạo; bạn có thể gửi lại sau hoặc liên hệ hỗ trợ.</p>}
      {!status&&<p>Gửi thư xác minh đến <strong className="break-all">{email}</strong>, rồi bấm nút xác nhận trong thư.</p>}
    </div>
    <button className="btn-outline" disabled={busy} onClick={()=>void resend()}>{busy?'Đang gửi…':'Gửi lại thư xác minh'}</button>
    {error&&<p role="alert" className="text-sm text-son">{error}</p>}
    {demoUrl&&<a className="block break-words text-sm underline" href={demoUrl}>Mở thư xác minh thử (chỉ có ở môi trường demo)</a>}
  </div>;
}
