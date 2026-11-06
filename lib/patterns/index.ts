import 'server-only';
import { astro } from 'iztro';
import type { BirthInput } from '../birth-input';
import { detectPatterns, type Pattern } from './engine';
import { vn } from './names';
import type { Palace, Star, ZiweiChart } from './types';

const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const SHA = new Set(['擎羊', '陀罗', '火星', '铃星', '地空', '地劫']);
const LUCKY = new Set(['文昌', '文曲', '左辅', '右弼', '天魁', '天钺', '禄存', '天马']);

function bright(b?: string): Star['brightness'] {
  if (!b) return undefined;
  if (b === '庙' || b === '旺') return 'bright';
  if (b === '陷' || b === '不' || b === '闲') return 'dim';
  return 'normal';
}

/** Lập lá số bằng iztro (tiếng Trung) theo đúng định dạng engine cách cục cần. */
function toEngineChart(input: BirthInput): ZiweiChart {
  const [y, m, d] = input.date.split('-').map(Number);
  const g = input.gender === 'nu' ? '女' : '男';
  const a =
    input.calendar === 'am'
      ? astro.byLunar(`${y}-${m}-${d}`, input.hour, g, input.leap, true, 'zh-CN')
      : astro.bySolar(`${y}-${m}-${d}`, input.hour, g, true, 'zh-CN');
  const palaces: Palace[] = a.palaces.map((p) => ({
    branch: BRANCHES.indexOf(p.earthlyBranch),
    name: p.name,
    stars: [
      ...p.majorStars.map((s) => ({ name: s.name, type: 'major' as const, brightness: bright(s.brightness), siHua: (s.mutagen || undefined) as Star['siHua'] })),
      ...p.minorStars.map((s) => ({
        name: s.name,
        type: SHA.has(s.name) ? ('sha' as const) : LUCKY.has(s.name) ? ('lucky' as const) : ('minor' as const),
        brightness: bright(s.brightness),
        siHua: (s.mutagen || undefined) as Star['siHua'],
      })),
      ...p.adjectiveStars.map((s) => ({ name: s.name, type: 'minor' as const })),
    ],
  }));
  return {
    palaces,
    mingGongBranch: BRANCHES.indexOf(a.earthlyBranchOfSoulPalace),
    shenGongBranch: BRANCHES.indexOf(a.earthlyBranchOfBodyPalace),
  };
}

export interface PatternView {
  name: string;
  level: Pattern['level'];
  description: string;
  palaces: string[];
  required: string[];
  bonus: string[];
  breaking: string[];
  source?: string;
}

export {LEVEL_LABEL} from './labels';

/** Nhận diện cách cục, trả về tiếng Việt. */
export function findPatterns(input: BirthInput): PatternView[] {
  const order = { excellent: 0, good: 1, neutral: 2, caution: 3 };
  return detectPatterns(toEngineChart(input))
    .map((p) => ({
      name: p.name,
      level: p.level,
      description: p.description,
      palaces: [...new Set(p.palaces.map(vn))],
      required: p.conditions?.required ?? [],
      bonus: p.conditions?.bonus ?? [],
      breaking: p.conditions?.breaking ?? [],
      source: p.source,
    }))
    .sort((a, b) => order[a.level] - order[b.level]);
}
