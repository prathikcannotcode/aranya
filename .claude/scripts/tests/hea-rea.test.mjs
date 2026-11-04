import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeDebit, computeCreditPerHa, scaleRestoration, buildResult } from '../hea-rea.mjs';
import { loadSchema, validate } from '../lib.mjs';

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
  assert.ok(result.estimated_cost > 0);
  const errors = validate(loadSchema('calc-result.schema.json'), result);
  assert.deepEqual(errors, [], errors.join('; '));
});
