import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const apply = process.argv.includes('--apply');
const corrections = JSON.parse(fs.readFileSync('lib/translation-corrections.json', 'utf8'));
const revision = crypto.createHash('sha256').update(JSON.stringify(corrections)).digest('hex');
const correctionMap = new Map(corrections);
const correctionPattern = new RegExp(corrections.map(([text]) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');

const shard = process.argv.find(a => a.startsWith('--shard='))?.split('=')[1];
const reportPath = shard ? `reports/vietnamese-audit-${shard}.json` : 'reports/vietnamese-audit.json';
fs.mkdirSync('reports', { recursive: true });
const seed = fs.existsSync(reportPath) ? reportPath : 'reports/vietnamese-audit.json';
const report = fs.existsSync(seed) ? JSON.parse(fs.readFileSync(seed, 'utf8')) : { files: {} };
const allFiles = fs.readdirSync('data/v4-vi').filter(f => /^\d{4}-\d{2}\.jsonl\.zst$/.test(f)).sort();
const files = shard ? allFiles.filter((_, i) => i % 2 === Number(shard)) : allFiles;
for (let i = 0; i < files.length; i++) {
  const file = files[i], location = path.join('data/v4-vi', file), stat = fs.statSync(location);
  let signature = `${stat.size}:${stat.mtimeMs}`;
  if (report.files[file]?.signature === signature && (!apply || report.files[file]?.editorialRevision === revision)) continue;
  const result = { signature, records: 0, fields: 0, errors: {}, examples: [], editorialReplacements: 0 };
  let text = zlib.zstdDecompressSync(fs.readFileSync(location)).toString();
  if (apply) {
    const edited = text.replace(correctionPattern, match => { result.editorialReplacements++; return correctionMap.get(match); });
    if (edited !== text) {
      const compressed = zlib.zstdCompressSync(Buffer.from(edited), { params: { [zlib.constants.ZSTD_c_compressionLevel]: 1 } });
      if (zlib.zstdDecompressSync(compressed).toString() !== edited) throw new Error(`Compression mismatch: ${file}`);
      fs.writeFileSync(location + '.tmp', compressed);
      fs.renameSync(location + '.tmp', location);
      const updated = fs.statSync(location);
      result.signature = `${updated.size}:${updated.mtimeMs}`;
      text = edited;
    }
    result.editorialRevision = revision;
  }
  const checks = [
    ['han', /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/],
    ['token', /⟨[^⟩\n]*⟩/], ['duplicateCung', /\bcung\s+cung\b/i],
    ['replacementCharacter', /\ufffd/],
  ].filter(([, pattern]) => pattern.test(text));
  for (const line of text.split('\n')) {
    if (!line) continue;
    const row = JSON.parse(line);
    if (!row.k || !row.c || typeof row.c !== 'object') throw new Error(`Invalid record: ${file}`);
    result.records++;
    for (const [field, value] of Object.entries(row.c)) {
      if (typeof value !== 'string') throw new Error(`Invalid field: ${file}:${row.k}:${field}`);
      result.fields++;
      for (const [type, pattern] of checks) {
        const match = pattern.exec(value);
        if (!match) continue;
        result.errors[type] = (result.errors[type] || 0) + 1;
        if (result.examples.length < 12) result.examples.push({ key: row.k, field, type, text: value.slice(Math.max(0, match.index - 80), match.index + 160) });
      }
    }
  }
  report.files[file] = result;
  report.updatedAt = new Date().toISOString();
  fs.writeFileSync(reportPath + '.tmp', JSON.stringify(report, null, 2) + '\n');
  fs.renameSync(reportPath + '.tmp', reportPath);
  if ((i + 1) % 12 === 0) console.log(`${i + 1}/${files.length}: ${file}`);
}
const totals = { files: files.length, records: 0, fields: 0, errors: {} };
for (const file of files) {
  const row = report.files[file];
  totals.records += row.records; totals.fields += row.fields;
  for (const [key, count] of Object.entries(row.errors)) totals.errors[key] = (totals.errors[key] || 0) + count;
}
report.totals = totals;
report.complete = true;
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(totals));
