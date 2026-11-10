#!/usr/bin/env node

/**
 * Resource / Habitat Equivalency Analysis calculator.
 *
 * Sizes compensatory restoration by matching discounted ecological-service
 * losses (the debit) against the discounted service gains of a restoration
 * project (the credit), after NOAA's equivalency-analysis method. Losses and
 * gains are in discounted service-hectare-years (DSHY); the U.S. literature
 * calls these discounted service-acre-years.
 *
 * Every input is an expert judgement, not a lookup. The output is expert-witness
 * input material, never a final compensation figure, and the method is a
 * persuasive comparative one with no documented NGT precedent (see the catalog).
 *
 * Run: node .claude/scripts/hea-rea.mjs <params.json> [--out result.json]
 */

import { readFileSync, writeFileSync, mkdirSync, realpathSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSchema, validate, loadLayout, matchRule, realPath } from './lib.mjs';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const DISCLAIMER =
  'Expert-witness input material, not a final compensation figure. REA/HEA is a persuasive comparative methodology with no documented NGT precedent; a qualified ecological expert must validate every assumption before filing.';

/** Throws with every problem listed, so a bad input can never reach the arithmetic. */
export function checkParams(p) {
  const errors = validate(loadSchema('injury-params.schema.json', ROOT), p, '$', ROOT);
  if (!errors.length) {
    if (p.injured_service > p.baseline_service) errors.push('$.injured_service: cannot exceed baseline_service');
    if (p.injured_area === 0) errors.push('$.injured_area: must be above 0');
  }
  if (errors.length) throw new Error(`Invalid parameters:\n  ${errors.join('\n  ')}`);
}

/** Discounted service-hectare-years lost on the injured site (the debit). */
export function computeDebit(p) {
  const { injured_area, baseline_service, injured_service, injury_years, recovery_years, discount_rate: r } = p;
  const lossAtInjury = baseline_service - injured_service;
  let perHa = 0;
  for (let t = 0; t < injury_years; t++) {
    perHa += lossAtInjury / Math.pow(1 + r, t);
  }
  for (let k = 0; k < recovery_years; k++) {
    const t = injury_years + k;
    const loss = lossAtInjury * (1 - (k + 1) / recovery_years); // linear return to baseline
    perHa += loss / Math.pow(1 + r, t);
  }
  return injured_area * perHa;
}

/** Discounted service-hectare-years delivered by one hectare of restoration (the credit). */
export function computeCreditPerHa(p) {
  const { restoration_gain, restoration_years, restoration_lag = 0, discount_rate: r } = p;
  let perHa = 0;
  for (let k = 0; k < restoration_years; k++) {
    const t = restoration_lag + k;
    perHa += restoration_gain / Math.pow(1 + r, t);
  }
  return perHa;
}

/** Scale the restoration so its credit offsets the debit. */
export function scaleRestoration(p) {
  const debit = computeDebit(p);
  const creditPerHa = computeCreditPerHa(p);
  const area = creditPerHa > 0 ? debit / creditPerHa : Infinity;
  return {
    debit_dsay: round(debit),
    credit_per_ha_dsay: round(creditPerHa),
    restoration_area_needed_ha: round(area),
    scaling_ratio: p.injured_area > 0 ? round(area / p.injured_area) : null,
  };
}

/**
 * Vary each expert input by +/- pct, one at a time. Whole-year inputs move by at
 * least a year. An input that cannot move (a discount rate of 0, say) gets no row.
 */
export function runSensitivity(p, pct = p.sensitivity_pct ?? 0.2) {
  const scaled = v => [v * (1 - pct), v * (1 + pct)];
  const years = v => [v - Math.max(1, Math.round(v * pct)), v + Math.max(1, Math.round(v * pct))];
  const loss = p.baseline_service - p.injured_service;
  const inputs = [
    ['loss_fraction', loss, scaled(loss).map(v => Math.min(v, p.baseline_service)), v => ({ injured_service: p.baseline_service - v })],
    ['discount_rate', p.discount_rate, scaled(p.discount_rate), v => ({ discount_rate: v })],
    ['restoration_gain', p.restoration_gain, scaled(p.restoration_gain).map(v => Math.min(v, 1)), v => ({ restoration_gain: v })],
    ['restoration_years', p.restoration_years, years(p.restoration_years).map(v => Math.max(v, 1)), v => ({ restoration_years: v })],
    ['recovery_years', p.recovery_years, years(p.recovery_years).map(v => Math.max(v, 0)), v => ({ recovery_years: v })],
    ['injury_years', p.injury_years, years(p.injury_years).map(v => Math.max(v, 0)), v => ({ injury_years: v })],
    ['restoration_lag', p.restoration_lag ?? 0, years(p.restoration_lag ?? 0).map(v => Math.max(v, 0)), v => ({ restoration_lag: v })],
  ];
  return inputs
    .flatMap(([vary, base, values, apply]) => values
      .filter(value => value !== base)
      .map(value => {
        const row = { vary, value: round(value), ...scaleRestoration({ ...p, ...apply(value) }) };
        return { ...row, ...costOf(p, row.restoration_area_needed_ha) };
      }))
    .filter(row => Number.isFinite(row.restoration_area_needed_ha));
}

function costOf(p, area) {
  return p.restoration_unit_cost === undefined ? {} : { estimated_cost: round(area * p.restoration_unit_cost) };
}
function round(x) { return Number.isFinite(x) ? Math.round(x * 1e6) / 1e6 : x; }

/** Full, schema-valid result object. */
export function buildResult(p) {
  checkParams(p);
  const core = scaleRestoration(p);
  if (!Number.isFinite(core.restoration_area_needed_ha)) {
    throw new Error('restoration parameters yield no positive service credit (check restoration_gain and restoration_years).');
  }
  const base = { ...core, ...costOf(p, core.restoration_area_needed_ha) };
  const sensitivity = runSensitivity(p);
  const span = key => [base, ...sensitivity].map(row => row[key]);
  return {
    method: p.method,
    methodology_status: 'novel_persuasive',
    validation_status: 'pending_expert_review',
    ...base,
    range: {
      low_ha: Math.min(...span('restoration_area_needed_ha')),
      high_ha: Math.max(...span('restoration_area_needed_ha')),
      ...(base.estimated_cost === undefined ? {} : { low_cost: Math.min(...span('estimated_cost')), high_cost: Math.max(...span('estimated_cost')) }),
    },
    inputs: { ...p },
    sensitivity,
    disclaimer: DISCLAIMER,
    generated: new Date().toISOString(),
  };
}

/** One-screen human-readable summary of a result. */
export function summarise(r) {
  const ha = x => x.toFixed(2);
  const currency = r.inputs.currency;
  const money = x => `${currency ? `${currency} ` : ''}${Math.round(x).toLocaleString('en-IN')}`;
  const lines = [
    `${r.method} equivalency analysis [${r.methodology_status}, ${r.validation_status}]`,
    `  debit: ${ha(r.debit_dsay)} discounted service-hectare-years lost`,
    `  restoration: ${ha(r.range.low_ha)} to ${ha(r.range.high_ha)} ha across the sensitivity range; ${ha(r.restoration_area_needed_ha)} ha at the stated inputs (scaling ratio ${ha(r.scaling_ratio)})`,
  ];
  if (r.estimated_cost !== undefined) {
    lines.push(`  cost: ${money(r.range.low_cost)} to ${money(r.range.high_cost)}; ${money(r.estimated_cost)} at the stated inputs${currency ? '' : ' (currency not stated)'}`);
  }
  lines.push(`  ${r.disclaimer}`);
  return lines.join('\n');
}

function isMain() {
  try { return fileURLToPath(import.meta.url) === realpathSync(process.argv[1]); } // realpath: a symlinked path must not silently do nothing
  catch { return false; }
}

// --- CLI ------------------------------------------------------------------
if (isMain()) {
  const file = process.argv[2];
  if (!file) { console.error('usage: hea-rea.mjs <params.json> [--out result.json]'); process.exit(1); }
  try {
    const result = buildResult(JSON.parse(readFileSync(file, 'utf8')));
    console.error(summarise(result));
    const outIdx = process.argv.indexOf('--out');
    if (outIdx !== -1 && process.argv[outIdx + 1]) {
      const out = process.argv[outIdx + 1];
      // --out runs outside the write-guard, so it takes only a new calc file in this workspace.
      const rel = relative(realPath(ROOT), realPath(resolve(out))).replace(/\\/g, '/');
      if (matchRule(loadLayout(ROOT), rel)?.schema !== 'calc-result.schema.json') {
        throw new Error(`--out must be matters/<id>/calc/<run>.json in this workspace, got ${out}`);
      }
      mkdirSync(dirname(out), { recursive: true });
      try { writeFileSync(out, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' }); }
      catch (e) { throw e.code === 'EEXIST' ? new Error(`${out} already exists. A run is a record: pick a new run name.`) : e; }
      console.log(`Wrote ${out}`);
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
