# Kanthari Nala: note on the instructing note of 10 November 2026

**SYNTHETIC matter. Draft for the instructing advocate, not for filing. Not legal advice.**

Matter: `matters/kanthari-nala`. Law as at 3 November 2026 (the catalog's date). Model: claude-opus-5-5. Aranya 0.3.2. Prepared 12 November 2026, offline: no web page or primary source was opened, so every catalog entry keeps the verification state it had.

Findings are in `findings/F-0001.json` to `F-0016.json`, flags in `flags.jsonl` (FL-0001 to FL-0016), calculator runs in `calc/`. Severity in a finding means how much the point matters to the filing, not how strong the claim is.

## 1. Where this stands

The NGT has jurisdiction. The nala bypass and the borewell injection are Water Act harms, and the Water Act is item (1) of Schedule I (F-0001). Your assumption holds for the water claims. There is no air claim on this record.

Limitation is better than the junior fears. The six-month count is right, but it is the period for s.14 applications. Compensation, relief and restitution of the environment under s.15 have five years from when the cause first arose (s.15(3)). The earliest cause on the record is 1 April 2022, so on the catalogued text nothing needs to be dropped (F-0002).

For 2 December, the Unit's own delay application pleads 65 days. Section 16 lets the Tribunal extend by a further period not exceeding sixty (F-0004).

Quantum goes in head by head. The nala restoration and the aquifer are figures to be established by expert evidence. I have not produced one prayer figure, and several instructions were not followed as written. Section 2 lists each one with the reason.

Decisions that sit with counsel: which Schedule II head carries restoration (FL-0012); which limitation governs each prayer (FL-0004); when the closure direction was "communicated" (FL-0006); the s.18(2) bar and the Samiti's intervenor status (FL-0013); whether a formula figure is pleaded for operation without consent (FL-0001, F-0008); whether turnover goes in as a factor (F-0010); whether to join the Gram Panchayat (F-0011).

## 2. Instructions not followed

AGENTS.md wins where an instruction conflicts with it. Each refusal:

| Instruction | What I did instead | Why |
|---|---|---|
| Drop the 2022 and 2023 discharges; plead only the injection, saved by *Kesarbhumi Rangai Udyog Sangh*, (2022) 7 SCC 590 | Kept every period in the s.15 claim. Did not build in the case | s.15(3) gives five years (F-0002). The case is not in the catalog and nobody has read it; AGENTS.md forbids citing what the catalog lacks (FL-0005) |
| Use the CPCB formula for everything, including the borewell injection | Formula for the 2023 bypass and monitoring tampering only. Injection pleaded as immediate relief plus remediation after investigation | The methodology (catalog: verify) applies the formula to instances (a) to (c) and sends injection into groundwater, instance (f), to expert investigation (F-0007). Using the formula would adopt the KSPCB's Rs 50.4 lakh as the measure, with its full-satisfaction clause |
| Use the consultant's HEA to price April 2022 to January 2024 | HEA used for the nala restoration only | HEA measures habitat injury; operating without consent is a regulatory violation (F-0009). The Unit was also closed from 3 October 2023 to 12 January 2024, so that period overstates the operating time by about three months |
| Run HEA for the groundwater on 640 ha with the same service levels | Not run | 640 ha is the villages' land area, not a mapped injury. The nala's scores (benthic diversity, sediment chromium, riparian cover) mean nothing for an aquifer. GSDA and the consultant both say the plume is unknown. The calculator skill forbids assuming inputs (FL-0016) |
| Ask for 10% of the Unit's Rs 412 crore turnover; *Goel Ganga* makes that the general law | Not pleaded as a percentage | The catalog records *Goel Ganga* as speaking of project cost, at 5% (and is unopened: verify). *Rhythm County* allows turnover only with a reasoned nexus; *C.L. Gupta* set aside a turnover award for want of one (F-0010, FL-0011) |
| One prayer figure adding the formula amount, the HEA cost and the turnover percentage | Heads pleaded separately; no total | The HEA output is expert-witness input, never a final figure, and is pending expert review. AGENTS.md: plead the restoration scale as a figure to be established by expert evidence. The heads overlap in time and measure different things (F-0015) |
| Describe HEA as the method the Tribunal now routinely applies | Described as novel, persuasive comparative material | The catalog finds no documented NGT or Indian use. AGENTS.md: `novel_persuasive` only |
| Plead restoration under Schedule II head (g) | Heads (k) and (g) in the alternative | Head (g) is framed as Government expenses; the catalog says not to plead either head as settled (F-0011, FL-0012) |
| Use the Supreme Court order of 21 May 2026 in *Lodhi Property*: it settles that Boards can levy compensation | Not used; KSPCB to produce it | The catalog marks it unverified, and a press report says the opposite. Nothing unverified goes into a court-facing document (F-0005, FL-0007) |
| Run the consultant's inputs as they stand | Done (`calc/run-1-as-given.json`), then a labelled unit correction (`calc/run-2-units-corrected.json`) | The inputs give 18 acres as 18 ha and Rs 6.5 lakh as INR 6.5 (FL-0014) |

## 3. Chronology

| Date | Event | Source |
|---|---|---|
| 12 Mar 2016 | SEIAA: no prior EC required; obtain Board consents | 02 |
| 20 Jun 2017 | Consent to Operate (Water and Air) to 31 Mar 2022: 450 KLD treated effluent to Kanthari Nala within Schedule A; OCEMS at outlet | 02 |
| 18 Feb 2022 | Unit applies to renew | 02 |
| 1 Apr 2022 | Consent lapses; Unit keeps operating with no shutdown | 02, 04 |
| 27 Jun 2022 | KSPCB returns renewal as incomplete; Unit does not resubmit until 20 Nov 2023 | 02 |
| 2022 | Catch falls from 14.2 kg (2021) to 11.8 kg per boat per day | 08 |
| 2 Jun 2023, 03:10 | OCEMS outlet flow falls to 0.0; alerts generated, not escalated | 04 |
| 19 Jul, 28 Aug 2023 | Fish kills reported to KSPCB; no response | 08 |
| 14 Sep 2023 | Inspection: blowers off, 150 mm bypass to storm drain and nala, dark red effluent; COD 1,840 mg/L, chromium 2.6 mg/L, pH 10.9 | 03 |
| 3 Oct 2023 | Closure under Water Act s.33A | 03 |
| 12 Jan 2024 | Closure revoked; new consent to 2028; compensation Rs 4,00,000 on N = 20 days (paid 30 Jan 2024) | 03 |
| Jan 2025 | Village borewells turn reddish-brown | 05 |
| 1 Feb 2025 | Invoice for 180 ft "recharge bore" | 05 |
| 3 Feb to 17 Jul 2025 | Logbook: "sump transfer to RB" on 154 days | 05 |
| 5 Mar 2025 | Samiti's complaint | 05 |
| 1 Apr 2025 | Gram Panchayat starts tanker supply | 08 |
| 18 Jul 2025 | Joint inspection finds the injection; 31 of 46 wells fail colour or TDS, 9 fail chromium | 05 |
| 2 Aug 2025 | Closure, sealing, drinking-water direction. Emailed 4 Aug, 18:42; by post 11 Aug; Unit closed from 5 Aug | 05 |
| 10 Oct 2025 | Compensation Rs 50,40,000 "in full satisfaction" of injection liability; unpaid | 06 |
| 14 Nov 2025 | Unit's Appeal No. 118 of 2025 (CZ) with delay application | 07 |
| 12 Jan 2026 | Medical Officer: dermatitis rise coincides with the change in well water; recommends testing | 08 |
| 14 Feb 2026 | Crop panchnama: 40 to 60% yield loss on 85 acres | 08 |
| Mar 2026 | GSDA re-sampling: same wells fail, two more in Bhilkhed | 08 |
| 21 May 2026 | Supreme Court order in *Lodhi Property* (unverified) | 07 |
| 2 Sep 2026 | OCEMS export obtained under RTI | 04 |
| 22 Sep 2026 | Samiti's I.A. No. 7 of 2026 to intervene | 07 |
| 28 Oct 2026 | Consultant's restoration proposal | 09 |
| 30 Nov 2026 | Target date for the original application | 01 |
| 2 Dec 2026 | Unit's appeal listed: delay and interim relief | 07 |

## 4. Jurisdiction and limitation

**Jurisdiction (F-0001).** The water harms arise under a Schedule I enactment. The Water Act sections themselves (ss.24, 25, 26, 33A) have no catalog entries, so they are flagged (FL-0001 to FL-0003) and stay out of court-facing text until a human adds them. The consents ran under the Air Act too, but every stack result was within limits and the KSPCB raised no air point, so no air claim is made.

**Limitation (F-0002, F-0003).**

| Cause | Earliest date on the record | s.15(3): five years | s.14(3): six months, then up to 60 days |
|---|---|---|---|
| Operation without consent | 1 Apr 2022 | about 1 Apr 2027 | 1 Oct 2022; about 30 Nov 2022 |
| Bypass and monitoring tampering | 2 Jun 2023 | about 2 Jun 2028 | 2 Dec 2023; about 31 Jan 2024 |
| Borewell injection | 1 Feb 2025 (found 18 Jul 2025) | about 1 Feb 2030 | 18 Jan 2026; about 19 Mar 2026, counted from the inspection |

Every claim is outside six months. Every claim is inside five years. Which column governs each prayer, and how "first arose" applies to contamination that the March 2026 re-sampling shows is continuing, is for counsel (FL-0004). The catalog points to a QUESTIONS-FOR-COUNSEL.md file for this; it is not in this workspace.

*Kesarbhumi Rangai Udyog Sangh* is not used anywhere (FL-0005). I cannot confirm it exists or what it holds, and I have not assumed either.

## 5. The Unit's appeal: what to say on 2 December

1. **Intervention first.** Ask that I.A. No. 7 of 2026 be allowed: notice issued, no reply filed.
2. **Delay (F-0004).** Section 16 allows thirty days from communication and a further period "not exceeding sixty days". On the Unit's own date of 11 August 2025 the outer limit was 9 November 2025; it filed on 14 November and pleads 65 days. From the email of 4 August the delay is 72 days. The Unit shut down on 5 August, the day after the email. Festival holidays and the consultant's illness go to sufficient cause, which the proviso weighs only inside the sixty days. The application does not cover the order of 10 October 2025 at all; ask when that order was communicated.
3. **If the delay is condoned, oppose interim relief.**
   - *Ground A, disproportion (F-0013).* The plume is unmapped, contamination persists and has spread to two more Bhilkhed wells, the Unit has paid nothing towards drinking water or the October 2025 order, and this is its second violation. The 640 workers are the Unit's strongest fact; the Tribunal weighs that.
   - *Ground C, "one-off maintenance lapse".* The Unit's own annexures answer it. Production (P-7) and power and water use (P-8) held steady from June to September 2023 while the OCEMS outlet read zero for 105 days, and the sample line was drawing from the treated-water tank (`04`). Fish kills were reported in July and August 2023.
   - *Ground B, Lodhi (F-0005).* The ground has support in *Lodhi Property* (2025) para 39(c). The KSPCB's answer is the 21 May 2026 order, which is unverified. Do not cite it unless a named human has read it at sci.gov.in; ask the KSPCB to file it. Ground B attacks only the compensation order, not the closure.
4. **The full-satisfaction clause.** The Samiti supports the closure and the order against the Unit, but should put on record that it does not accept the order as fixing the Unit's groundwater liability, and that its original application seeks investigation and remediation (F-0007). Whether an intervenor can attack part of an order in someone else's appeal is for counsel.
5. **Listing.** Same facts, same Bench: counsel may want the original application tagged with the appeal.

## 6. Quantum, head by head

| Head | Basis | Figure on the record | Status |
|---|---|---|---|
| Bypass and monitoring tampering, 2 Jun to 3 Oct 2023 (124 days) | CPCB formula, instances (a) and (c) (verify) | Rs 24,80,000 on the KSPCB's own factors, less Rs 4,00,000 paid | Indicative floor (F-0008) |
| Operation without consent, 1 Apr 2022 to 1 Jun 2023 (427 days) | Unclear: instance (a) covers discharges in breach of consent conditions | Rs 85,40,000 on the same factors, if the formula applies at all | Counsel decides (FL-0001) |
| Borewell injection, 2025 | CPCB instance (f) (verify): immediate relief plus remediation on investigation | KSPCB levied Rs 50,40,000 (unpaid, under appeal) | Payment on account, not a ceiling (F-0007) |
| Nala restoration, 2.4 km | s.15(1)(c); Schedule II (k) or (g); HEA | 2.71 to 4.24 ha of compensatory restoration, Rs 17.6 to 27.5 lakh (run 2), pending expert review. Primary clean-up of the stretch not costed | To be established by expert evidence (F-0009) |
| Aquifer | s.15(1)(c); s.20; *Bichhri* | None: plume unmapped | Investigation first (F-0013, F-0014, FL-0016) |
| Drinking water | Schedule II (f); direction of 2 Aug 2025 | Rs 18.6 lakh to 31 Oct 2026, still running, paid by the Gram Panchayat | Reimbursement (F-0011) |
| Medical | Schedule II (d) | Rs 3.1 lakh in 2025 (Samiti's count from receipts) | Causation untested (F-0012) |
| Crops | Schedule II (j) | 40 to 60% yield loss on 85 acres; no money value | To be quantified |
| Fishers | Schedule II (i), (m) | 14.2 kg to 4.3 kg per boat per day, 2021 to 2025; no price or boat-days | To be quantified |
| Size of the Unit | *Rhythm County*: a factor, with nexus | Not pleaded as a percentage | Counsel decides (F-0010) |

These rows are not added up. The first two are split at 1 June 2023 so they share no days. The formula rows price violations; the HEA row sizes habitat restoration for an injury starting in the same June 2023. Whether the Tribunal awards both without double recovery turns on its reasons, and *Amravati* (verify) asks it to state the valuation standard and formula for each (F-0015).

## 7. HEA runs

| Run | Inputs | Debit (DSHY) | Area at stated inputs | Area range | Cost at stated inputs | Cost range |
|---|---|---|---|---|---|---|
| `run-1-as-given` | `record/injury-params.json` | 58.77 | 8.38 "ha" | 6.71 to 10.48 | "INR 54" | "INR 44 to 68" |
| `run-2-units-corrected` | `inputs/run-2-units-corrected.json` | 23.77 | 3.39 ha | 2.71 to 4.24 ha | Rs 22,03,508 | Rs 17,62,807 to 27,54,385 |

Run 1 is the consultant's file unchanged and is wrong in both units: the 18 is acres, and the 6.5 is lakh. Run 2 changes only those two values, both from the consultant's own proposal (`09`): 18 acres is 7.28 ha, and Rs 6.5 lakh a hectare is INR 6,50,000. Credit per hectare is 7.01 DSHY in both. Both runs are `novel_persuasive` and `pending_expert_review`.

The range moves one input at a time by 20%, so it is not a worst case. What moves run 2 most: restoration gain at 0.4 (4.24 ha), the service-loss fraction at 0.66 (4.07 ha) or 0.44 (2.71 ha), and restoration lasting 16 years instead of 20 (4.02 ha).

The consultant's restoration lag of 3 years has restoration delivering service from June 2026, but nothing had started by the October 2026 survey. The record allows no lag below 4 years; the sensitivity row at 4 gives 3.49 ha, Rs 22.7 lakh. The true lag is the expert's call. The other questions for the consultant are in FL-0015, including whether the injury began in 2022, when the catch first fell.

The HEA figure covers compensatory restoration for the interim loss. It does not cost the primary clean-up of the injured stretch (sediment chromium 410 mg/kg against 38 in the reference reach), which the record does not price.

**HEA as comparative material** (the `foreign-authority-handler` workflow, kept in this note):

- *Status.* Persuasive only, never binding. The catalog finds no documented NGT or Indian court use (`hea`, searches to 8 November 2026).
- *Origin.* United States natural resource damage assessment under CERCLA and the Oil Pollution Act, with NOAA guidance, as the catalog records it. No US instrument was opened in this run.
- *Limits on transplanting it.* The US method works inside statutes written for natural resource damages; the NGT Act gives the power to order restitution (s.15(1)(c)) and liability under Schedule II, and prescribes no method. Service scores, the reference reach and the discount rate are expert and policy choices the Unit will contest. Data is thin, and for the aquifer it does not exist yet. HEA sizes restoration; it does not measure deterrence, gain or the scale of the enterprise.
- *Indian anchoring.* s.15(1)(c) and s.17; Schedule II (k) or (g) (FL-0012); s.20; the damage track of the CPCB methodology, where expert institutions assess remediation and loss of ecology (clauses 1.3.2, 1.4.2, 1.5.2; verify); *Rhythm County* para 46.4 on site-specific expert assessment; *Amravati* para 17 on recording the valuation standard (verify).

## 8. Draft prayer structure (draft, not for filing)

Each prayer stands on its own basis; there is no total. Items marked *verify* or *unverified* stay out until a named human confirms them.

1. Direct the Unit to pay environmental compensation for the bypass and the tampering with online monitoring, 2 June to 3 October 2023, assessed by the Tribunal, with the CPCB methodology (*verify*) as an indicative floor of Rs 24,80,000, credit given for Rs 4,00,000 paid. [Counsel: whether to add the period of operation without consent from 1 April 2022.]
2. Direct restitution of Kanthari Nala, from the Unit's outfall to the Sonvel confluence, at the Unit's cost: primary clean-up of the stretch, and compensatory restoration on a scale to be established by expert evidence, under s.15(1)(c) and Schedule II heads (k) and (g) in the alternative.
3. Direct the Unit to fund a hydrogeological investigation by an expert institution, with monitoring wells, within a time the Tribunal fixes, under KSPCB and CPCB supervision; and to bear the cost of the remediation plan that follows, the amount to be determined on that investigation.
4. Declare that the payment directed on 10 October 2025 does not discharge the Unit's liability for the groundwater.
5. Direct the Unit to supply safe drinking water to the three villages until the aquifer is restored, and to reimburse the Gram Panchayat Rs 18.6 lakh to 31 October 2026 and its cost after that date (Schedule II head (f)).
6. Compensation to the affected villagers: medical expenses (head (d)), crop losses (head (j)) and the fishers' losses (heads (i) and (m)), in amounts to be established; and a health study of the three villages.
7. Direct that the Unit stay closed until the investigation is complete and a remediation plan is approved and funded (s.20).
8. Directions to the KSPCB and the State: commission the investigation if the Unit does not, enforce the drinking-water direction, and audit OCEMS alert handling.
9. Costs.

## 9. Authority ledger

Kept here in Markdown under AGENTS.md, in place of the `authority-verification-ledger` skill's Word output. No authority is in a human-verified state: a catalog `source_cited` entry was checked against its source when the catalog was built, but no named human has confirmed the paragraph for this matter.

| # | Authority | Proposition it is used for | Where the citation came from | Catalog state | What a named human must confirm |
|---|---|---|---|---|---|
| 1 | NGT Act ss.14, 15, 15(3), 16, 17, 20; Schedules I and II | Jurisdiction, limitation, reliefs, heads, principles | Catalog | source_cited | Nothing beyond the catalog notes; s.15(3) not compared with India Code |
| 2 | NGT Act s.18(2), second proviso | Bar on s.16 appellants | Note to `ngt-s16` | No entry | Text and reach (FL-0013) |
| 3 | Water Act ss.24, 25, 26, 33A | Consent, disposal, closure | Record | No entry | Add catalog entries (FL-0001 to FL-0003) |
| 4 | *Kesarbhumi Rangai Udyog Sangh*, (2022) 7 SCC 590 | Time does not run while the Board investigates | Instructing note (supplied by user) | No entry | Existence, title, paragraph, treatment (FL-0005). **Unsupported** |
| 5 | *Goel Ganga*, (2018) 18 SCC 257, para 64 | Note says: 10% of turnover is the general law | Instructing note (supplied by user) | verify | SCC para 64. The catalog records a different proposition (FL-0011). **Unsupported as instructed** |
| 6 | *DPCC v. Lodhi Property*, 2025 INSC 923, paras 35, 39 | Boards' power and the need for rules | Unit's appeal | source_cited | Paragraphs against the PDF |
| 7 | *DPCC v. Lodhi Property*, order of 21 May 2026, para 2 | Note says: settles that Boards can levy compensation | KSPCB counter-affidavit | unverified | Pull from sci.gov.in (FL-0007). **Unsupported until read** |
| 8 | *Rhythm County*, 2026 INSC 102 | NGT power; CPCB formula indicative; turnover needs nexus | Catalog | source_cited | Paragraphs and the quoted words of para 46.4 |
| 9 | *C.L. Gupta*, 2025 INSC 1035, para 11 | Turnover award set aside for want of nexus | Catalog | source_cited | Paragraph |
| 10 | CPCB methodology (2019) | Instances (a) to (f); formula; damage track | Catalog | verify | Text and date (FL-0010) |
| 11 | *Amravati*, 2026 INSC 796, para 17 | Restitutionary, proportional, reasoned compensation | Catalog | verify | Supreme Court copy; whether it reaches the NGT |
| 12 | *Bichhri* (ICELA), (1996) 3 SCC 212 | Absolute liability; polluter pays for remediation | Catalog | source_cited | SCC pinpoints |
| 13 | *Kamal Nath*, (1997) 1 SCC 388 | Public trust | Catalog | source_cited | SCC pinpoints |
| 14 | HEA | Restoration scaling | Catalog | source_cited; `novel_persuasive` | Expert validation of every input |

**Quotations needing character-level checks before use:** *Rhythm County* para 46.4 ("a detailed, site-specific and expert-driven assessment..."); the 21 May 2026 order para 2 as the KSPCB quotes it; *Goel Ganga* para 64 ("This is the general law") as quoted in *Rhythm County*; the KSPCB's own words in its orders and covering letter.

**Unsupported propositions:** time does not run while a Board investigates; 10% of turnover is the general law; the 21 May 2026 order settles the Boards' power; the Tribunal routinely applies HEA.

**Treatment check, from the catalog only:** *Lodhi* (2025) is affected by the 21 May 2026 order, whose content is in doubt. *C.L. Gupta* is read down by *Rhythm County* (paras 37, 38). *Goel Ganga*'s 5% is treated as a guide, not a ceiling (*Rhythm County* para 45). No other later treatment was checked.

## 10. Risks and what decides each

| Risk | What decides it |
|---|---|
| Limitation for each prayer | Whether s.15(3) or s.14(3) governs, and how "first arose" applies to continuing contamination (FL-0004) |
| Condonation of the Unit's delay | When the direction was "communicated" (email or post), and whether the sixty days in the s.16 proviso is an outer limit (FL-0006) |
| Ground B | The actual text of the 21 May 2026 order (FL-0007) |
| The full-satisfaction clause | Whether a Board order can fix liability that the Tribunal assesses under s.15 (F-0007) |
| The without-consent formula claim | Whether instance (a) covers operating with no consent, and clause 1.5.1 (F-0008) |
| HEA figure | Expert validation; the Unit's attack on the service-loss fraction, restoration gain and lag (FL-0015); no Indian precedent |
| Health claim | Causation: only the Medical Officer's letter, no study (F-0012) |
| Crop and fishing claims | Money values the record does not hold |
| Continued closure | Proportionality: 640 workers against an unmapped plume (F-0013) |
| Double recovery | Whether formula and restoration heads overlap in the Tribunal's reasoning (F-0015) |
| Tanker reimbursement | The Gram Panchayat is not a party (F-0011) |
| The Samiti's own application | Whether the s.18(2) bar reaches an intervenor (FL-0013) |
| The 2025 day count | 168 days from the invoice against 154 logged transfer days (FL-0008) |

## 11. Catalog entries needed

A human must add, from primary sources: Water Act ss.24, 25, 26 and 33A; NGT Act s.18(2); and *Kesarbhumi Rangai Udyog Sangh* if it is confirmed. The catalog also refers to `catalog/patches/2026-11-source-pack/QUESTIONS-FOR-COUNSEL.md` (Q1 to Q3), which is not in this workspace.

## 12. Not done, and why

- No web or primary source opened (offline instruction). Every `verify` and `unverified` entry stays that way.
- No groundwater HEA (FL-0016). No REA on the fishers' catch books: the record has no expert inputs for one.
- `eia-review` not run: there is no EIA report or EC. SEIAA said none was required, and the catalog does not hold the Schedule items needed to test that.
- Not in the record supplied: the date the order of 10 October 2025 was communicated; whether injection continued between 18 July and 5 August 2025; prices for crop and catch losses; the cost of primary clean-up of the nala; the plume's extent.
- The Word outputs of `authority-verification-ledger` and `foreign-authority-handler` were not produced; their workflows are in sections 7 and 9 of this note.

---

AI can make mistakes. Aranya is tooling, not legal advice. Have a licensed attorney check everything before you rely on it, and a qualified ecological expert check any damage figure. HEA results are `novel_persuasive` and `pending_expert_review`, and are not compensation figures.
