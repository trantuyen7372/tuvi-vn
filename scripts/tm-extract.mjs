// Lấy các khuôn câu của một năm chưa có trong bộ nhớ dịch, sắp theo tần suất, chia lô.
// node scripts/tm-extract.mjs <năm> <tm.jsonl> <thư mục ra> [cỡ lô=80]
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { toTemplate, loadTM } from './tm-lib.mjs';

const [, , year, tmFile, outDir, size = '80'] = process.argv;
const dir = process.env.TUVI_DATASET_DIR || 'data/v4';
const tm = loadTM(tmFile);
const freq = new Map();
const ex = new Map(); // một ví dụ giá trị cho mỗi khuôn, để người dịch biết ⟨n⟩ là gì
for (const f of fs.readdirSync(dir).filter((f) => f.startsWith(year + '-'))) {
  const s = zlib.zstdDecompressSync(fs.readFileSync(path.join(dir, f)), { params: { [zlib.constants.ZSTD_d_windowLogMax]: 27 } }).toString();
  for (const line of s.split('\n')) {
    if (!line) continue;
    for (const v of Object.values(JSON.parse(line).c))
      for (const l of v.split('\n')) {
        if (!l.trim()) continue;
        const { tpl, vals } = toTemplate(l);
        if (tm.has(tpl)) continue;
        freq.set(tpl, (freq.get(tpl) ?? 0) + 1);
        if (!ex.has(tpl)) ex.set(tpl, vals);
      }
  }
}
const list = [...freq.entries()].sort((a, b) => b[1] - a[1]).map(([zh]) => zh);
fs.mkdirSync(outDir, { recursive: true });
const n = Number(size);
let batches = 0;
for (let i = 0; i < list.length; i += n) {
  const name = path.join(outDir, `${year}-${String(i / n + 1).padStart(3, '0')}.json`);
  fs.writeFileSync(name, JSON.stringify(list.slice(i, i + n), null, 0));
  fs.writeFileSync(name.replace(/\.json$/, '.ex.json'), JSON.stringify(list.slice(i, i + n).map((t) => ex.get(t))));
  batches++;
}
console.log(`${year}: ${list.length} khuôn chưa dịch, ${batches} lô`);
