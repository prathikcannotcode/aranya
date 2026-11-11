# Kanthari Nala run sheet

`examples/kanthari-nala` measures what Aranya does with a pollution matter that turns on the CPCB compensation methodology, the Supreme Court's compensation cases and the NGT Act's time limits, all of which the catalog holds, and on Water Act consent points, which it does not. Its key is `examples/kanthari-nala.expected.json`. One session runs the matter and never opens the key; a second session scores it.

The Morvali Creek run could not test two things, and this run should: the session started in a parent folder, so Aranya's own hooks never fired and its skills were not in the skill list. Start this one in the exported Aranya folder itself.

## Run session: cold, never opens the key

Export committed revisions, so uncommitted skill text can't help the run. `<commit>` is the Aranya revision under test. It must include the operating-rule fallbacks and the instrument-level check from PR #11, or W1 tests nothing. `<fixture-commit>` is any commit that has `examples/kanthari-nala`. Commit a fixture under a subject that says nothing about its planted issues. From the repo root:

```bash
BLIND="$HOME/aranya-blind-kanthari"
mkdir -p "$BLIND/aranya" "$BLIND/record"
git archive <commit> | tar -x -C "$BLIND/aranya"
git archive <fixture-commit> examples/kanthari-nala | tar -x --strip-components=2 -C "$BLIND/record"
find "$BLIND/aranya/examples" -mindepth 1 -maxdepth 1 ! -name sample-injury.json -exec rm -rf {} +
```

Then start a new Claude Code session with its working directory set to `$BLIND/aranya`, with no other session's context, notes or transcripts.

1. Check that the session lists Aranya's five skills (`env-catalog`, `env-case-analysis`, `eia-review`, `hea-rea-calculator`, `ngt-compensation-argument`). If it lists another project's skills, it started in the wrong folder: stop and start again.
2. Add the record with `/add-dir` and the path to `$BLIND/record`.
3. Send this, and nothing else about the matter:

   > A new matter's file is in the record folder you just added. Read `01-instructing-note.md` and act on it, using this workspace's skills and rules. Open the matter as `matters/kanthari-nala`. Work offline: do not use the web or open any GitHub page.

4. Answer questions only from the record. If the run asks something the record can't answer, say so.
5. When it stops, run `npm run validate -- --strict` in `$BLIND/aranya`.
6. Hand over `$BLIND/aranya/matters/kanthari-nala/` and the transcript. Do not score.

## Scoring session: separate, reads the key

Copy the run's matter folder to `examples/kanthari-nala.run-<n>/`, then from the repo root:

```bash
node examples/score-check.mjs examples/kanthari-nala.run-<n> examples/kanthari-nala.expected.json
```

The script validates every finding the way the hook would, tallies flags and calculator runs, checks the calculator inputs against `calc_checks`, and prints every line of the notes that mentions a `watch` term. It does not judge. Write your judgement into `examples/kanthari-nala.run-<n>/score-map.json`, one entry per key id:

```json
{
  "L1": { "verdict": "found", "findings": ["F-0002"], "flags": [], "notes": [] },
  "S1": { "verdict": "clean" }
}
```

Run the script again with that file as a third argument for the tallies, then write `SCORE.md`.

- **Blindness.** Search the transcript for `expected.json`, `run-sheet`, `score-check` and `github.com`. A hit in anything the run read voids the run.
- **Each `expected` item.** Found: the finding, flag or note states the mechanism the issue names, with the record documents it points to. Partial: right topic, mechanism missing or wrong. Missed: neither.
- **Landing.** For `lands: finding`, the item needs a finding citing one of the key's `catalog` ids; a flag alone is partial. For `lands: flag`, it needs a flag; a finding on a parent instrument that names a section should not exist, because validation rejects it. For `lands: note`, the calculator or argument note. For `either`, any of these.
- **Verification state.** For items resting on a `verify` or `unverified` entry, record whether the run carried that state into its findings and kept the entry out of court-facing text.
- **Each `should_not_flag` item.** Violated if a finding, flag or note treats it as a gap. A neutral mention is clean.
- **Other findings.** A finding that matches a `known_gaps` item is a real gap. Check the rest against the record and call each a real gap the key missed or a false positive.
- **Citations.** List every authority the notes rely on that the catalog doesn't hold. Each should be flagged, not relied on.
- **Hooks.** Search the transcript for "Write blocked" and "Validation failed". Record whether the hooks fired at least once. If they never did, say the run doesn't show them working.

Report found, partial and missed out of the `expected` count, landing errors, should-not-flag violations out of its count, and the other tallies. Commit `SCORE.md`, `score-map.json` and the run's matter folder under `examples/kanthari-nala.run-<n>/`.

Tuning skills or the catalog on a scored run ends this fixture's blindness. Say so in any later score; another blind measurement needs a new fixture.

## Key changes

None yet.
