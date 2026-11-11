---
name: hea-rea-calculator
description: "Run the deterministic Resource/Habitat Equivalency Analysis calculator to size restoration against ecological injury (discounted service-years), with a sensitivity range. Produces expert-witness input material, never a single compensation figure. Use for \"REA\", \"HEA\", \"quantify environmental damage\", \"restoration scaling\"."
---

# REA/HEA calculator

## Trigger

"REA", "HEA", "equivalency analysis", "quantify environmental damage", "restoration scaling", "compensation quantum", "service-acre-years"

## Purpose

Size compensatory restoration by matching the discounted ecological-service losses of an injury (the debit) against the discounted service gains of a restoration project (the credit), via `.claude/scripts/hea-rea.mjs`. The output is expert-witness input material: a defensible, auditable restoration scale and cost range, not a final figure.

## Legal basis

- Methodologies `hea` and `rea` in the catalog, both `methodology_status: novel_persuasive` — no documented NGT or Indian precedent.
- The restoration-cost output is argued under NGT Act `ngt-s15`/`ngt-s17` and `ngt-schedule-2` (cost of environmental restoration).

## Capabilities

1. **Gather inputs** per `injury-params.schema.json`: `method` (`HEA` or `REA`), `injured_area` in hectares, `baseline_service` and `injured_service` (0..1), `injury_years`, `recovery_years`, `restoration_gain` (0..1), `restoration_years` and `discount_rate` as a fraction (0.03 means 3%). Optional: `restoration_lag` (years from the start of the injury until restoration delivers service), `restoration_unit_cost` per hectare, `currency`. If any required input is missing, ask for it. Never assume one.
2. **Run** `npm run calc -- <params.json> --out matters/{id}/calc/{run}.json`. The calculator validates the inputs and refuses bad ones; show the user its message rather than adjusting the numbers yourself. When the record contradicts the inputs you were given, run them as given first, then each labelled alternative from its own file in `matters/{id}/inputs/`.
3. **Read the output** — debit and credit in discounted service-hectare-years, the restoration area needed, the scaling ratio, and an optional cost when an expert unit cost is supplied.
4. **Sensitivity**: always present `range` first (area, and cost if there is one). It moves each expert input by `sensitivity_pct` one at a time, so it is not a worst case; say which rows move the result most.

## Guardrails

- The service-loss fraction is a contested expert judgement, not a lookup. A qualified ecological expert must validate every input before filing.
- Output is always `methodology_status: novel_persuasive`; the schema forbids an "established" status.
- Every result carries `validation_status: pending_expert_review`; only a named human expert may record it as `expert_validated`, by hand, with `validated_by` and `validated_at`. The write-guard blocks an agent from doing it.
- Keep HEA (habitat) and REA (specific resource services) distinct; state which was used and why.
- Tooling, not legal advice.

## Commands

| Run | Action |
|---|---|
| `/hea-rea-calculator run` | Validate parameters and compute debit, credit, restoration scale and sensitivity |
