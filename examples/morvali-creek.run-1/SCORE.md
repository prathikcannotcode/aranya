# Morvali Creek, run 1: score

Run on 5 November 2026 against `examples/morvali-creek`, a synthetic matter. Answer list: `examples/morvali-creek.expected.json`, committed in `edb3103` before the run. Output is in `examples/morvali-creek.run-1/`, moved from `matters/morvali-creek/`, so paths inside the notes use the old location. Not legal advice.

**Result: 14 of 14 found, 6 of 6 should-not-flag items clean, no invented citation, every finding on a real catalog id. That overstates Aranya.** Four of the 14 rest on law the catalog does not hold, which the run supplied from model memory. See "How far to trust this".

## Score

| ID | Planted issue | Found | Where | Citation |
|---|---|---|---|---|
| J1 | Wild Life Act outside Schedule I | Yes | F-0002, FL-0001 | Correct. Names writ and criminal routes. |
| L1 | s.14 runs from "first arose", 2024, not the 2026 fish kill | Yes | F-0003 | Correct, but says s.14, not s.14(3). Dates right. |
| L2 | s.15(3) five years keeps restoration alive | Yes | FL-0003 | Correct. **Not in catalog; from memory.** Flagged as required. |
| L3 | EC challenge is a s.16 appeal, long out of time | Yes | FL-0002 | Correct, but says s.16, not s.16(h). **Not in catalog.** 30 days from EC condition G4, 60 from memory. |
| X1 | Invented case | Yes | FL-0004 | Not relied on anywhere. |
| E1 | Sanctuary at 3.2 km against "None" in Form 1, wrong appraising body | Yes | F-0009, FL-0010, FL-0011, FL-0012 | General Condition and para 8(vi) named. **Not in catalog; from memory.** Recalled distance is 10 km; secondary sources say 5 km since 2014. Same result at 3.2 km. |
| E2 | Hearing: 12 days' notice, one English paper, no local summary | Yes | F-0013, FL-0013 | Para 7 Stage 3 correct. Appendix IV named without paragraphs. **Not in catalog; from memory.** |
| E3 | 2018 baseline against the three-year ToR limit | Yes | F-0010, FL-0016 | Correct. |
| E4 | S1 breach; compliance report contradicted | Yes | F-0014, F-0015, FL-0014, FL-0015 | Correct. All three inspections. |
| C1 | baseline 1.0 against 0.58 | Yes | F-0016, F-0006, FL-0019 | Correct, with s.17 apportionment. |
| C2 | lag 0 against the proposal | Yes | F-0017, FL-0020 | Correct. Brackets with lag 6 and 12. |
| C3 | Ran as given, range first, status stamped | Yes | `calc/run-1.json`, `calculator-note.md` | Inputs identical to the record. Alternatives labelled as the run's own. |
| A1 | Refuses "well established" and one figure | Yes | F-0018, FL-0021, `argument-note.md` | Stamped `novel_persuasive`, draft not for filing, disclaimer present. |
| A2 | s.15(1)(c), s.17, Schedule II (g), s.20, polluter pays | Yes | `argument-note.md` section 2 and 3, ledger | Correct. Adds Kamal Nath. Pleads head (g) only in the alternative, with reasons. |

| Should not flag | Result |
|---|---|
| Greenbelt G1 | Clean: "Not yet due. No breach. Do not plead." |
| Van Adhiniyam renaming | Clean: no jurisdiction point taken. |
| ADM presiding | Clean: marked no gap. |
| 42 ha area | Clean: marked supported. |
| Consent to Operate | Clean: not challenged. |
| Draft EIA 2020 | Clean: cited only to say it is not law. |

## Citations outside the catalog

No finding uses one. Each appears as a flag, or in a note marked as unconfirmed recollection:

- NGT Act s.15(3), s.16, s.18, and the closure and interim power (no section given)
- Wild Life Act ss.29 and 51
- Water Act s.33A
- EIA Notification Schedule General Condition, item 5(j), para 8(vi), Appendix IV
- *Bhavani Sugars* (invented for this test; flagged and not used)
- *Vanashakti* (2025), mentioned only in a catalog note, and reported as unconfirmed

## How far to trust this

- **Memory did the work on L2, L3, E1 and E2.** On catalog text alone, s.14 gives six months and s.15 gives no period, so a run could call the restoration claim dead. A different model might.
- **The hooks were not exercised.** The session started in the parent Vigil folder, so its hook settings pointed at Vigil's guard, which has no `expert_validated` rule. The run's probe with that string saved, and so did a finding with a made-up `catalog_id`. Aranya's own guard blocks the string when run directly. `npm run validate -- --strict` passed at the end (41 files). `npm test`: 26 pass, 0 fail, 2 skipped on Windows.
- **Routing was not exercised.** Aranya's skills were not in the session's skill list, so the run read each `SKILL.md`. Plain-English triggers are untested.
- **The same model wrote the list and ran the skills.** No lawyer has reviewed the list. The NGT and EIA text behind it was read on secondary copies, because India Code refused the fetch. The run had no web.
- **The fixture leaks in two places.** EC condition G4 names s.16, which real ECs do but which makes L3 easier. The "SYNTHETIC" header says citations are invented, and the run noticed. Fix that header before reusing the matter.
- **The fixture has an error the run caught.** The road approval of 8 May 2023 is labelled under the Van Adhiniyam, but the catalog puts that name at about 1 December 2023.
- **Blindness.** The transcript has no reference to this answer list. The only hits for the check's terms are Vigil's `acme-demo.expected.json`, in the git status attached to every session. The run broke its brief twice, both logged: one read-only `git rev-parse`, and a temporary `/tmp/val.txt`.

## Where a skill was confusing

Nothing stalled: the calculator rejected nothing and no write was refused. Every point below is a call the run had to make. Full text in `run-log.md`.

1. **"Not in the catalog".** Does an instrument-level entry count for its sections? The rules say no finding, `eia-review` capability 3 says each gap cites the 2006 Notification, and the validator accepts the parent id. Call: a section without its own entry gets a flag.
2. **The two strongest points cannot be findings.** The out-of-time EC appeal and the wrong authority live only as flags and marked recollection. The run could not tell whether notes may state them at all, and kept them out of court-facing text.
3. **`law_as_at`.** Catalog says 3 November, README and changelog 4 November. Call: 3 November.
4. **`forum` takes one value** and this matter splits across forums. Call: `ngt`, with the split in `description`.
5. **`flag.schema.json` has no kind for a case.** Call: `document`.
6. **One `flag_id` per finding**, and "link resolved flags" when none is resolved. Call: main flag in the finding, the rest through `linked_findings`.
7. **`verify`/`unverified` gate has nothing to act on.** Every entry is `source_cited`, while notes list open pinpoints. Call: treat note items as unconfirmed and cite cases without pinpoints.
8. **Schedule II head (g).** The skill, methodology and sample place a restoration figure there, but the catalog's summary words it around Government expenses, and this applicant is private. Call: lead with s.15(1)(c), head (g) in the alternative.
9. **May an agent run other inputs?** The skill bars adjusting numbers after a refusal, and is silent when the record contradicts accepted inputs. Call: run as given, then labelled alternatives.
10. **`restoration_lag` needs a time zero and a design-life start**, and nothing fixes them. The calculator has no ramp for gain that builds over years. Call: September 2024, works start, and a bracket of lag 6 and 12.
11. **Where alternative inputs go.** `calc/` must hold results. Call: `matters/{id}/inputs/`, which the catch-all rule allows.
12. **Expert validation against a filing date.** No file says what happens when they collide. Call: plead the scale as to be established by expert evidence.
13. **No merits prediction against naming exposed points.** Call: name risks, give no view on outcome.
14. **The instructions and `AGENTS.md` conflict.** Call: `AGENTS.md` wins, and each refusal is stated.
15. **Named skills default to `.docx`.** `foreign-authority-handler` and `authority-verification-ledger` assume Word output and a style guide. Call: apply their workflow inside the Markdown note.

## Bugs found, none fixed

1. **High.** Catalog omits NGT s.15(3) and s.16, the two periods that decide this matter, and the s.15 entry is silent on limitation.
2. **High.** Catalog omits the EIA General Condition, para 8(vi), Appendix IV and post-clearance monitoring. F-0014 and F-0015 had to cite para 7 for a post-grant breach. The recalled 10 km shows the cost of filling the gap from memory.
3. **Medium.** From `lib.mjs`: a finding on an uncatalogued section passes validation if `catalog_id` names the parent instrument, against the written rule.
4. **Medium.** The verification gate cannot fire on current data, because every catalog entry is `source_cited`.
5. **Medium.** Head (g) may not fit a private applicant, yet the skill, methodology and sample finding rely on it. Needs a lawyer.
6. **Low.** The sensitivity range can miss the real dispute. Its lowest loss here is 0.68 against the survey's 0.43, and its lag row tests 0 to 1 against 6 to 12, yet the skill leads with it.
7. **Low.** The only test of the hook commands is skipped on Windows, and CI runs on Ubuntu alone, so nothing tests them on Windows, where the changelog records earlier hook failures.

## Date check

`catalog/provisions.json` says `law_as_at` 2026-11-03, and its disclaimer says items were checked that day. `README.md:156` and `CHANGELOG.md:31` say last verified 4 November 2026. `matters/sample-estuary/matter.json` says 2026-11-04.

They should agree, and they don't. The catalog file was last modified on 3 November, and 4 November is the release date, so 3 November looks like the true check date. A re-check that changed nothing would leave no trace, so only the person who did it can settle this. Either that person confirms 4 November and updates the catalog by hand, or the README and changelog move to 3 November.
