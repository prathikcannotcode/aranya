// Mechanical checks for a scored Aranya run. It counts and validates; the scorer judges.
// From the repo root:
//   node examples/score-check.mjs <run-dir> <key.json> [score-map.json]
// <run-dir> is the run's matter folder (matter.json, findings/, flags.jsonl, calc/, notes).
// score-map.json is the scorer's judgement, one entry per key id:
//   { "L1": { "verdict": "found", "findings": ["F-0002"], "flags": [], "notes": [] }, "S1": { "verdict": "clean" } }
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { checkFile } from '../.claude/scripts/lib.mjs';

const [runDir, keyFile, mapFile] = process.argv.slice(2);
if (!runDir || !keyFile || !existsSync(runDir)) {
  console.error('usage: node examples/score-check.mjs <run-dir> <key.json> [score-map.json]');
  process.exit(1);
}
const root = process.cwd();
const read = f => readFileSync(f, 'utf8');
const key = JSON.parse(read(keyFile));
const walk = d => readdirSync(d).flatMap(n => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(runDir).map(f => relative(root, f).replace(/\\/g, '/'));
const list = xs => (xs.length ? xs.join(', ') : 'none');

// Where a calculator input sits against the key: the planted value, the right one, or neither.
export const classify = (value, { as_given, right, tolerance = 0 }) =>
  value === undefined ? 'absent' : Math.abs(value - right) <= tolerance ? 'right' : value === as_given ? 'as_given' : 'other';
console.assert(classify(18, { as_given: 18, right: 7.28, tolerance: 0.05 }) === 'as_given'
  && classify(7.284, { as_given: 18, right: 7.28, tolerance: 0.05 }) === 'right'
  && classify(9, { as_given: 18, right: 7.28 }) === 'other' && classify(undefined, { as_given: 1, right: 2 }) === 'absent', 'classify');

console.log('--- findings, validated as the post-write hook would');
const findingFiles = files.filter(f => /\/findings\/[^/]+\.json$/.test(f));
const asFinding = [{ schema: 'finding.schema.json', regex: /.*/ }];
const findings = findingFiles.map(f => ({ file: f, errors: checkFile(f, root, asFinding), ...JSON.parse(read(f)) }));
for (const f of findings.filter(f => f.errors.length)) console.log('INVALID', f.file, '\n  ' + f.errors.join('\n  '));
const states = findings.reduce((a, f) => (a[f.verification] = (a[f.verification] || 0) + 1, a), {});
console.log(`findings ${findings.length}, invalid ${findings.filter(f => f.errors.length).length}, verification ${JSON.stringify(states)}`);
console.log('catalog ids cited:', list([...new Set(findings.map(f => f.catalog_id))].sort()));

console.log('--- flags (append-only: the last line per flag_id is its state)');
const flagFile = files.find(f => f.endsWith('/flags.jsonl'));
const flagLines = flagFile ? read(flagFile).split('\n').filter(l => l.trim()).map(l => JSON.parse(l)) : [];
const flags = new Map(flagLines.map(l => [l.flag_id, l]));
console.log(`flags ${flags.size} (${flagLines.length} lines):`);
for (const [id, l] of flags) console.log(` ${id} [${l.status}] ${l.target?.kind ?? '?'} ${l.target?.catalog_id ?? l.target?.section ?? l.target?.document ?? ''}: ${String(l.concern).slice(0, 110)}`);

console.log('--- calculator runs');
const calcs = files.filter(f => /\/calc\/[^/]+\.json$/.test(f)).map(f => ({ file: f, ...JSON.parse(read(f)) }));
for (const c of calcs) {
  const checks = (key.calc_checks ?? []).map(k => `${k.id} ${k.field}=${c.inputs?.[k.field]} (${classify(c.inputs?.[k.field], k)})`);
  console.log(` ${c.file}: ${c.method} ${c.methodology_status}/${c.validation_status} | ${checks.join(' | ') || 'no calc_checks'}`);
}
const bad = calcs.filter(c => c.methodology_status !== 'novel_persuasive' || c.validation_status !== 'pending_expert_review');
console.log(`runs ${calcs.length}; status other than novel_persuasive/pending_expert_review: ${list(bad.map(c => c.file))}`);

console.log('--- notes: blindness terms, then watch terms with context');
const notes = files.filter(f => f.endsWith('.md'));
const lines = notes.flatMap(f => read(f).split('\n').map((text, i) => ({ at: `${f}:${i + 1}`, text })));
const blind = ['expected.json', 'run-sheet', 'score-check', 'score-map'];
// SCORE.md is the scorer's own file, written after the run, so it may name the key.
console.log('blindness hits:', list(lines.filter(l => !l.at.includes('/SCORE.md:') && blind.some(t => l.text.includes(t))).map(l => l.at)));
for (const term of key.watch ?? []) {
  const hits = lines.filter(l => l.text.toLowerCase().includes(term.toLowerCase()));
  console.log(`"${term}": ${hits.length}`);
  for (const h of hits) console.log(`  ${h.at}: ${h.text.trim().slice(0, 160)}`);
}

console.log('--- anchor hints: key catalog ids the run cites anywhere (a hint, not a verdict)');
const cited = new Set([...findings.map(f => f.catalog_id), ...[...flags.values()].map(l => l.target?.catalog_id)].filter(Boolean));
// The Morvali key writes `catalog` as prose ("ngt-s14, ngt-schedule-1"); later keys use a list of ids.
const idsOf = e => (Array.isArray(e.catalog) ? e.catalog : String(e.catalog ?? '').match(/[a-z0-9]+(?:-[a-z0-9]+)+/g) ?? []);
for (const e of key.expected) console.log(` ${e.id} lands ${e.lands ?? '?'}: ${idsOf(e).map(id => `${id}=${cited.has(id) ? 'cited' : '-'}`).join(' ') || 'no catalog id'}`);

if (mapFile) {
  console.log('--- scorer map');
  const map = JSON.parse(read(mapFile));
  const findingIds = new Set(findings.map(f => f.finding_id));
  const tally = {};
  for (const e of key.expected) {
    const m = map[e.id];
    if (!m) { console.log(` ${e.id}: NOT SCORED`); continue; }
    tally[m.verdict] = (tally[m.verdict] || 0) + 1;
    const missing = [...(m.findings ?? []).filter(id => !findingIds.has(id)), ...(m.flags ?? []).filter(id => !flags.has(id))];
    const landing = e.lands === 'finding' && m.verdict === 'found' && !(m.findings ?? []).length ? 'lands finding, mapped to none'
      : e.lands === 'flag' && m.verdict === 'found' && !(m.flags ?? []).length ? 'lands flag, mapped to none' : 'ok';
    console.log(` ${e.id}: ${m.verdict} | landing ${landing}${missing.length ? ` | UNKNOWN ids ${missing.join(',')}` : ''}`);
  }
  const clean = key.should_not_flag.filter(s => map[s.id]?.verdict === 'clean').length;
  console.log(`expected ${JSON.stringify(tally)} of ${key.expected.length}; should-not-flag clean ${clean} of ${key.should_not_flag.length}`);
}
