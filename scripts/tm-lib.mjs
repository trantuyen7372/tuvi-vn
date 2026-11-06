// Thư viện dùng chung cho việc dịch dữ liệu v4.0 sang tiếng Việt.
// Ý tưởng: tách mỗi dòng thành "khuôn" (thay tên sao/cung/con số bằng ký hiệu ⟨0⟩, ⟨1⟩...)
// để các dòng chỉ khác tên sao hay con số dùng chung một bản dịch.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ZH_VI = JSON.parse(fs.readFileSync(path.join(here, '../lib/patterns/zh-vi.json'), 'utf8'));
const EXTRA = {
  命宫: 'Mệnh', 身宫: 'Thân', 仆役: 'Nô Bộc', 交友: 'Nô Bộc', 兄弟宫: 'Huynh Đệ', 夫妻宫: 'Phu Thê', 子女宫: 'Tử Nữ',
  财帛宫: 'Tài Bạch', 疾厄宫: 'Tật Ách', 迁移宫: 'Thiên Di', 官禄宫: 'Quan Lộc', 田宅宫: 'Điền Trạch',
  福德宫: 'Phúc Đức', 父母宫: 'Phụ Mẫu', 化禄: 'hoá Lộc', 化权: 'hoá Quyền', 化科: 'hoá Khoa', 化忌: 'hoá Kỵ',
};
export const NAME_VI = { ...ZH_VI, ...EXTRA };
// chỉ lấy tên sao/cung (2–4 chữ Hán), bỏ các từ chung dễ gây nhầm
const SKIP = new Set(['大限', '流年', '流月', '流日', '流时', '小限', '童限']);
const NAMES = Object.keys(NAME_VI)
  .filter((k) => /^[一-鿿]{2,4}$/.test(k) && !SKIP.has(k) && !/座$|时$|局$/.test(k))
  .sort((a, b) => b.length - a.length);
const RE = new RegExp(`(${NAMES.join('|')}|\\d+(?:\\.\\d+)?)`, 'g');

/** Tách dòng thành khuôn + danh sách giá trị. */
export function toTemplate(line) {
  const vals = [];
  const tpl = line.replace(RE, (m) => {
    vals.push(m);
    return `⟨${vals.length - 1}⟩`;
  });
  return { tpl, vals };
}

// ⟨n|than⟩: khi tên cung thực ra là từ chỉ người thân ("和父母感情好" = hoà thuận với cha mẹ)
const KIN_VI = {
  父母: 'cha mẹ', 父母宫: 'cha mẹ', 兄弟: 'anh chị em', 兄弟宫: 'anh chị em', 子女: 'con cái', 子女宫: 'con cái',
  夫妻: 'vợ chồng', 夫妻宫: 'vợ chồng', 交友: 'bạn bè', 仆役: 'bạn bè', 田宅: 'nhà cửa', 财帛: 'tiền bạc',
};
export const TOKEN_RE = /⟨(\d+)(?:\|(\w+))?⟩/g;

/** Ghép bản dịch khuôn với giá trị (tên sao đổi sang tiếng Việt). */
export function fromTemplate(viTpl, vals) {
  return viTpl.replace(TOKEN_RE, (_, i, mod) => {
    const v = vals[Number(i)];
    if (v === undefined) return '';
    // Thái Dương trong "phơi nắng" mang nghĩa thông thường, không phải tên sao.
    if (mod === 'nghia' && (v === '太阳' || v === '太陽')) return 'nắng';
    if (mod === 'than') return KIN_VI[v] ?? (NAME_VI[v] ?? v).toLowerCase();
    return NAME_VI[v] ?? v;
  });
}

/** Bộ nhớ dịch: file JSON Lines {zh, vi}, nạp vào Map. */
export function loadTM(file) {
  const tm = new Map();
  if (fs.existsSync(file))
    for (const l of fs.readFileSync(file, 'utf8').split('\n')) {
      if (!l) continue;
      const { zh, vi } = JSON.parse(l);
      tm.set(zh, vi);
    }
  return tm;
}
