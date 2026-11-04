---
name: eia-review
description: Review an EIA report or Environmental Clearance against the EIA Notification 2006 checklist, flagging gaps and breached EC conditions. Reviews documents; it does not conduct an EIA study. Use for "review this EIA", "EC conditions", "EIA notification compliance".
---

# EIA review

## Trigger

"review this EIA", "environmental clearance", "EC conditions", "EIA notification compliance", "flag EC condition"

## Purpose

Review a supplied EIA report or Environmental Clearance against the EIA Notification 2006 and flag omissions and breaches. This skill reviews documents against the regulatory checklist. It does not conduct an EIA: baseline ecology, hydrology and field surveys are expert studies, not a document task.

## Legal basis

- EIA Notification 2006, `eia-notif-2006` and `eia-2006-process` (screening, scoping/ToR, public consultation, appraisal, conditions), issued under EPA 1986 `epa-s3`.
- The draft EIA Notification 2020 is not law and is never applied.

## Capabilities

1. **Checklist** — test the document across the 2006 stages: category (A/B, B1/B2), Terms of Reference, baseline data, impact prediction, mitigation, public-hearing record, EAC/SEAC appraisal, and the EC conditions and monitoring plan.
2. **Condition review** — list EC conditions; flag any the record shows as unmet or breached.
3. **Findings** — write gaps to `matters/{id}/findings/*.json`, each citing the 2006 Notification with its verification state.
4. **Flagging** — a specific EC condition or report clause can be flagged (`target.kind: "document"`, `locator`) into `matters/{id}/flags.jsonl`.

## Guardrails

- Reviews documents only; never asserts field facts it was not given.
- Cites the 2006 Notification, never the 2020 draft.
- Every finding cites the provision and its `verification` state; tooling, not legal advice.

## Commands

| Run | Action |
|---|---|
| `/eia-review checklist` | Review an EIA report against the 2006 stages |
| `/eia-review conditions` | List and test EC conditions, flagging breaches |
