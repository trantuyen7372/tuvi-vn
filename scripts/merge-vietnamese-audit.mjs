import fs from 'node:fs';
import crypto from 'node:crypto';

const corrections = JSON.parse(fs.readFileSync('lib/translation-corrections.json', 'utf8'));
const revision = crypto.createHash('sha256').update(JSON.stringify(corrections)).digest('hex');
const shards = [0, 1].map(i => JSON.parse(fs.readFileSync(`reports/vietnamese-audit-${i}.json`, 'utf8')));
const files = {};
const totals = { files: 0, records: 0, fields: 0, editorialReplacements: 0, errors: {} };
for (let year = 1950; year <= 2026; year++) for (let month = 1; month <= 12; month++) {
  const file = `${year}-${String(month).padStart(2, '0')}.jsonl.zst`;
  const stat = fs.statSync(`data/v4-vi/${file}`);
  const row = shards.map(s => s.files[file]).find(r => r?.editorialRevision === revision && r.signature === `${stat.size}:${stat.mtimeMs}`);
  if (!row) throw new Error(`Missing or stale audit: ${file}`);
  const expected = new Date(Date.UTC(year, month, 0)).getUTCDate() * 24;
  if (row.records !== expected) throw new Error(`Record count: ${file}: ${row.records}/${expected}`);
  files[file] = row;
  totals.files++; totals.records += row.records; totals.fields += row.fields;
  totals.editorialReplacements += row.editorialReplacements;
  for (const [key, count] of Object.entries(row.errors)) totals.errors[key] = (totals.errors[key] || 0) + count;
}
const report = { complete: true, updatedAt: new Date().toISOString(), editorialRevision: revision, totals, files };
fs.writeFileSync('reports/vietnamese-audit.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(totals));
