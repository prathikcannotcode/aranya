# Catalog source pack, November 2026

`provisions.patch` adds 18 entries to `catalog/provisions.json` and corrects 6. Agents cannot write the catalog, so a maintainer applies the patch by hand after reading it. Every new entry traces to a source that was opened, and its `note` names the copy read and the check date. Four entries are `verify` and one is `unverified`, so the verification gate now has something to act on. No lawyer has reviewed any of it. The open legal points are in [QUESTIONS-FOR-COUNSEL.md](QUESTIONS-FOR-COUNSEL.md). Not legal advice.

## Apply

```bash
git apply catalog/patches/2026-11-source-pack/provisions.patch
```

```bash
npm run validate -- --strict
```

```bash
npm test
```

Tested on 2026-11-08 against `main` at `40ed27b`, on a clean copy. The patch applies, `validate --strict` passes on 16 files, and `npm test` shows 26 passed, 0 failed and 2 skipped (the existing Windows symlink skips). The 18 Morvali Creek findings on `eval/morvali-creek-run-1` still validate against the patched catalog. A finding that cites `goel-ganga-2018` as `source_cited` is now rejected with "must match the catalog entry (verify)".

## What the sources changed

- ***Vanashakti* has moved twice.** The May 2025 judgment was recalled on 18 November 2025 (2025 INSC 1326). The matter was then decided afresh on 29 July 2026 (2026 INSC 761). The prior EC regime is mandatory. The closed 2017 Notification is valid, the 2021 OM is quashed with prospective effect, and post facto EC now needs a notification under EPA s.3. The paper brief's "reported to restrict post-facto clearances" is out of date on both counts.
- **The catalog's Schedule II summary stopped at head (h).** Heads (i) to (n) were missing, including head (k), "Claims including cost of restoration on account of any harm or damage to environment". The patch quotes all fourteen heads and leaves the (g) or (k) choice to counsel.
- **Limitation:** s.15(3) gives five years from when the cause for compensation or relief first arose, and s.16 gives thirty days from communication of the order. Each has a sixty-day proviso.
- **The General Condition has used 5 km since 2014** (10 km for listed project types), and it does not apply to items 8(a) and 8(b).
- **The CPCB method has two tracks.** The formula covers consent and direction violations. Actual damage goes to an expert, site-specific assessment, and that track is where REA/HEA fits (see below).

## Entries and what each rests on

"Official" means the issuing body's own site: the NGT, MoEFCC's EC listing, or `api.sci.gov.in`.

| Entry | State | Rests on | Not confirmed |
|---|---|---|---|
| `ngt-s15-3` | source_cited | Gazette text of Act 19 of 2010 hosted by the NGT, p.6 (scan read as page images) | Consolidated text on India Code (HTTP 403) |
| `ngt-s16` | source_cited | Same Gazette, p.7; s.18(2) on p.8 | Consolidated text |
| `eia-2006-gc` | source_cited | S.O. 1599(E) of 25 June 2014, official Gazette copy, p.10 | S.O. 523(E) of 2025 and the 5 August 2025 order (known through `credai-gc-2025`); amendments after March 2025 |
| `eia-2006-para-8-vi` | source_cited | S.O. 1533(E), official scan, p.42 | None for the text |
| `eia-2006-appendix-iv` | source_cited | S.O. 3067(E) (paras 1.0 to 3.3) and S.O. 2163(E) (para 3.3(a)), official copies | Paras 4.0 to 7.1, read only in a Tamil Nadu PCB consolidation, so left out of the summary |
| `eia-2006-para-10` | source_cited | S.O. 1533(E) p.43, S.O. 3067(E) item IV, S.O. 5845(E), official copies | DEIAA wording and sub-para (iv) from S.O. 141(E) |
| `cpcb-ec-2019` | verify | The CPCB report as filed by CPCB with the NGT (E.A. 05 of 2021, filing pp.245 to 254); formula and clauses 1.5.1 to 1.5.4 also quoted in *Rhythm County* | CPCB's own copy (TLS certificate rejected); report date; the NGT acceptance order of 28 August 2019; the CPCB framework of December 2022 |
| `ngt-oa593-2019` | verify | NGT order of 19 February 2019, copy hosted by the Assam Pollution Control Board | The NGT's own copy |
| `vanashakti-2025` | source_cited | 2025 INSC 718, official PDF (operative paras 35 to 37) | None needed: entry exists to mark it recalled |
| `credai-vanashakti-2025` | source_cited | 2025 INSC 1326, official PDF: operative part, Chandran J., Bhuyan J. paras 55 to 58 | Lead opinion read in part |
| `vanashakti-2026` | source_cited | 2026 INSC 761, official PDF, compared with an SCObserver copy | MoEFCC direction of October 2026 |
| `credai-gc-2025` | source_cited | 2025 INSC 1112, official PDF, paras 22 to 25 | The 5 August 2025 order in W.P.(C) 166 of 2025 |
| `rhythm-county-2026` | source_cited | 2026 INSC 102, official PDF, read in full | Cases it quotes (*Deepak Nitrite*, *Research Foundation*, *Benzo Chem*) |
| `cl-gupta-2025` | source_cited | 2025 INSC 1035, official PDF, read in full | None |
| `dpcc-lodhi-2025` | source_cited | 2025 INSC 923, official PDF, paras 35 to 39 | Para 30 read as quoted elsewhere |
| `dpcc-lodhi-2026-order` | unverified | Quoted in an NGT order of 27 August 2026 on Indian Kanoon | The order itself; a press report says the opposite |
| `amravati-2026` | verify | 2026 INSC 796, Verdictum-hosted copy | The sci.gov.in copy; orders after 29 September 2026 |
| `goel-ganga-2018` | verify | Para 64 as quoted in *Rhythm County* para 28 | The judgment itself |

Changed existing entries: `ngt-schedule-2` (full heads; neutral note), `ngt-s15` (points to s.15(3)), `eia-2006-process` (*Vanashakti* note replaced), `eia-notif-2006` (later amendments seen in the consolidation), `hea` and `rea` (positioning; head choice left to counsel), plus one clause in the catalog `disclaimer`. No existing `source_url` or `verification` changes, so current findings keep validating. `law_as_at` stays 2026-11-03, because the old entries were not re-checked.

## Positioning REA/HEA against the CPCB method and the compensation cases

This is a proposal for the maintainer and counsel, not a settled position.

The CPCB formula, EC = PI x N x R x S x LF, is a tariff. It prices a consent or direction breach by sector, days, scale and location, and it applies only where CPCB has issued directions (clause 1.5.1). It never measures injury. For accidental or intentional discharges that cause damage, and for injection into groundwater, the same report sends compensation to detailed investigation by expert institutions. That amount covers "remediation costs, measures requiring immediate and short-term actions, compensation towards loss of ecology", spent at the site (clauses 1.3.2, 1.4.2, 1.5.2). The Supreme Court reads that as "a detailed, site-specific and expert-driven assessment with emphasis on remediation and restitution" (*Rhythm County*, para 46.4). In 2019 the NGT had already asked CPCB to cover "loss to ecological services" (O.A. 593/2017, para 9). REA/HEA belongs in that track as a disclosed way of sizing the restoration. It is not a rival formula for consent violations.

*Amravati* (para 17) asks courts and tribunals to record "the valuation standard used" and "the formula or guidelines applied", and to count intangible damage and the cost of restoration. A REA/HEA run with its sensitivity range does all three in the open. Whether those principles bind the NGT is Q7.

REA/HEA measures restoration and nothing else. The courts also price deterrence and the scale of the enterprise, through project cost or turnover with a rational nexus (*Rhythm County*, *Goel Ganga*, *C.L. Gupta*). An argument should present the REA/HEA figure as the restoration component and leave any deterrent component to its own reasoning. Whether the two add up is Q7. *Vanashakti* 2026 (para 57) says "some environmental injuries cannot be compensated in money", so a REA/HEA figure must never be argued as a price that makes the harm acceptable.

## Other files that still state the old position

Not edited here, because they sit outside this task. A maintainer should revisit them once counsel answers Q1:

- `docs/handoff-rea-hea-note.md`: lines 22, 43 and 45 (head (g) as the head) and line 54 (*Vanashakti* "reported to restrict post-facto").
- `docs/METHODOLOGY.md`: line 55 (head (g)).
- `README.md`: lines 43, 100, 117 and 161 (head (g)).
- `matters/sample-estuary/findings/F-0001.json`: lines 3 and 5 (head (g)).
- `.claude/skills/ngt-compensation-argument/SKILL.md`: line 24 cites Schedule II without a head. It is safe as written, but the skill should say which head once Q1 is answered.

## Sources that could not be reached

- India Code, `indiacode.nic.in/handle/123456789/2025`: HTTP 403 and an edge-server error on 2026-11-05.
- CPCB, `cpcb.nic.in/uploads/report-15.07.2019.pdf`: TLS certificate rejected. TLS checks were not bypassed.
- MoEFCC EC listing: ends at S.O. 3372(E) of 26 July 2023. Amendments reported for 2025 and 2026 (Appendix VI replaced in July 2026; drafts of March and May 2026) were not checked.
