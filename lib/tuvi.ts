import 'server-only';
import { astro } from 'iztro';
import { findPatterns, type PatternView } from './patterns';
import type {BirthInput} from './birth-input';
export {CANH_GIO,validateInput,inputToQuery,queryToInput,readingIdentity,type BirthInput} from './birth-input';
export {BRANCH_GRID} from './chart-layout';

export interface StarView {
  name: string;
  brightness?: string;
  mutagen?: string;
  kind: 'chinh' | 'phu' | 'tap';
}

export interface PalaceView {
  name: string;
  branch: string;
  stem: string;
  isBody: boolean;
  major: StarView[];
  minor: StarView[];
  adjective: StarView[];
  changsheng: string;
  boshi: string;
  decadal: [number, number];
  /** cung này là cung gì trong năm xem hạn (Lưu niên) */
  yearlyName?: string;
  isDecadalNow: boolean;
  isYearlyNow: boolean;
}

export interface ChartView {
  input: BirthInput;
  solarDate: string;
  /** YYYY-M-D (dương lịch) */
  solarIso: string;
  lunarText: string;
  canChi: string;
  time: string;
  timeRange: string;
  zodiac: string;
  menhChu: string;
  thanChu: string;
  cuc: string;
  menhBranch: string;
  thanBranch: string;
  palaces: PalaceView[];
  year: number;
  nominalAge: number;
  decadalNow?: { stem: string; branch: string; range: [number, number]; mutagen: string[] };
  yearlyNow: { stem: string; branch: string; mutagen: string[] };
  patterns: PatternView[];
}

const pad = (n: number) => String(n).padStart(2, '0');

export function buildChart(input: BirthInput): ChartView {
  const [y, m, d] = input.date.split('-').map(Number);
  const dateStr = `${y}-${m}-${d}`;
  const g = input.gender === 'nu' ? '女' : '男';
  const a =
    input.calendar === 'am'
      ? astro.byLunar(dateStr, input.hour, g, input.leap, true, 'vi-VN')
      : astro.bySolar(dateStr, input.hour, g, true, 'vi-VN');

  // Lấy ngày giữa năm xem hạn để tính Lưu niên (sau Tết)
  const h = a.horoscope(new Date(`${input.year}-07-01T12:00:00+07:00`), input.hour);
  const yearlyNames = h.yearly.palaceNames; // theo index cung
  const decIdx = h.decadal.index;
  const yearIdx = h.yearly.index;

  const ld = a.rawDates.lunarDate;
  const palaces: PalaceView[] = a.palaces.map((p, i) => ({
    name: p.name,
    branch: p.earthlyBranch,
    stem: p.heavenlyStem,
    isBody: p.isBodyPalace,
    major: p.majorStars.map((s) => ({ name: s.name, brightness: s.brightness || undefined, mutagen: s.mutagen || undefined, kind: 'chinh' as const })),
    minor: p.minorStars.map((s) => ({ name: s.name, brightness: s.brightness || undefined, mutagen: s.mutagen || undefined, kind: 'phu' as const })),
    adjective: p.adjectiveStars.map((s) => ({ name: s.name, kind: 'tap' as const })),
    changsheng: p.changsheng12,
    boshi: p.boshi12,
    decadal: [p.decadal.range[0], p.decadal.range[1]],
    yearlyName: yearlyNames[i],
    // Thư viện có thể trả một cung cho vận thơ ấu; không biến nó thành
    // đại hạn 10 năm nếu tuổi đang xem chưa thuộc khoảng của cung ấy.
    isDecadalNow: i === decIdx && p.decadal.range[0] <= h.age.nominalAge && p.decadal.range[1] >= h.age.nominalAge,
    isYearlyNow: i === yearIdx,
  }));

  const [sy, sm, sd] = a.solarDate.split('-').map(Number);
  const menh = palaces.find((p) => p.name === 'Mệnh');
  const than = palaces.find((p) => p.isBody);
  const decadalPalace = palaces.find(p=>p.isDecadalNow);

  return {
    input,
    solarDate: `${pad(sd)}/${pad(sm)}/${sy}`,
    solarIso: a.solarDate,
    lunarText: `${pad(ld.lunarDay)}/${pad(ld.lunarMonth)}${ld.isLeap ? ' (nhuận)' : ''}/${ld.lunarYear}`,
    canChi: a.chineseDate,
    time: a.time,
    timeRange: a.timeRange,
    zodiac: a.zodiac,
    menhChu: a.soul,
    thanChu: a.body,
    cuc: a.fiveElementsClass,
    menhBranch: menh?.branch ?? '',
    thanBranch: than?.branch ?? '',
    palaces,
    year: input.year,
    nominalAge: h.age.nominalAge,
    decadalNow: decadalPalace
      ? { stem: h.decadal.heavenlyStem, branch: h.decadal.earthlyBranch, range: decadalPalace.decadal, mutagen: h.decadal.mutagen }
      : undefined,
    yearlyNow: { stem: h.yearly.heavenlyStem, branch: h.yearly.earthlyBranch, mutagen: h.yearly.mutagen },
    patterns: findPatterns(input),
  };
}

