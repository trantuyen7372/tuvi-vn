// Thêm bản dịch một lô vào bộ nhớ dịch, có kiểm tra ký hiệu ⟨n⟩.
// node scripts/tm-add.mjs <lô.json (mảng zh)> <bản dịch.json (mảng vi, cùng thứ tự)> <tm.jsonl>
// vi = "" nghĩa là bỏ dòng đó (ví dụ câu trích bài giảng còn sót, câu phán chuyện sống chết).
import fs from 'node:fs';
const [, , zhFile, viFile, tmFile] = process.argv;
const zh = JSON.parse(fs.readFileSync(zhFile, 'utf8'));
const vi = JSON.parse(fs.readFileSync(viFile, 'utf8'));
if (zh.length !== vi.length) throw new Error(`Số dòng lệch: zh ${zh.length}, vi ${vi.length}`);
const tokens = (s) => [...s.matchAll(/⟨(\d+)(?:\|\w+)?⟩/g)].map((m) => m[1]).sort().join(',');
const bad = [];
zh.forEach((z, i) => {
  if (vi[i] === '') return;
  if (tokens(z) !== tokens(vi[i])) bad.push(`${i}: ${z}  =>  ${vi[i]}`);
  if (/[一-鿿]/.test(vi[i])) bad.push(`${i}: còn chữ Hán: ${vi[i]}`);
});
if (bad.length) {
  console.error(bad.join('\n'));
  process.exit(1);
}
fs.appendFileSync(tmFile, zh.map((z, i) => JSON.stringify({ zh: z, vi: vi[i] })).join('\n') + '\n');
console.log(`Đã thêm ${zh.length} dòng`);
