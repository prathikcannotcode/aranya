# Aranya

Open-source Indian environmental-law workspace agent. Aranya runs on Claude Code as a set of skills, mirroring the architecture of the Vigil privacy agent inside which it is currently staged. It is a separate project and is meant to be lifted into its own repository.

## What it does

1. **Analyse a matter** — classify the applicable statutes, decide the forum, and (jurisdiction first) say whether it is an NGT case, a writ, or another route. `env-case-analysis`.
2. **Review an EIA / Environmental Clearance** — test a supplied document against the EIA Notification 2006 checklist and flag gaps and breached EC conditions. It reviews documents; it does not conduct an EIA study. `eia-review`.
3. **Quantify environmental damage** — a deterministic Resource/Habitat Equivalency Analysis (REA/HEA) calculator that scales restoration against injury in discounted service-years, with a sensitivity range, and an NGT argument that places that quantum under the Tribunal's restitution power. `hea-rea-calculator`, `ngt-compensation-argument`.

All of it rests on `env-catalog`, the provision-indexed legal spine.

## Flag a section

Any provision, EC condition, judgment paragraph or report clause can be flagged. A flag is an anchored record in a matter's append-only `flags.jsonl`; skills resolve, explain, test, or argue against it.

## What it is not

- Not legal advice. Tooling that a qualified lawyer and, for damage figures, a qualified ecological expert must review.
- REA/HEA is a **novel persuasive methodology** in India: there is no documented NGT precedent for it. The schema forbids presenting it as established law.
- The draft EIA Notification 2020 is not in force; only the 2006 Notification is applied.

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
