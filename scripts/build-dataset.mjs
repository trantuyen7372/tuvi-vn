// Chuẩn bị bộ dữ liệu giải sẵn v4.0 (ziwei-doushu, CC BY 4.0) cho web:
//  - chỉ giữ các mục cần cho luận giải (tổng quan, định điệu, luận chính, cổ thư, cảnh báo)
//  - bỏ mọi câu trích Nghê Hải Hạ / Thiên Kỷ (giấy phép phi thương mại) và ghi chú hiệu đính
//  - chia lại theo tháng, nén zstd, để tra 1 lá số chỉ cần giải nén ~1 tháng
// Cách chạy: node scripts/build-dataset.mjs <thư mục chứa year-YYYY.jsonl.zst> <thư mục ra>
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import readline from 'node:readline';

const [, , inDir, outDir] = process.argv;
if (!inDir || !outDir) {
  console.error('Usage: node scripts/build-dataset.mjs <inDir> <outDir>');
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });

const KEEP = /总览|一句话定调|核心论断|经典出处|风险提醒|针对你的命盘/;
const NI = /倪|天纪|天紀/;

export function clean(md) {
  const parts = md.split(/\*\*【([^】]+)】\*\*/); // ['', head1, body1, head2, body2...]
  const out = [];
  for (let i = 1; i < parts.length; i += 2) {
    const head = parts[i];
    if (!KEEP.test(head)) continue;
    let body = parts[i + 1]
      .replace(/\*\*关键推导\*\*[\s\S]*?(\n\s*\n|$)/g, '\n')
      .replace(/★[^）\n]*/g, '')
      .replace(/（\s*）/g, '')
      .replace(/（古籍格局属文学化表述[^）]*）/g, '');
    body = body
      .split('\n')
      .map((line) => {
        if (!NI.test(line)) return line;
        // bỏ từng câu có nhắc Nghê Hải Hạ, giữ phần còn lại của dòng
        const sentences = line.match(/[^。！？；]+[。！？；]?/g) ?? [];
        return sentences.filter((s) => !NI.test(s)).join('');
      })
      .filter((l) => l.trim() !== '' && !/^[>·\s]*$/.test(l))
      .join('\n');
    if (body.trim()) out.push(`【${head.replace('⚠️ ', '')}】\n${body.trim()}`);
  }
  return out.join('\n\n');
}

const files = fs.readdirSync(inDir).filter((f) => /^year-\d{4}\.jsonl\.zst$/.test(f)).sort();
for (const f of files) {
  const t0 = Date.now();
  const months = new Map();
  const dec = zlib.createZstdDecompress({ params: { [zlib.constants.ZSTD_d_windowLogMax]: 27 } });
  const rl = readline.createInterface({ input: fs.createReadStream(path.join(inDir, f)).pipe(dec), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line) continue;
    const r = JSON.parse(line);
    const c = {};
    for (const [k, v] of Object.entries(r.c)) c[k] = clean(v);
    const key = `${r.y}-${String(r.m).padStart(2, '0')}`;
    if (!months.has(key)) months.set(key, []);
    months.get(key).push(JSON.stringify({ k: r.k, c }));
  }
  for (const [key, lines] of months) {
    const buf = zlib.zstdCompressSync(Buffer.from(lines.join('\n') + '\n'), {
      params: { [zlib.constants.ZSTD_c_compressionLevel]: 19, [zlib.constants.ZSTD_c_windowLog]: 27 },
    });
    fs.writeFileSync(path.join(outDir, `${key}.jsonl.zst`), buf);
  }
  console.log(f, months.size, 'tháng', ((Date.now() - t0) / 1000).toFixed(1) + 's');
}
