// Dịch file tháng của dữ liệu v4.0 sang tiếng Việt bằng bộ nhớ dịch.
// node scripts/tm-apply.mjs <tm.jsonl> <năm> [thư mục ra=data/v4-vi] [--stats]
// Dòng chưa có bản dịch thì bỏ qua (không để chữ Hán lọt ra web); --stats chỉ in tỉ lệ đã phủ.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { toTemplate, fromTemplate, loadTM } from './tm-lib.mjs';

const [, , tmFile, year, outDir = 'data/v4-vi', ...flags] = process.argv;
const statsOnly = flags.includes('--stats') || outDir === '--stats';
const dir = process.env.TUVI_DATASET_DIR || 'data/v4';
const tm = loadTM(tmFile);
const Z = { params: { [zlib.constants.ZSTD_d_windowLogMax]: 27 } };
let total = 0, done = 0, dropped = 0;
if (!statsOnly) fs.mkdirSync(outDir, { recursive: true });

for (const f of fs.readdirSync(dir).filter((f) => f.startsWith(year + '-')).sort()) {
  const s = zlib.zstdDecompressSync(fs.readFileSync(path.join(dir, f)), Z).toString();
  const out = [];
  for (const line of s.split('\n')) {
    if (!line) continue;
    const rec = JSON.parse(line);
    const c = {};
    for (const [k, v] of Object.entries(rec.c)) {
      const vi = [];
      for (const l of v.split('\n')) {
        if (!l.trim()) { vi.push(''); continue; }
        total++;
        const { tpl, vals } = toTemplate(l);
        const t = tm.get(tpl);
        if (t === undefined) continue;
        done++;
        if (t === '') { dropped++; continue; }
        vi.push(fromTemplate(t, vals));
      }
      let text = vi.join('\n');
      // bỏ tiêu đề 【…】 không còn nội dung (các dòng của nó chưa dịch hoặc đã bỏ)
      text = text.replace(/【[^】\n]+】\n(?=\s*(?:【|$))/g, '').replace(/\n{3,}/g, '\n\n').trim();
      if (/^【[^】\n]+】$/.test(text)) text = '';
      if (text) c[k] = text;
    }
    out.push(JSON.stringify({ k: rec.k, c }));
  }
  if (!statsOnly)
    fs.writeFileSync(
      path.join(outDir, f),
      zlib.zstdCompressSync(Buffer.from(out.join('\n') + '\n'), {
        params: { [zlib.constants.ZSTD_c_compressionLevel]: 19, [zlib.constants.ZSTD_c_windowLog]: 27 },
      }),
    );
}
console.log(`${year}: ${done}/${total} dòng đã có bản dịch (${((done / total) * 100).toFixed(1)}%), ${dropped} dòng bỏ đi`);
