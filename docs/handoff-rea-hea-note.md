# Handoff brief: a short note on REA/HEA in environmental adjudication in India

Give this file to Claude (with the repository attached) and ask it to write the note. This is a brief, not the note itself.

## The task

Write a short scholarly note, roughly 1,800 to 2,500 words, titled something like *Resource and Habitat Equivalency Analysis in Indian Environmental Adjudication*. Audience: the NGT bar, environmental-law practitioners and academics in India. It is academic commentary, not legal advice, and it argues a single thesis. Keep it tight and specific.

- Citation style: Indian Law Institute (ILI) footnotes by default; Bluebook if the venue needs it.
- Every legal proposition carries a footnote to a primary source. Use `catalog/provisions.json` in this repo as the source of truth, and re-check each citation against its `source_url` before it goes in a footnote.
- Do not assert anything the catalog marks `verify` or `unverified` without confirming it first. Flag anything you cannot confirm rather than smoothing over it.
- Carry the disclaimer: academic commentary, not legal advice; REA/HEA has no NGT or Indian precedent.

## The thesis

Indian environmental adjudication already holds the statutory power to order restoration-scaled compensation. What it lacks is a transparent, auditable method to size it, so quantum reasoning is often opaque. Resource and Habitat Equivalency Analysis (REA/HEA), the restoration-scaling method used in US natural resource damage assessment, can supply that method as persuasive, not binding, analysis that sits inside the NGT's existing powers. The move is modest and principled, not a doctrinal leap, and the note should be candid about what a tribunal would need before relying on it.

## The statutory hook (verified against the NGT Act)

- **s.15(1)(c)** NGT Act 2010: the Tribunal may order "restitution of the environment for such area or areas, as the Tribunal may think fit." This is the restoration hook.
- **s.17**: liability to pay relief or compensation under the Schedule II heads for harm from a Schedule I enactment; the Tribunal may apportion.
- **Schedule II heads (g) and (k)**: (g) covers Government expenses "including compensation for environmental degradation and restoration of the quality of environment"; (k) covers "claims including cost of restoration on account of any harm or damage to environment". The note should say which head, or both, a restoration-scaled figure belongs under, and why.
- **s.20**: the Tribunal shall apply sustainable development, the precautionary principle and the polluter pays principle.
- **s.14**: jurisdiction over a substantial environmental question arising from a Schedule I enactment; six-month limitation (plus up to 60 days). Note the Wild Life (Protection) Act 1972 is not in Schedule I.
- **s.15(3)**: an application for compensation or restitution has five years from when the cause first arose (plus up to 60 days).

Source: India Code handle 123456789/2025. Schedule I is the seven Acts, including the Public Liability Insurance Act 1991.

## The doctrinal base (verified)

- Polluter pays and precautionary principle as part of Indian law: *Vellore Citizens' Welfare Forum v. Union of India* (1996) 5 SCC 647.
- Absolute liability and the cost of remediation falling on the polluter: *Indian Council for Enviro-Legal Action v. Union of India* (Bichhri) (1996) 3 SCC 212.
- Public trust doctrine: *M.C. Mehta v. Kamal Nath* (1997) 1 SCC 388.

## The method (keep HEA and REA distinct)

- **HEA** scales restoration against lost habitat services; **REA** against a specific resource service (fisheries yield, recreational use). The choice of method is itself part of the expert argument.
- The core is a discounted service-years calculation: a **debit** (discounted service-hectare-years of ecological service lost to the injury) set against a **credit** (discounted service-hectare-years a restoration project delivers), solved for the restoration scale, then costed at an expert unit cost.
- Origin: US NRDA under CERCLA and the Oil Pollution Act; NOAA guidance. The companion tool in this repo implements the calculation deterministically and always returns a sensitivity range, never a single authoritative figure.

## Suggested structure

1. The gap: the CPCB formula prices consent and direction breaches, while actual damage goes to an expert, site-specific assessment with no standard method (catalog `cpcb-ec-2019`, `rhythm-county-2026`). Give one or two verifiable examples; do not invent orders.
2. The power already exists: s.15(1)(c), s.17, Schedule II heads (g) and (k), s.20, and polluter pays.
3. What REA/HEA is, in plain terms, and why a transparent, auditable method suits an adversarial forum.
4. The mapping onto Indian law: restoration-scaling as restitution of the environment; discounting and service metrics as the quantum method; where the tool's debit/credit sits under Schedule II.
5. The honest limits: no Indian precedent; US-origin assumptions need translation; the service-loss fraction is contested expert judgment; data scarcity; the method sizes restoration, not a windfall.
6. A modest proposal: use it as persuasive expert evidence, with the sensitivity range and an ecologist's validation, not as a black-box number.

## Hard caveats the note must carry

- No documented NGT or Indian court has applied REA/HEA. Present it as persuasive comparative methodology, never as settled law.
- Foreign origin: frame through the persuasive-authority rules, and name the statutory and ecological differences that limit transplantation.
- The figures depend on expert inputs; always a range, expert-validated. The tool's output is expert-witness input material, not the compensation figure.
- Currency: cite *Vanashakti* 2026 INSC 761 (29 July 2026), not the 2025 judgment, which was recalled on review (2025 INSC 1326). Also reflect the Forest (Conservation) 2023 rename, and give every case pinpoint from the SCC report.

## Do and don't

- Do: one clear thesis, short, specific, every cite to a primary source, honest about novelty.
- Don't: overclaim precedent, invent NGT orders, reproduce long quotations, present the tool's number as definitive, or drift into legal advice.

## Evidence base

The verified catalog (`catalog/provisions.json`) and the calculator (`.claude/scripts/hea-rea.mjs`) in this repo. The catalog records a `source_url` and a `verification` state for every entry; honour them.
