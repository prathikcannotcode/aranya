---
name: ngt-compensation-argument
description: "Assemble a restoration-scaled compensation argument for the NGT from the catalog and a calculator run: the Tribunal's power, the polluter-pays principle, REA/HEA as a persuasive comparative method, and the quantified restoration scale with its range. Use for \"argue for compensation\", \"NGT damage argument\", \"restoration-scaled compensation\"."
---

# NGT compensation argument

## Trigger

"argue for compensation", "NGT damage argument", "restoration-scaled compensation", "polluter pays quantum", "restitution of the environment"

## Purpose

Draft the argument that the NGT can award restoration-scaled compensation and that an equivalency analysis is a sound way to quantify it. Assembles the statutory power, the principle, the method, and the numbers into an argument note for a qualified advocate to settle.

## Legal basis

- Power: NGT Act `ngt-s15` (relief, compensation and restitution of the environment), `ngt-s17` (liability to pay), `ngt-schedule-2` (cost of environmental restoration).
- Principle: `ngt-s20` and the polluter-pays doctrine (`polluter-pays`; Vellore 1996, Indian Council for Enviro-Legal Action 1996).
- Method: `hea`/`rea`, carried as a persuasive comparative methodology only.

## Capabilities

1. **Frame the power** — cite s.15/s.17 and Schedule II for restoration cost; confirm NGT jurisdiction with `env-case-analysis`.
2. **Insert the quantum** — pull a `hea-rea-calculator` run and present the restoration scale with its sensitivity range, as expert-witness input.
3. **Position the method** — present REA/HEA via `foreign-authority-handler` (if available) as persuasive comparative material, expressly not binding Indian precedent; route every citation through `authority-verification-ledger`, else apply the catalog's verification state locally.
4. **Draft the prayer** — a restoration/compensation prayer keyed to the quantified scale.

## Guardrails

- Every output is stamped `methodology_status: novel_persuasive`; HEA/REA is never described as established Indian law.
- No citation with `verification` of `verify`/`unverified` appears in a court-facing draft without a named human confirming it.
- The quantum is expert-witness input validated by an ecological expert, not a final figure.
- Tooling, not legal advice; marked draft-not-for-filing.

## Commands

| Run | Action |
|---|---|
| `/ngt-compensation-argument build` | Assemble the argument note from the catalog and a calculator run |
