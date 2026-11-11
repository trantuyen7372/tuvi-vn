'use client';
import { useEffect, useState, useRef } from 'react';
import Markdown from './Markdown';
import ReadingContents from './ReadingContents';
import ReadingPreferences from './ReadingPreferences';
import type {ReadingPreferences as Preferences} from '@/lib/reading-preferences';
interface Result { status: string; text: string; attempts: number; input: { name: string;reading?:Preferences }; emailStatus: string;canPersonalize?:boolean }
export default function SavedReading({ token }: { token: string }) {
  const [result, setResult] = useState<Result>(), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const started = useRef(false);
  const latestLoad = useRef(0);
  async function load() {
    const sequence=++latestLoad.current;
    const response = await fetch(`/api/readings/${token}`, { cache: 'no-store' }), data = await response.json();
    if(!response.ok){if(sequence===latestLoad.current)setResult(undefined);if(response.status===401)location.replace('/dang-nhap?next='+encodeURIComponent('/luan-giai/'+token));}
    if (!response.ok) throw new Error(data.error);
    if(sequence===latestLoad.current)setResult(data);
    return data as Result;
  }
  async function generate() {
    setBusy(true); setError('');
    try { const response = await fetch(`/api/readings/${token}`, { method: 'POST' }); const data = await response.json();
      if (!response.ok) throw new Error(data.error); await load();
    } catch (e) { setError((e as Error).message); await load().catch(()=>{}); } finally { setBusy(false); }
  }
  useEffect(() => {
    let active = true;
    void load().then(r => { if (active && r.status === 'pending' && !started.current) { started.current = true; void generate(); } }).catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!['pending', 'running'].includes(result?.status || '')) return;
    const timer = setInterval(() => { void load().catch(() => {}); }, 2000);
    return () => clearInterval(timer);
  }, [token, result?.status]); // eslint-disable-line react-hooks/exhaustive-deps
  return <main className="mx-auto max-w-3xl px-4 py-10"><article className="rounded-xl border border-[#d9c7a3] bg-white p-6">
    <h1 className="font-serif text-2xl font-bold text-son">Luận giải {result?.input.name ? `của ${result.input.name}` : 'Tử Vi'}</h1>
    {result?.canPersonalize&&<ReadingPreferences key={token} token={token} value={result.input.reading} onSaved={load}/>}
    {(busy || result?.status === 'running') && result?.status!=='done' && <p role="status" className="mt-4 animate-pulse">{result?.text?'Bài luận đang hiện dần bên dưới. Bạn có thể đọc trong khi các phần tiếp theo được biên soạn.':'Đang biên soạn phần mở đầu cho lá số của bạn. Nội dung sẽ hiện dần khi sẵn sàng.'} Bạn có thể giữ link này để quay lại.</p>}
    {!!result?.text && result.status!=='done' && <section aria-label="Nội dung đang biên soạn" className="mt-5">
      <p className="mb-4 rounded-lg border border-[#d9c7a3] bg-[#fffaf0] p-3 text-sm">{result.status==='error'?'Bài chưa hoàn tất. Phần dưới đây là nội dung đã nhận được; bạn có thể thử biên soạn lại.':'Bản đang viết, chưa phải bài hoàn chỉnh.'}</p>
      <Markdown text={result.text}/>
    </section>}
    {result?.status === 'done' && <><ReadingContents text={result.text} readingKey={token}/><Markdown text={result.text} /><button className="btn-outline no-print mt-4" onClick={() => print()}>In / lưu PDF</button>
      <p className="mt-3 text-sm">{result.emailStatus === 'sent' ? 'Đã gửi bản sao qua email.' : 'Kết quả đã lưu tại đường link này. Bản sao chưa được gửi qua email; hãy giữ link hoặc liên hệ hỗ trợ nếu cần.'}</p></>}
    {(result?.status === 'error' || result?.status === 'pending') && !busy && <button className="btn mt-4" disabled={result.attempts >= 3} onClick={() => void generate()}>Mở lại bản luận giải ({result.attempts}/3 lần)</button>}
    {result?.status === 'running' && !busy && <button className="btn-outline mt-4" onClick={() => void generate()}>Kiểm tra tiến độ biên soạn</button>}
    {error && <p role="alert" className="mt-4 text-son">{error}</p>}
    {result?.status === 'error' && result.attempts >= 3 && <p className="mt-4 text-son">Đã hết số lần thử, lượt đã được trả lại. Vui lòng liên hệ hỗ trợ để xử lý tiếp.</p>}
    <p className="mt-6 text-xs text-[#6b5b45]">Đăng nhập đúng tài khoản sở hữu để xem lại bài luận. Nội dung mang tính tham khảo, giải trí; không thay thế tư vấn y tế, pháp lý hoặc tài chính.</p>
    <a href="/" className="no-print mt-4 inline-block underline">Lập lá số khác</a>
    <a href="/tai-khoan" className="no-print ml-4 inline-block underline">Bài luận trong tài khoản</a>
  </article></main>;
}
