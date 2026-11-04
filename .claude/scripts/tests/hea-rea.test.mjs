import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync, existsSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeDebit, computeCreditPerHa, scaleRestoration, buildResult, summarise, runSensitivity } from '../hea-rea.mjs';
import { loadSchema, validate } from '../lib.mjs';

const scripts = join(dirname(fileURLToPath(import.meta.url)), '..');
const repo = join(scripts, '..', '..');

// Hand-checkable worked example (discount rate 0 so the arithmetic is exact):
//   injured 10 ha, baseline 1.0, injured 0.5 -> loss 0.5
//   injury 2 yrs at full loss: 0.5 + 0.5 = 1.0
//   recovery 2 yrs, linear to 0: 0.25 + 0.0 = 0.25
//   debit per ha = 1.25 -> x10 = 12.5
//   credit per ha = gain 0.5 over 5 yrs = 2.5
//   area needed = 12.5 / 2.5 = 5 ha, scaling ratio 0.5
const worked = {
  method: 'HEA',
  injured_area: 10, baseline_service: 1.0, injured_service: 0.5,
  injury_years: 2, recovery_years: 2,
  restoration_gain: 0.5, restoration_years: 5, restoration_lag: 0,
  discount_rate: 0,
};

function cli(params, ...args) {
  const dir = mkdtempSync(join(tmpdir(), 'aranya-'));
  const file = join(dir, 'params.json');
  writeFileSync(file, typeof params === 'string' ? params : JSON.stringify(params));
  const r = spawnSync(process.execPath, [join(scripts, 'hea-rea.mjs'), file, ...args.map(a => a.replace('<dir>', dir))], { cwd: repo, encoding: 'utf8' });
  return { ...r, dir };
}

test('worked example is exact at zero discount', () => {
  assert.equal(computeDebit(worked), 12.5);
  assert.equal(computeCreditPerHa(worked), 2.5);
  const s = scaleRestoration(worked);
  assert.equal(s.restoration_area_needed_ha, 5);
  assert.equal(s.scaling_ratio, 0.5);
});

test('discounting lowers both debit and credit', () => {
  const discounted = { ...worked, discount_rate: 0.05 };
  assert.ok(computeDebit(discounted) < computeDebit(worked));
  assert.ok(computeCreditPerHa(discounted) < computeCreditPerHa(worked));
  assert.ok(computeDebit(discounted) > 0);
});

test('result is schema-valid and cannot claim established status', () => {
  const result = buildResult({ ...worked, discount_rate: 0.03, restoration_unit_cost: 200000 });
  assert.equal(result.methodology_status, 'novel_persuasive');
  assert.equal(result.validation_status, 'pending_expert_review');
  assert.ok(result.estimated_cost > 0);
  const errors = validate(loadSchema('calc-result.schema.json'), result);
  assert.deepEqual(errors, [], errors.join('; '));
});

test('REA runs and stays pending expert review', () => {
  const result = buildResult({ ...worked, method: 'REA', discount_rate: 0.03 });
  assert.equal(result.method, 'REA');
  assert.equal(result.validation_status, 'pending_expert_review');
  assert.deepEqual(validate(loadSchema('calc-result.schema.json'), result), []);
});

test('restoration lag lowers the per-hectare credit', () => {
  const noLag = computeCreditPerHa({ ...worked, discount_rate: 0.05, restoration_lag: 0 });
  const lag = computeCreditPerHa({ ...worked, discount_rate: 0.05, restoration_lag: 3 });
  assert.ok(lag < noLag);
});

test('zero service credit is rejected, not reported as infinite', () => {
  assert.throws(() => buildResult({ ...worked, restoration_gain: 0 }), /no positive service credit/);
});

test('injury parameters are schema-gated', () => {
  const params = loadSchema('injury-params.schema.json');
  assert.deepEqual(validate(params, worked), []);
  assert.ok(validate(params, { ...worked, baseline_service: 5 }).length > 0);
  const { method, ...noMethod } = worked;
  assert.ok(validate(params, noMethod).length > 0);
});

test('bad inputs are rejected before any arithmetic', () => {
  const { recovery_years, ...noRecovery } = worked;
  const cases = [
    [{ ...worked, discount_rate: 3 }, /discount_rate: above maximum 1/],
    [{ ...worked, discount_rate: -0.5 }, /discount_rate: below minimum 0/],
    [noRecovery, /missing required "recovery_years"/],
    [{ ...worked, baseline_service: 0.3, injured_service: 1 }, /injured_service: cannot exceed baseline_service/],
    [{ ...worked, baseline_service: 5 }, /baseline_service: above maximum 1/],
    [{ ...worked, method: 'VIBES' }, /method: must be one of HEA, REA/],
    [{ ...worked, restoration_unit_cots: 500000 }, /unexpected property "restoration_unit_cots"/],
    [{ ...worked, injured_area: 0 }, /injured_area: must be above 0/],
  ];
  for (const [params, message] of cases) assert.throws(() => buildResult(params), message);
});

test('sensitivity varies every expert input and the range spans all rows', () => {
  const p = { ...worked, discount_rate: 0.03, restoration_lag: 2, restoration_unit_cost: 100 };
  const result = buildResult(p);
  assert.deepEqual([...new Set(result.sensitivity.map(r => r.vary))], ['loss_fraction', 'discount_rate', 'restoration_gain', 'restoration_years', 'recovery_years', 'injury_years', 'restoration_lag']);
  const areas = result.sensitivity.map(r => r.restoration_area_needed_ha);
  assert.equal(result.range.low_ha, Math.min(...areas, result.restoration_area_needed_ha));
  assert.equal(result.range.high_ha, Math.max(...areas, result.restoration_area_needed_ha));
  assert.ok(result.range.low_ha < result.restoration_area_needed_ha && result.restoration_area_needed_ha < result.range.high_ha);
  for (const row of result.sensitivity) assert.ok(row.estimated_cost > 0, row.vary);
  assert.ok(Math.abs(result.range.high_cost - result.range.high_ha * 100) < 1e-3);
});

test('an input that cannot move gets no sensitivity row', () => {
  const rows = runSensitivity(worked); // discount rate 0
  assert.ok(!rows.some(r => r.vary === 'discount_rate'));
  assert.ok(!rows.some(r => r.vary === 'restoration_lag' && r.value === 0));
  assert.ok(rows.every(r => Number.isFinite(r.restoration_area_needed_ha)));
});

test('summary leads with the range and names the currency', () => {
  const s = summarise(buildResult({ ...worked, discount_rate: 0.03, restoration_unit_cost: 500000, currency: 'INR' }));
  assert.match(s, /HEA/);
  assert.match(s, /pending_expert_review/);
  assert.match(s, /restoration: \d+\.\d\d to \d+\.\d\d ha across the sensitivity range/);
  assert.match(s, /cost: INR [\d,]+ to INR [\d,]+;/);
  assert.match(summarise(buildResult({ ...worked, restoration_unit_cost: 100 })), /currency not stated/);
});

test('CLI reports bad input plainly and exits 1', () => {
  for (const [params, message] of [[{ ...worked, discount_rate: 3 }, /discount_rate/], ['not json', /not valid JSON/]]) {
    const r = cli(params);
    assert.equal(r.status, 1);
    assert.match(r.stderr, message);
    assert.doesNotMatch(r.stderr, /\n\s+at /, 'no stack trace');
    rmSync(r.dir, { recursive: true });
  }
});

test('CLI creates the output folder', () => {
  const r = cli(worked, '--out', '<dir>/matters/new-matter/calc/run-1.json');
  assert.equal(r.status, 0, r.stderr);
  assert.ok(existsSync(join(r.dir, 'matters/new-matter/calc/run-1.json')));
  rmSync(r.dir, { recursive: true });
});

test('CLI still runs when reached through a symlink', { skip: process.platform === 'win32' }, () => {
  const r = cli(worked);
  const link = join(r.dir, 'calc.mjs');
  symlinkSync(join(scripts, 'hea-rea.mjs'), link);
  const linked = spawnSync(process.execPath, [link, join(r.dir, 'params.json')], { encoding: 'utf8' });
  assert.equal(linked.status, 0, linked.stderr);
  assert.match(linked.stdout, /restoration_area_needed_ha/);
  rmSync(r.dir, { recursive: true });
});

test('the committed sample run reproduces from its inputs', () => {
  const committed = JSON.parse(readFileSync(join(repo, 'matters/sample-estuary/calc/run-1.json'), 'utf8'));
  const { generated: _a, ...fresh } = buildResult(committed.inputs);
  const { generated: _b, ...stored } = committed;
  assert.deepEqual(fresh, stored);
});
