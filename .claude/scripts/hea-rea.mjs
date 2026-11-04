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

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DISCLAIMER =
  'Expert-witness input material, not a final compensation figure. REA/HEA is a persuasive comparative methodology with no documented NGT precedent; a qualified ecological expert must validate every assumption before filing.';

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

/** Vary the two contested inputs (loss fraction and discount rate) by +/- pct. */
export function runSensitivity(p, pct = p.sensitivity_pct ?? 0.2) {
  const rows = [];
  const base = baselineLoss(p);
  for (const m of [1 - pct, 1, 1 + pct]) {
    rows.push({ vary: 'loss_fraction', factor: round(m), ...scaleRestoration(withLoss(p, base * m)) });
  }
  for (const m of [1 - pct, 1, 1 + pct]) {
    rows.push({ vary: 'discount_rate', factor: round(m), ...scaleRestoration({ ...p, discount_rate: p.discount_rate * m }) });
  }
  return rows;
}

function baselineLoss(p) { return p.baseline_service - p.injured_service; }
function withLoss(p, loss) {
  const injured = Math.min(p.baseline_service, Math.max(0, p.baseline_service - loss));
  return { ...p, injured_service: injured };
}
function round(x) { return Number.isFinite(x) ? Math.round(x * 1e6) / 1e6 : x; }

/** Full, schema-valid result object. */
export function buildResult(p) {
  const core = scaleRestoration(p);
  if (!Number.isFinite(core.restoration_area_needed_ha)) {
    throw new Error('restoration parameters yield no positive service credit (check restoration_gain and restoration_years).');
  }
  const result = {
    method: p.method,
    methodology_status: 'novel_persuasive',
    validation_status: 'pending_expert_review',
    ...core,
    inputs: { ...p },
    sensitivity: runSensitivity(p),
    disclaimer: DISCLAIMER,
    generated: new Date().toISOString(),
  };
  if (p.restoration_unit_cost !== undefined && Number.isFinite(core.restoration_area_needed_ha)) {
    result.estimated_cost = round(core.restoration_area_needed_ha * p.restoration_unit_cost);
  }
  return result;
}

// --- CLI ------------------------------------------------------------------
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const file = process.argv[2];
  if (!file) { console.error('usage: hea-rea.mjs <params.json> [--out result.json]'); process.exit(1); }
  const params = JSON.parse(readFileSync(file, 'utf8'));
  const result = buildResult(params);
  const outIdx = process.argv.indexOf('--out');
  if (outIdx !== -1 && process.argv[outIdx + 1]) {
    writeFileSync(process.argv[outIdx + 1], JSON.stringify(result, null, 2) + '\n');
    console.log(`Wrote ${process.argv[outIdx + 1]}`);
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
}
