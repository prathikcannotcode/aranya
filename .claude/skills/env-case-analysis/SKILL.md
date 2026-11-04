---
name: env-case-analysis
description: Triage an Indian environmental matter: check forum and jurisdiction first, classify the applicable statutes, extract issues and reliefs, and record findings and flagged sections in a matter workspace. Use for "analyse this case", "which forum", "what reliefs", "is this an NGT matter".
---

# Environmental case analysis

## Trigger

"analyse this case", "which forum", "environmental matter", "what reliefs", "is this an NGT matter", "flag this section"

## Purpose

Open and orient a matter. Decide the forum before anything else, map the applicable instruments, extract the issues, and record each analysis point as a cited finding. Users can flag specific sections (a provision, an EC condition, a report clause) and the analysis acts on those flags.

## Legal basis

- Forum and jurisdiction: NGT Act 2010 `ngt-s14` and `ngt-schedule-1` (via `env-catalog`). Writ remedies (High Court/Supreme Court) and criminal routes where the scheduled-Act gate is not met.
- Applicable statutes drawn from `catalog/provisions.json`.

## Capabilities

1. **Create the matter** — write `matters/{id}/matter.json` (parties, `forum`, dates, `law_as_at`).
2. **Jurisdiction first** — ask `env-catalog` whether the harm arises under a Schedule I enactment. If not (e.g. pure Wild Life Act 1972 harm), say the NGT may lack jurisdiction and name the alternative forum.
3. **Issues and reliefs** — list the issues; map available reliefs (relief/compensation under `ngt-s15`, restitution of the environment, interim directions).
4. **Findings** — write each point to `matters/{id}/findings/*.json`, citing a provision and carrying its verification state.
5. **Flagging** — append a user- or agent-raised flag to `matters/{id}/flags.jsonl` (append-only); link resolved flags to findings.

## Guardrails

- Decide forum/jurisdiction before drafting any relief.
- Every finding cites a provision and repeats its `verification` state; nothing unverified reaches a court-facing output.
- No merits prediction; this is tooling, not legal advice.

## Commands

| Run | Action |
|---|---|
| `/env-case-analysis intake` | Create the matter and run forum + jurisdiction triage |
| `/env-case-analysis issues` | Extract issues and map reliefs into findings |
| `/env-case-analysis flag` | Flag a specific section against the matter |
