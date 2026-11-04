# Changelog

## Unreleased

### Calculator
- Input is validated before any arithmetic. A discount rate of 3, a missing `recovery_years`, swapped service levels, an unknown `method` or a mistyped field used to produce a number and exit 0.
- Errors are plain messages with exit 1, not stack traces. `--out` creates the matter folder. A symlinked path no longer does nothing silently.
- Sensitivity now moves all seven expert inputs, and each row carries a cost. New `range` field and optional `currency`. The summary leads with the range, because the methodology says the result must never be reduced to one figure.
- The methodology states the time base and the end-of-year convention.

### Guardrails
- A finding needs a `catalog_id` that exists in the catalog, with a matching `source_url` and `verification`. A made-up citation could be saved as `source_cited` before.
- Agents can't edit `catalog/provisions.json` or record `expert_validated`. `expert_validated` now requires `validated_by` and `validated_at`.
- Hooks find the workspace from `${CLAUDE_PROJECT_DIR}` and the event's `cwd`. Before, a `cd` into a subdirectory made the hook crash with exit 1, which does not block, so writes went through.
- The write-guard fails closed: a broken layout blocks the write, and `onFailure: block` covers a hook that cannot start (Claude Code 2.1.295 or newer).
- `.claude/scripts`, `.claude/schemas` and `.claude/settings.json` are out of the writable layout.
- Secret patterns catch OpenSSH keys, `github_pat_` and `sk-ant-` keys, and JSON-style passwords. "password: hardcoded" in prose no longer blocks a write.
- New guardrail tests; before this, all 8 tests covered the calculator.

### Repository
- `.gitattributes` keeps LF on every platform. On a Windows checkout with Git's default settings, `env-case-analysis` and `ngt-compensation-argument` dropped out of plain-English routing, and the append-only guard blocked real appends.
- `npm run validate` rejects a skill description that is not valid YAML. All 5 are now quoted.
- Your own matters are gitignored by default; only the synthetic sample is tracked.
- `"private": true`, because `aranya` on npm is another package. Added `repository`, `SECURITY.md`, `CITATION.cff` and a bug template. Fixed the LICENSE copyright line and the stale "staged in Vigil" note.

## 0.1.0 — 2026-11-04

First public release.

- Five Claude Code skills: `env-catalog`, `env-case-analysis`, `eia-review`, `hea-rea-calculator`, `ngt-compensation-argument`.
- Provision-indexed legal catalog (`catalog/provisions.json`), every entry source-cited to a primary source with a verification state. Last verified 4 November 2026.
- Deterministic REA/HEA calculator (`.claude/scripts/hea-rea.mjs`): discounted service-year debit and credit, a mandatory sensitivity range, a human-readable summary, an expert-validation gate, and 8 tests.
- First-class section-flagging (append-only `matters/*/flags.jsonl`).
- Schema-enforced guardrails: `methodology_status` can only be `novel_persuasive`; `validation_status` starts at `pending_expert_review`; a `source_url` and verification state are required on legal claims.
- Worked synthetic sample matter (`matters/sample-estuary`).
- GitHub Actions CI, `docs/METHODOLOGY.md`, `CONTRIBUTING.md`, and a paper handoff brief.
