# Changelog

## 0.1.0 — 2026-11-04

First public release.

- Five Claude Code skills: `env-catalog`, `env-case-analysis`, `eia-review`, `hea-rea-calculator`, `ngt-compensation-argument`.
- Provision-indexed legal catalog (`catalog/provisions.json`), every entry source-cited to a primary source with a verification state. Last verified 4 November 2026.
- Deterministic REA/HEA calculator (`.claude/scripts/hea-rea.mjs`): discounted service-year debit and credit, a mandatory sensitivity range, a human-readable summary, an expert-validation gate, and 8 tests.
- First-class section-flagging (append-only `matters/*/flags.jsonl`).
- Schema-enforced guardrails: `methodology_status` can only be `novel_persuasive`; `validation_status` starts at `pending_expert_review`; a `source_url` and verification state are required on legal claims.
- Worked synthetic sample matter (`matters/sample-estuary`).
- GitHub Actions CI, `docs/METHODOLOGY.md`, `CONTRIBUTING.md`, and a paper handoff brief.
