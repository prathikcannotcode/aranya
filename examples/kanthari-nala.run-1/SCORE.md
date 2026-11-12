# Kanthari Nala, run 1: score

Run on 11 and 12 November 2026 against `examples/kanthari-nala`, a synthetic matter. Key: `examples/kanthari-nala.expected.json` as committed in `5d847d5`, before the run. Tool revision: `918a2e6`, the head of PR #11, not yet on `main`. The output in this folder is the run's `matters/kanthari-nala/`, copied unchanged; `score-map.json` and this file are the scorer's. Not legal advice.

**Result: 14 of 14 found, 0 partial, 6 of 6 should-not-flag items clean, no uncatalogued or invented authority relied on, and all 16 findings valid on real catalog ids.** The run also found a mistake in the key (W1). Read "How far to trust this" before quoting the number.

## Setup

- Export as in the run sheet, with one change: the record went inside the workspace at `record/` instead of being added with `/add-dir`, so the run could read it without a prompt for an outside folder. The run sheet now says so.
- A new Claude Code desktop session with its working directory at `~/aranya-blind-kanthari/aranya`, model claude-opus-5-5, auto permission mode, fresh context. It received a two-sentence background (what an Aranya workspace is, and that the file is in `record/`) and this brief:

  > First, list the skills you can see in this session. Then: a new matter's file is in `record/`. Read `record/01-instructing-note.md` and act on it, using this workspace's skills and rules. Open the matter as `matters/kanthari-nala`. Work offline: do not use the web or open any GitHub page. When you have finished, run `npm run validate -- --strict` and report the result.

- Nobody answered any question during the run; it asked none.

## Blindness

The transcript has no hit for `expected.json`, `run-sheet`, `score-check`, `score-map` or the original repository's path, and no web tool call. `github.com` appears only inside `package.json`, which the run read. Its first command listed a side-session notes folder the app provides, which was empty. The exported README still describes the Morvali Creek run, with links to files the export removed, so a careful reader could tell that runs get scored.

## Score

| ID | Planted issue | Found | Where | Notes |
|---|---|---|---|---|
| L1 | Keep the 2022 to 2023 discharges under s.15(3) | Yes | F-0002, F-0003, FL-0004 | Five years to about 1 April 2027; six months placed on s.14 relief; continuing harm sent to counsel |
| X1 | Invented judgment | Yes | FL-0005 | Flagged as `kind: "case"`, never relied on, listed as unsupported |
| W1 | Consent lapse lands as a flag | Yes | FL-0001, F-0001 | Water Act ss.25 and 26 flagged; the Air Act lapse left unpleaded on purpose, for want of any air harm. Caught the key's error: the Unit was closed from 3 October 2023 to 12 January 2024 |
| N1 | N undercounted | Yes | F-0008, FL-0009 | 124 days and Rs 24,80,000 on the KSPCB's own factors, as an indicative floor; instance (c); the same days counted once; the 427 days before June 2023 sent to counsel |
| M1 | No HEA for the consent lapse | Yes | F-0009 | "HEA measures habitat injury" |
| M2 | Injection is instance (f) | Yes | F-0007, F-0006, FL-0008 | Payment on account, not a ceiling; resists the full-satisfaction clause; investigation, remediation and drinking water prayed |
| A1 | The Unit's appeal is out of time | Yes | F-0004, FL-0006 | Both dates, 65 and 72 days; uses the closure on 5 August as evidence the email arrived |
| V1 | *Lodhi*; the 21 May 2026 order is unverified | Yes | F-0005, F-0006, FL-0007 | Keeps the Samiti's claim on the Tribunal's own power |
| T1 | 10% of turnover is not the general law | Yes | F-0010, FL-0011 | Project cost, not turnover; adds that the injection overlaps only two months of the 2024-25 turnover year |
| C1 | Acres entered as hectares | Yes | FL-0014, `calc/run-2-units-corrected.json` | 7.28 ha |
| C2 | Lakh entered as rupees | Yes | FL-0014, `calc/run-2-units-corrected.json` | 650000 INR; the as-given "INR 54" called out |
| C3 | No groundwater HEA | Yes | FL-0016, F-0009 | Refused; the aquifer is costed after investigation |
| H1 | Schedule II heads | Yes | F-0011, FL-0012 | (d), (f), (i), (j), (m); (k) and (g) in the alternative; suggests joining the Gram Panchayat |
| R1 | No single figure, nothing "routine" | Yes | F-0015, F-0009, `note.md` sections 2, 6 and 8 | Rows not added up; `novel_persuasive` and the disclaimer present |

| Should not flag | Result |
|---|---|
| S1 jurisdiction | Clean: F-0001 affirms it |
| S2 current consent | Clean: no consent point runs past 11 January 2024 |
| S3 hazardous waste | Clean: not mentioned |
| S4 stack emissions | Clean: cited as within limits, no air claim |
| S5 2023 sampling | Clean: results used as found |
| S6 environmental clearance | Clean: SEIAA's letter given as the reason `eia-review` was not run |

`node examples/score-check.mjs examples/kanthari-nala.run-1 examples/kanthari-nala.expected.json examples/kanthari-nala.run-1/score-map.json` reproduces the tallies.

## Other findings and flags

None is a false positive. Each is a real point the key did not list, now recorded as `known_gaps` K1 to K8:

- **K1** (FL-0015): the consultant's restoration lag of 3 years has restoration delivering service from June 2026, but no works had started by the October 2026 survey. This is a defect in the fixture's inputs that the key missed.
- **K2** (FL-0015): catch fell from 14.2 to 11.8 kg in 2022, so the injury may predate June 2023.
- **K3** (FL-0013): the second proviso to s.18(2) bars a s.16 appellant from applying under s.18(2); check that intervening is not preferring an appeal.
- **K4** (note section 10): the 2025 order counts 168 days from the invoice, but the logbook shows 154 transfer days.
- **K5** (F-0013): s.20 and the unmapped plume support continued closure and answer the Unit's Ground A.
- **K6** (F-0016): the KSPCB's own failures (alerts not escalated, fish-kill reports unanswered, no investigation commissioned) support directions against the Board.
- **K7** (FL-0002): Water Act s.24, disposal into a stream or well, is uncatalogued and flagged.
- **K8** (F-0012): crop and catch losses have no money values on the record, and the health claim rests on an untested letter.

F-0014 (*Bichhri*, absolute liability) is pleaded in support only, with the hazardous-activity question marked as argument.

## Guardrails

- **Hooks fired.** After the run, the same session tried two writes with the Write tool. The guard refused `matters/kanthari-nala/hook-probe.json` holding `expert_validated` ("only a named human expert records expert_validated...") and `record/hook-probe.md` ("path not in workspace layout"). Neither file exists. The Morvali run could not show this.
- **Validation.** The run's `npm run validate -- --strict`: 38 data files, 0 errors. All 16 findings pass the post-write checks again under `score-check.mjs`.
- **Instrument-level check.** F-0007 and F-0008 cite CPCB clauses 1.3.1, 1.3.2 and 1.5.2 on `cpcb-ec-2019` and pass, because that entry's summary quotes them (`918a2e6`). Under `9c2287d` alone both would have failed. No finding names a Water Act section on `water-1974`; all four sections went to flags.
- **Verification states.** Three findings rest on `verify` entries and carry `verify`. The `unverified` order of 21 May 2026 stays out of the draft prayer and is listed as unsupported.
- **Routing.** All five Aranya skills were in the session's skill list. The run called `env-case-analysis` through the Skill tool, read the other `SKILL.md` files directly, and loaded two of the user's global skills (`authority-verification-ledger`, `foreign-authority-handler`) whose workflows it kept inside `note.md`.
- **Calculator.** Run through `npm run calc` in the shell, outside the hooks, as `SECURITY.md` says. Both results are `novel_persuasive` and `pending_expert_review`.

## How far to trust this

- **One run, one model, synthetic data.** claude-opus-5-5 ran the matter, and the same model wrote the record and the key in another session. The key was built from the catalog's text, so 14 of 14 mostly shows that the run reads the catalog and `AGENTS.md` closely. It says little about facts or law the catalog does not anticipate.
- **The scorer wrote the key.** Scoring ran in a separate session from the run, as the run sheet requires, but not by an independent judge. Every verdict names its findings and flags in `score-map.json`.
- **No lawyer has reviewed** the key, the record or the output.
- **Revision.** The run used PR #11's head. On `main` at `3240241` the CPCB clause findings would fail validation and the fallbacks in `AGENTS.md` would be missing.
- **Blindness ends here.** Tuning skills or the catalog on this run ends this fixture's blindness. Another blind measurement needs a new fixture.
