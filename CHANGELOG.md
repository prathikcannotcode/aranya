# Changelog

## Unreleased

- Aranya installs as a Claude Code plugin: `.claude-plugin/plugin.json` and a marketplace file. It ships the skills, the catalog and the calculator, and no hooks, because a plugin-wide write guard would block every edit in a project with no layout. Four skills say where to find the catalog and the calculator when there is no workspace.

## 0.3.2 (2026-11-09)

- The README says where Aranya comes from: the book *Evolution of Environmental Jurisprudence in India: The National Green Tribunal* (Cambridge University Press, 2025), and the aim of making REA/HEA compensation analysis free and open to anyone.

## 0.3.1 (2026-11-09)

- The catalog disclaimer and AGENTS.md now say it plainly: AI can make mistakes, and a licensed attorney should check everything before you rely on it. Entries marked `verify` or `unverified` still stay out of court-facing documents until they are checked against the primary source.

## 0.3.0 (2026-11-09)

### Catalog
- 18 new entries and 6 corrected, each traced to a primary source: NGT Act s.15(3) and s.16; the EIA 2006 General Condition, para 8(vi), para 10 and Appendix IV; the CPCB environmental compensation method and the NGT order on it; *Vanashakti* (recalled in 2025 and decided afresh in 2026 INSC 761); *Rhythm County*, *C.L. Gupta*, *Goel Ganga* and related compensation cases; and all fourteen Schedule II heads.
- The sample finding, the methodology, the README and the paper brief cite Schedule II without fixing a single head, and the brief uses the 2026 *Vanashakti* decision.
- The README and disclaimer say it once and plainly: AI can make mistakes, and a licensed attorney should check everything before you rely on it.

## 0.2.0 (2026-11-09)

### Evaluation and catalog
- First scored run, on the synthetic Morvali Creek matter: `examples/morvali-creek.run-1`. 14 of 14 planted issues found.
- `catalog/patches/2026-11-source-pack/`: 18 new and 6 corrected catalog entries with their sources. Applied in 0.3.0.
- The README gains a section on how Aranya was tested.

### Calculator
- Input is validated before any arithmetic. A discount rate of 3, a missing `recovery_years`, swapped service levels, an unknown `method` or a mistyped field used to produce a number and exit 0.
- Errors are plain messages with exit 1, not stack traces. `--out` creates the matter folder. A symlinked path no longer does nothing silently.
- Sensitivity now moves all seven expert inputs, and each row carries a cost. New `range` field and optional `currency`. The summary leads with the range, because the methodology says the result must never be reduced to one figure.
- The methodology states the time base and the end-of-year convention.

### Guardrails
- A finding needs a `catalog_id` that exists in the catalog, with a matching `source_url` and `verification`. A made-up citation could be saved as `source_cited` before.
- Agents can't edit `catalog/provisions.json` or record `expert_validated`. `expert_validated` now requires `validated_by` and `validated_at`.
- Hooks find the guard under `${CLAUDE_PROJECT_DIR}`, or relative to the working directory in a session that moved here from elsewhere, and find the workspace from the event's `cwd`. Before, a `cd` into a subdirectory made the hook crash with exit 1, which does not block, so writes went through.
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
