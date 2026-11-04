---
name: hea-rea-calculator
description: Run the deterministic Resource/Habitat Equivalency Analysis calculator to size restoration against ecological injury (discounted service-years), with a sensitivity range. Produces expert-witness input material, never a single compensation figure. Use for "REA", "HEA", "quantify environmental damage", "restoration scaling".
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

1. **Validate inputs** against `injury-params.schema.json` (areas in hectares; service levels 0..1; a named `method` of `HEA` or `REA`).
2. **Run** `node .claude/scripts/hea-rea.mjs <params.json> --out matters/{id}/calc/{run}.json`.
3. **Read the output** — debit and credit in discounted service-hectare-years, the restoration area needed, the scaling ratio, and an optional cost when an expert unit cost is supplied.
4. **Sensitivity** — always present the range over the contested service-loss fraction and the discount rate; never a single number.

## Guardrails

- The service-loss fraction is a contested expert judgement, not a lookup. A qualified ecological expert must validate every input before filing.
- Output is always `methodology_status: novel_persuasive`; the schema forbids an "established" status.
- Keep HEA (habitat) and REA (specific resource services) distinct; state which was used and why.
- Tooling, not legal advice.

## Commands

| Run | Action |
|---|---|
| `/hea-rea-calculator run` | Validate parameters and compute debit, credit, restoration scale and sensitivity |
