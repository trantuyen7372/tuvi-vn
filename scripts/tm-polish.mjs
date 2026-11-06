// Sửa cách diễn đạt trong TM và dữ liệu Việt khi không có dữ liệu Hán gốc.
// node scripts/tm-polish.mjs [--apply]
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const replacements = JSON.parse(fs.readFileSync(new URL('../lib/translation-corrections.json', import.meta.url), 'utf8'));
const apply = process.argv.includes('--apply');
const replacementMap = new Map(replacements);
const replacementPattern = new RegExp(replacements.map(([text]) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
function polish(text) {
  return text.replace(replacementPattern, (match) => replacementMap.get(match));
}
const tmPath = 'tm/tm.jsonl';
const originalTM = fs.readFileSync(tmPath, 'utf8');
let changedTemplates = 0;
const tm = originalTM.trimEnd().split('\n').map((line) => {
  const row = JSON.parse(line);
  const vi = polish(row.vi);
  if (vi !== row.vi) changedTemplates++;
  return JSON.stringify({ ...row, vi });
}).join('\n') + '\n';
if (apply && changedTemplates) {
  const backup = `${tmPath}.before-polish`;
  if (!fs.existsSync(backup)) fs.writeFileSync(backup, originalTM);
  fs.writeFileSync(tmPath, tm);
}
let changedFiles = 0, changedFields = 0, records = 0;
for (const file of fs.readdirSync('data/v4-vi').filter((f) => f.endsWith('.jsonl.zst')).sort()) {
  const location = path.join('data/v4-vi', file);
  const input = zlib.zstdDecompressSync(fs.readFileSync(location)).toString();
  records += input.match(/\n/g)?.length ?? 0;
  // Các cụm sửa không chứa ký tự cần escape JSON; thay trực tiếp tránh
  // parse/stringify hàng trăm nghìn bài luận dài.
  const output = input.replace(replacementPattern, (match) => {
    changedFields++;
    return replacementMap.get(match);
  });
  if (output !== input) {
    changedFiles++;
    if (apply) {
      const compressed = zlib.zstdCompressSync(Buffer.from(output), {
        params: { [zlib.constants.ZSTD_c_compressionLevel]: 1, [zlib.constants.ZSTD_c_windowLog]: 27 },
      });
      // Kiểm tra nội dung trước khi thay tệp qua thao tác rename.
      if (zlib.zstdDecompressSync(compressed).toString() !== output) throw new Error(file);
      fs.writeFileSync(`${location}.tmp`, compressed);
      fs.renameSync(`${location}.tmp`, location);
    }
  }
  if (changedFiles % 100 === 0 && output !== input) console.log(`${changedFiles} tệp đã xử lý`);
}
console.log(JSON.stringify({ apply, changedTemplates, changedFiles, changedFields, records }));
