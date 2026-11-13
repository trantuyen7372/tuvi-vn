'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CANH_GIO, inputToQuery, validateInput, type BirthInput } from '@/lib/birth-input';

export default function BirthForm({onCreated,submitLabel='Lập lá số'}:{onCreated?:(input:BirthInput)=>Promise<void>;submitLabel?:string}={}) {
  const router = useRouter();
  const thisYear = new Date().getFullYear();
  const [f, setF] = useState({
    name: '',
    gender: 'nam' as BirthInput['gender'],
    calendar: 'duong' as BirthInput['calendar'],
    day: '',
    month: '',
    yearB: '',
    hour: '6',
    leap: false,
    year: String(thisYear),
  });
  const [err, setErr] = useState('');
  const [busy,setBusy]=useState(false);
  const set = (k: keyof typeof f, v: string | boolean) => setF((s) => ({ ...s, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);setErr('');
    try {
      const date = `${f.yearB.padStart(4, '0')}-${f.month.padStart(2, '0')}-${f.day.padStart(2, '0')}`;
      const input = validateInput({ ...f, date, hour: Number(f.hour), year: Number(f.year) });
      if(onCreated)await onCreated(input);else router.push(`/la-so?${inputToQuery(input)}`);
    } catch (ex) {
      setErr((ex as Error).message);
    }finally{setBusy(false);}
  }

  const nums = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

  return (
    <form onSubmit={submit} className="birth-form space-y-4">
      <span className="birth-corner birth-corner-tl" aria-hidden="true" />
      <span className="birth-corner birth-corner-tr" aria-hidden="true" />
      <span className="birth-corner birth-corner-bl" aria-hidden="true" />
      <span className="birth-corner birth-corner-br" aria-hidden="true" />
      <div className="birth-form-heading"><div><p className="site-eyebrow">✦ BẢNG KHỞI LẬP MỆNH BÀN ✦</p><h2>Thông tin lập lá số</h2></div><span className="birth-form-badge">✦ Miễn phí</span></div>
      <div>
        <label htmlFor="birth-name" className="mb-1 block text-sm font-semibold">Họ và tên (không bắt buộc)</label>
        <input id="birth-name" className="input" maxLength={60} autoComplete="name" value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Nguyễn Văn A" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="birth-gender" className="mb-1 block text-sm font-semibold">Giới tính</label>
          <select id="birth-gender" className="input" value={f.gender} onChange={(e) => set('gender', e.target.value)}>
            <option value="nam">Nam</option>
            <option value="nu">Nữ</option>
          </select>
        </div>
        <div>
          <label htmlFor="birth-calendar" className="mb-1 block text-sm font-semibold">Lịch</label>
          <select id="birth-calendar" className="input" value={f.calendar} onChange={(e) => set('calendar', e.target.value)}>
            <option value="duong">Dương lịch</option>
            <option value="am">Âm lịch</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold">Ngày sinh ({f.calendar === 'am' ? 'âm lịch' : 'dương lịch'})</label>
        <div className="grid grid-cols-3 gap-3">
          <select aria-label="Ngày sinh" className="input" value={f.day} onChange={(e) => set('day', e.target.value)} required>
            <option value="">Ngày</option>
            {nums(1, f.calendar === 'am' ? 30 : 31).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <select aria-label="Tháng sinh" className="input" value={f.month} onChange={(e) => set('month', e.target.value)} required>
            <option value="">Tháng</option>
            {nums(1, 12).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <input aria-label="Năm sinh" className="input" inputMode="numeric" placeholder="Năm" value={f.yearB} onChange={(e) => set('yearB', e.target.value.replace(/\D/g, '').slice(0, 4))} required />
        </div>
        {f.calendar === 'am' && (
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={f.leap} onChange={(e) => set('leap', e.target.checked)} /> Tháng nhuận
          </label>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="birth-hour" className="mb-1 block text-sm font-semibold">Giờ sinh</label>
          <select id="birth-hour" className="input" value={f.hour} onChange={(e) => set('hour', e.target.value)}>
            {CANH_GIO.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="birth-year" className="mb-1 block text-sm font-semibold">Năm xem hạn</label>
          <input id="birth-year" className="input" inputMode="numeric" value={f.year} onChange={(e) => set('year', e.target.value.replace(/\D/g, '').slice(0, 4))} />
        </div>
      </div>

      <p className="birth-form-hint">Nhập ngày giờ sinh đã xác nhận để lập đúng lá số. Chỉ đánh dấu tháng nhuận khi dùng ngày âm lịch có tháng nhuận.</p>
      <p className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-son"><a href="/huong-dan/nhap-ngay-am-hay-duong" className="underline">Nhập ngày âm hay dương?</a><a href="/huong-dan/khong-biet-gio-sinh" className="underline">Chưa biết giờ sinh?</a></p>
      {err && <p role="alert" className="text-sm text-son">{err}</p>}
      <button className="btn w-full" type="submit" disabled={busy}>{busy?'Đang xử lý…':submitLabel}</button>
    </form>
  );
}
