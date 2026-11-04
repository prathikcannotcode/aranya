# Contributing to Aranya

Aranya is tooling, not legal advice. The project's credibility rests on its citation discipline, so contributions must preserve it.

## Ground rules

- Keep to the layout in `.claude/schemas/layout.json`. A new file type needs a layout rule and, for structured data, a schema.
- Run `npm run validate -- --strict` and `npm test` before opening a PR. CI runs both on every push.
- One skill per directory: `.claude/skills/<name>/SKILL.md`, with `name` and `description` frontmatter and the sections Trigger / Purpose / Legal basis / Capabilities / Guardrails / Commands.

## Citation discipline (the important part)

Every legal claim traces to an entry in `catalog/provisions.json`. Each entry carries:

- `source_url` — a primary or authoritative source.
- `verification` — one of:
  - `source_cited` — checked against the cited source on the stated date;
  - `verify` — likely correct, but a human must confirm the pinpoint against the primary source;
  - `unverified` — not confirmed; must not reach a court-facing output.

To verify an entry: open its `source_url`, confirm the proposition and the exact citation (section number, SCC pinpoint, Gazette S.O./G.S.R. number and date), update `verification`, and record what you checked in `note`. **Never invent a citation.** Never move `methodology_status` away from `novel_persuasive` without a documented Indian authority.

## The calculator

`.claude/scripts/hea-rea.mjs` is deterministic. Any change needs a test in `.claude/scripts/tests/` and must keep the worked-example self-check exact. Results must stay a range and must carry `methodology_status: novel_persuasive` and `validation_status: pending_expert_review`. See [docs/METHODOLOGY.md](docs/METHODOLOGY.md).
