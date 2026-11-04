---
name: env-catalog
description: The provision-indexed legal spine (statutes, doctrines, cases, methodologies) in catalog/provisions.json. Use to look up a provision, check whether a law is in force, test NGT jurisdiction, resolve a flagged section, or cite a clause with its verification state.
---

# Environmental-law catalog

## Trigger

"which law applies", "look up section", "is this in force", "NGT jurisdiction", "cite the provision", "resolve this flag", "Schedule I"

## Purpose

Answer legal-foundation questions from `catalog/provisions.json`, the single provision-indexed source every other skill cites. A flag's `target` resolves to a catalog `id`; a finding's `provision` cites one. Nothing from here enters a court-facing document while its `verification` is `verify` or `unverified` without a named human confirming it against the primary source.

## Legal basis

Everything traces to an entry in `catalog/provisions.json`, each carrying a `source_url` and a `verification` state. Key anchors: NGT Act 2010 `ngt-s14` (jurisdiction), `ngt-s15`/`ngt-s17` (compensation and restitution), `ngt-s20` (principles), `ngt-schedule-1` (the seven scheduled enactments), `ngt-schedule-2` (heads of compensation).

## Capabilities

1. **Lookup** — return a provision/doctrine/case by `id`, instrument, or section, with its summary, citation, `source_url` and `verification` state.
2. **Resolve a flag** — given a flag `target` of `kind: "provision"`, return the catalog node it points at.
3. **Jurisdiction check** — a matter founds an NGT case only if a substantial environmental question arises out of a Schedule I enactment (`ngt-schedule-1`). The Wild Life (Protection) Act 1972 is not in Schedule I.
4. **Currency** — surface commencement and amendment flags (e.g. the 2023 amendments to the Forest and Biodiversity Acts; the EIA draft 2020 is not law).

## Guardrails

- Every answer repeats the item's `verification` state. If `verify`/`unverified`, say so and name what a human must confirm.
- The draft EIA Notification 2020 is not in force; cite only the 2006 Notification as operative.
- This is tooling, not legal advice.

## Commands

| Run | Action |
|---|---|
| `/env-catalog lookup <id or section>` | Return a catalog entry with its source and verification state |
| `/env-catalog jurisdiction` | Test whether a matter falls within NGT Schedule I |
| `/env-catalog resolve-flag <flag_id>` | Resolve a flagged provision to its catalog node |
