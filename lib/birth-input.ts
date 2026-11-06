import {validateReadingPreferences,type ReadingPreferences} from './reading-preferences';

/** Thông tin người dùng nhập vào form. */
export interface BirthInput {
  name: string;
  gender: 'nam' | 'nu';
  calendar: 'duong' | 'am';
  /** yyyy-mm-dd (dương lịch hoặc âm lịch tuỳ calendar) */
  date: string;
  /** chỉ số giờ iztro: 0 = Tý sớm (0h-1h) ... 11 = Hợi, 12 = Tý muộn (23h-24h) */
  hour: number;
  /** tháng nhuận (chỉ dùng khi nhập âm lịch) */
  leap: boolean;
  /** năm xem hạn */
  year: number;
  reading?:ReadingPreferences;
}

export const CANH_GIO: { value: number; label: string }[] = [
  { value: 0, label: 'Tý (0h – 1h)' },
  { value: 1, label: 'Sửu (1h – 3h)' },
  { value: 2, label: 'Dần (3h – 5h)' },
  { value: 3, label: 'Mão (5h – 7h)' },
  { value: 4, label: 'Thìn (7h – 9h)' },
  { value: 5, label: 'Tỵ (9h – 11h)' },
  { value: 6, label: 'Ngọ (11h – 13h)' },
  { value: 7, label: 'Mùi (13h – 15h)' },
  { value: 8, label: 'Thân (15h – 17h)' },
  { value: 9, label: 'Dậu (17h – 19h)' },
  { value: 10, label: 'Tuất (19h – 21h)' },
  { value: 11, label: 'Hợi (21h – 23h)' },
  { value: 12, label: 'Tý (23h – 24h)' },
];

export function validateInput(raw: unknown): BirthInput {
  const r = (raw ?? {}) as Record<string, unknown>;
  const name = String(r.name ?? '').trim().slice(0, 60);
  const gender = r.gender === 'nu' ? 'nu' : 'nam';
  const calendar = r.calendar === 'am' ? 'am' : 'duong';
  const date = String(r.date ?? '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Ngày sinh không hợp lệ');
  const y = Number(date.slice(0, 4));
  if (y < 1900 || y > 2100) throw new Error('Năm sinh phải trong khoảng 1900 – 2100');
  const m = Number(date.slice(5, 7)), d = Number(date.slice(8, 10));
  const maxDay = calendar === 'am' ? 30 : new Date(Date.UTC(y, m, 0)).getUTCDate();
  if (m < 1 || m > 12 || d < 1 || d > maxDay) throw new Error('Ngày sinh không tồn tại');
  const hour = Number(r.hour);
  if (!Number.isInteger(hour) || hour < 0 || hour > 12) throw new Error('Giờ sinh không hợp lệ');
  const year = Number(r.year) || new Date().getFullYear();
  if (!Number.isInteger(year) || year < y || year > 2100) throw new Error('Năm xem hạn không hợp lệ');
  const reading=validateReadingPreferences(r.reading);
  return { name, gender, calendar, date, hour, leap: Boolean(r.leap) && calendar === 'am', year,...(reading?{reading}:{}) };
}

/** Chủ đề/ghi chú không tạo lá số mới hoặc làm mất lượt đọc lại. */
export function readingIdentity(input:BirthInput){const {reading:_,...birth}=input;return {...birth,name:''};}

export function inputToQuery(i: BirthInput): string {
  const p = new URLSearchParams({
    ten: i.name,
    gt: i.gender,
    lich: i.calendar,
    ngay: i.date,
    gio: String(i.hour),
    nhuan: i.leap ? '1' : '0',
    nam: String(i.year),
  });
  return p.toString();
}

export function queryToInput(q: URLSearchParams): BirthInput {
  return validateInput({
    name: q.get('ten') ?? '',
    gender: q.get('gt'),
    calendar: q.get('lich'),
    date: q.get('ngay'),
    hour: q.get('gio'),
    leap: q.get('nhuan') === '1',
    year: q.get('nam'),
  });
}

