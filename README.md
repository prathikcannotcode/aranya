# Aranya

[![CI](https://github.com/prathikcannotcode/aranya/actions/workflows/ci.yml/badge.svg)](https://github.com/prathikcannotcode/aranya/actions/workflows/ci.yml)

Open-source Indian environmental-law workspace agent that runs on Claude Code as a set of skills. It helps analyse an environmental matter, review an EIA or Environmental Clearance, and build a restoration-scaled damage argument for the National Green Tribunal using Resource/Habitat Equivalency Analysis. It is tooling, not legal advice (see Status, scope and limitations).

## What it does

1. **Analyse a matter** — classify the applicable statutes, decide the forum, and (jurisdiction first) say whether it is an NGT case, a writ, or another route. `env-case-analysis`.
2. **Review an EIA / Environmental Clearance** — test a supplied document against the EIA Notification 2006 checklist and flag gaps and breached EC conditions. It reviews documents; it does not conduct an EIA study. `eia-review`.
3. **Quantify environmental damage** — a deterministic Resource/Habitat Equivalency Analysis (REA/HEA) calculator that scales restoration against injury in discounted service-years, with a sensitivity range, and an NGT argument that places that quantum under the Tribunal's restitution power. `hea-rea-calculator`, `ngt-compensation-argument`.

All of it rests on `env-catalog`, the provision-indexed legal spine.

## Flag a section

Any provision, EC condition, judgment paragraph or report clause can be flagged. A flag is an anchored record in a matter's append-only `flags.jsonl`; skills resolve, explain, test, or argue against it.

## Status, scope and limitations

- **Pre-release (v0.1).** The catalog is a verified seed, not an exhaustive statement of the law. Every entry records a `source_url` and a verification state; entries still needing a human pinpoint check are flagged in their `note`.
- **Not legal advice.** Tooling that a qualified lawyer, and for damage figures a qualified ecological expert, must review. Every calculator result is stamped `validation_status: pending_expert_review` until a named expert validates its inputs.
- **REA/HEA is a novel persuasive methodology in India:** there is no documented NGT or Indian precedent. The schema forbids presenting it as established law (`methodology_status` can only be `novel_persuasive`).
- **A range, not a figure.** The calculator always returns a sensitivity range; the service-loss fraction is contested expert judgement, not a lookup.
- Only the EIA Notification 2006 is applied; the draft 2020 is not in force.
- See [docs/METHODOLOGY.md](docs/METHODOLOGY.md) for the equations and their limits, and [CONTRIBUTING.md](CONTRIBUTING.md) for the citation-verification discipline.

## Layout

- `.claude/skills/<name>/SKILL.md` — the five skills
- `.claude/schemas/` — JSON Schemas and `layout.json` (the writable-path allow-list)
- `.claude/scripts/` — the write-guard and validate hooks, the shared lib, and `hea-rea.mjs`
- `catalog/provisions.json` — the legal catalog, every entry source-cited with a verification state
- `matters/{id}/` — per-matter workspace: `matter.json`, `flags.jsonl`, `findings/`, `calc/`

## Run

```
npm run validate      # schema + skill checks
npm test              # calculator self-check
npm run calc examples/sample-injury.json
```

## Licence

Apache-2.0.
