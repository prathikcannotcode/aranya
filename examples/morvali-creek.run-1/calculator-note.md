# Morvali Creek: HEA calculator note

`methodology_status: novel_persuasive` | `validation_status: pending_expert_review`

For the instructing advocate, 5 November 2026. Synthetic matter. Expert-witness input material, not a final compensation figure. HEA has no documented NGT or Indian precedent. No ecologist has reviewed any input in any run below.

## The range

| Run | Inputs | Area range (ha) | Cost range (INR) | At the stated inputs |
|---|---|---|---|---|
| `calc/run-1.json` | Consultant's, as they stand | 20.54 to 32.09 | 1,64,32,622 to 2,56,75,972 | 25.68 ha, INR 2,05,40,778 |
| `calc/run-2.json` | Baseline 0.58; lag 6; 22 years | 13.56 to 21.18 | 1,08,45,578 to 1,69,46,217 | 16.95 ha, INR 1,35,56,973 |
| `calc/run-3.json` | Baseline 0.58; lag 12; 16 years | 20.54 to 32.09 | 1,64,30,570 to 2,56,72,766 | 25.67 ha, INR 2,05,38,213 |

Working band, run-2 low to run-3 high: **13.56 to 32.09 ha, INR 1,08,45,578 to INR 2,56,72,766.** I would not file run-1. I ran it because you asked for it, and I added runs 2 and 3 because the consultant's inputs contradict the consultant's own documents.

Runs 2 and 3 are mine, derived from the record. They show what the file implies and do not replace an expert's inputs.

Run-1 and run-3 give nearly the same answer by accident. The corrected baseline halves the debit (322.36 to 163.08 discounted service-hectare-years). Waiting for full gain halves the credit per hectare (12.55 to 6.35). A witness defending 25.68 ha on run-1's reasons loses both points in cross-examination, even though the number survives.

## Method

HEA, as the consultant chose, because the claim is for habitat across the reach. REA would scale against one service such as fisheries yield. I did not run REA: there is no catch data. **Lost catch is not in any of these numbers** and must be claimed separately, or the Company will call it double counting.

## Which inputs move the result most

Each row moves one input by 20%, or by at least a year. Figures are the change in hectares against the stated-input area: input moved down, then input moved up. Lag cannot go below 0, so run-1 has only the upward move.

| Input | Run-1 | Run-2 | Run-3 |
|---|---|---|---|
| Restoration gain | +6.42 / -4.28 | +4.24 / -2.82 | +6.42 / -4.28 |
| Loss fraction | -5.14 / +4.53 | -3.39 / +3.39 | -5.13 / +5.13 |
| Restoration years | +4.38 / -2.87 | +2.69 / -1.84 | +4.65 / -3.16 |
| Injury years | -2.16 / +2.10 | -1.42 / +1.38 | -2.16 / +2.10 |
| Recovery years | -2.04 / +1.96 | -1.35 / +1.30 | -2.04 / +1.96 |
| Discount rate | -0.84 / +0.83 | -1.01 / +1.05 | -2.02 / +2.17 |
| Restoration lag | +0.77 | -0.49 / +0.51 | -1.47 / +1.56 |

The range is not a worst case, because inputs moving together fall outside it. Run-1's range also misses the live disputes. Its lowest loss fraction is 0.68, against the 0.43 the survey supports, and its lag row only tests 0 to 1, against the 6 to 12 the proposal implies.

## Inputs against the record

Flagged as FL-0019 (baseline) and FL-0020 (the rest).

| Input | Run-1 value and source | What the record says | Runs 2 and 3 |
|---|---|---|---|
| `baseline_service` | 1.0, reference reach | College scored the creek 0.58 in November 2023 and blames sewage and sand mining. **Contradicted** (F-0016). | 0.58 |
| `restoration_lag` | 0 | Works no earlier than mid-2027; first gain in the fourth year after that; 0.7 by year 10. **Contradicted** (F-0017). | 6; 12 |
| `restoration_years` | 25, design life | With lag 0 this credits gain from 2024, before works begin. | 22; 16 |
| `injury_years` | 5, assumes discharge stops by late 2029 | Conflicts with the closure prayer, and runs past the Consent to Operate expiry of 31 March 2029. A year less takes 1.42 to 2.16 ha off. | 5, unchanged |
| `recovery_years` | 12, "our judgement" | No source | 12, unchanged |
| `injured_service` | 0.15, August 2026 survey | One reading, a month after the fish kill, applied flat from September 2024. No reading between November 2023 and August 2026. | 0.15, unchanged |
| `injured_area` | 42 ha, GPS polygon | Supported. Check that the November 2023 survey covered the same reach. | 42, unchanged |
| `restoration_gain` | 0.7, proposal | No starting score for Site R. If 0.7 is a level and not a gain, the net gain is smaller. It also exceeds the 0.58 this creek scored with the same sewage and sand mining. | 0.7, unchanged |
| `discount_rate` | 3%, "the usual US damage-assessment rate" | No Indian basis on file. The methodology says to state it and test alternatives. | 3%, unchanged |
| `restoration_unit_cost` | INR 8,00,000 per ha, "estimated" | No build-up. Not clear whether land and monitoring are included. | Unchanged |

**How I got lag and years.** Time zero is the first recorded discharge, last week of September 2024. Works in mid-2027 fall at about year 2.75. First measurable gain, the start of the fourth year of works, falls at about 5.75, so 6. Full gain, the start of year 10, falls at about 11.75, so 12. I assumed design life runs from the start of works, so it ends at about 27.75, which gives 22 and 16 years of credit. The proposal does not say when design life starts.

The calculator holds gain constant from the lag onward and cannot model a ramp. Run-2 credits the full 0.7 from the first year of any gain, which is too generous. Run-3 credits nothing until full gain, which is too harsh. The true figure for this proposal lies between them, other inputs held.

## Questions for the ecologist of record

The proposal is a draft and says it has not been reviewed by one. Every input needs a named expert before filing. Only that person can record `expert_validated`.

1. Is 0.58 the right baseline, and did the November 2023 survey reach match the 42 ha polygon?
2. Is the Kalmi reference reach at Kalmi ghat, where dead fish were found in October 2024 and July 2026? If so, is the reference sound?
3. What was service on the reach between September 2024 and August 2026?
4. How long does recovery take, and on what evidence?
5. What does Site R score now, and what net gain can it reach with the sewage outfall still running upstream?
6. Site R is downstream of the affected reach. Can works start in mid-2027 if discharge continues to late 2029?
7. What discount rate suits an Indian claim, and why?
8. What does the unit cost cover?

If no ecologist can sign by 20 November, file without the worksheet, plead the scale as to be established by expert evidence, and seek leave to file the report. `argument-note.md` has wording for that.

## Reproducing the runs

The calculator accepted all three input sets with no rejection.

```
npm run calc -- <record>/injury-params.json --out matters/morvali-creek/calc/run-1.json
npm run calc -- matters/morvali-creek/inputs/run-2-params.json --out matters/morvali-creek/calc/run-2.json
npm run calc -- matters/morvali-creek/inputs/run-3-params.json --out matters/morvali-creek/calc/run-3.json
```

Catalog entry `hea`: `source_cited`, `novel_persuasive`. Source not opened in this run.

Aranya provides tooling and informational structure. It is not legal advice. For binding decisions, instruct qualified environmental counsel and, for damage quantum, a qualified ecological expert.
