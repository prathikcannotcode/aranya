# Operating Rules

These rules bind all agents (AI and human) working in this repository.

## Layout

Only write files matching the paths in `.claude/schemas/layout.json`. A new file type needs a rule there and, if it is structured data, a schema. The write-guard hook enforces this. Agents do not edit `.claude/scripts`, `.claude/schemas`, `.claude/settings.json` or `catalog/provisions.json`; a human changes those by hand.

## Structured data

- Every `.json` / `.jsonl` file must be valid and conform to the schema its layout rule names. The post-write hook validates on every write.
- Run `npm run validate` and `npm test` before committing.

## Append-only logs

`matters/*/flags.jsonl` is append-only. A status change or correction is a new line with the same `flag_id`; never edit or delete existing lines.

## Findings and citations

Every finding must follow `finding.schema.json`: cite the instrument and provision, carry a severity, give a recommendation, and record a `catalog_id`, `source_url` and `verification` state. Validation checks all three against the catalog.

- **Never fabricate a citation.** Every legal claim traces to an entry in `catalog/provisions.json`. If the provision is not there, raise a flag naming it and tell the user the catalog needs an entry; do not write a finding on it.
- A claim whose catalog entry is `verify` or `unverified` must not appear in a court-facing document until a named human confirms it against the primary source.

## Methodology status

REA/HEA has no documented NGT or Indian precedent. Any calculator or argument output carries `methodology_status: novel_persuasive`; the schema does not allow `established`. Present equivalency analysis only as persuasive comparative material.

## Jurisdiction and currency

- Check NGT jurisdiction before drafting NGT relief: the harm must arise under a Schedule I enactment (`ngt-schedule-1`). The Wild Life (Protection) Act 1972 is not in Schedule I.
- The EIA Notification 2006 is in force; the draft 2020 is not law and is never cited as operative.

## Verify before asserting

Read each catalog entry's `note` as well as its `verification` state: several list points still to confirm, such as case pinpoints. Confirm against primary sources (Gazette, indiacode.nic.in, greentribunal.gov.in, the SCC reports) before relying on them.

## Disclaimer

Aranya provides tooling and informational structure. It is not legal advice. For binding decisions, instruct qualified environmental counsel and, for damage quantum, a qualified ecological expert.

## Contributing

1. Keep to the layout. Edit skills in `.claude/skills/` only.
2. One skill per directory: `.claude/skills/<name>/SKILL.md`, with `name` and `description` frontmatter.
3. Every skill needs: trigger, purpose, legal basis with catalog/clause references, capabilities, guardrails, and commands.
4. Run `npm run validate -- --strict` and `npm test` before opening a PR.
