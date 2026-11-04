# Aranya

Read AGENTS.md before doing anything. It is the operating contract.

## Project

Open-source Indian environmental-law workspace agent. Skills run on Claude Code.

## Structure

- `.claude/skills/<name>/SKILL.md`: five skills — `env-catalog` (legal spine), `env-case-analysis`, `eia-review`, `hea-rea-calculator`, `ngt-compensation-argument`
- `.claude/schemas/`: JSON Schemas plus `layout.json`, the writable-path allow-list
- `.claude/scripts/`: `write-guard` and `validate-on-write` hooks, `lib.mjs`, and `hea-rea.mjs` (the calculator)
- `catalog/provisions.json`: the legal catalog, every entry source-cited with a verification state
- `matters/{id}/`: per-matter workspace (`matter.json`, append-only `flags.jsonl`, `findings/`, `calc/`)

## Rules

1. Only write paths in `.claude/schemas/layout.json`. The write-guard enforces it.
2. Every JSON/JSONL file satisfies the schema its layout rule names.
3. `flags.jsonl` is append-only.
4. Cite a provision for every finding; never fabricate a citation; nothing `verify`/`unverified` goes into a court-facing document unconfirmed.
5. REA/HEA is novel persuasive methodology, never established Indian law.
6. Check NGT Schedule I jurisdiction before NGT relief; cite EIA 2006, never the 2020 draft.
7. Not legal advice. Include the disclaimer for anything court-facing.

## Validation

```
npm run validate
npm test
```
