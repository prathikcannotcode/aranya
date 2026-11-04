# Methodology: Resource and Habitat Equivalency Analysis (REA/HEA)

The calculator sizes compensatory restoration by setting the discounted ecological-service loss of an injury (the **debit**) against the discounted service gain a restoration project delivers (the **credit**), then solving for the restoration scale. This follows NOAA's equivalency-analysis practice in US natural resource damage assessment under CERCLA and the Oil Pollution Act. **HEA** scales against habitat service; **REA** against a specific resource service (for example fisheries yield or recreational use). They are kept distinct because the choice of method is itself part of the expert argument.

## The equations

Let `r` = discount rate, areas in hectares, service levels a fraction of baseline (0..1).

**Debit** (discounted service-hectare-years lost):

```
debit = injured_area x [ sum_{t=0}^{injury_years-1}  (baseline - injured) / (1+r)^t
                       + sum_{k=0}^{recovery_years-1} (baseline - injured)(1 - (k+1)/recovery_years) / (1+r)^(injury_years+k) ]
```

The site sits at the injured service level through the injury years, then recovers linearly to baseline over the recovery years.

**Credit** (discounted service-hectare-years delivered by one hectare of restoration):

```
credit_per_ha = sum_{k=0}^{restoration_years-1} restoration_gain / (1+r)^(restoration_lag + k)
```

**Restoration scale:**

```
area_needed   = debit / credit_per_ha
scaling_ratio = area_needed / injured_area
estimated_cost = area_needed x restoration_unit_cost   (unit cost is an expert input; optional)
```

If the credit is zero or negative the calculator throws rather than report an infinite area.

## Worked example (the self-check, r = 0)

Injured 10 ha, baseline 1.0, injured 0.5, injury 2 yr, recovery 2 yr; restoration gain 0.5, 5 yr, no lag.

- debit = 12.5, credit_per_ha = 2.5, area_needed = 5 ha, scaling_ratio = 0.5.

This is asserted exactly in `.claude/scripts/tests/hea-rea.test.mjs`.

## Assumptions and their limits

- Linear recovery and a constant restoration gain are simplifications; real trajectories vary. The tool always reports a **sensitivity range** over the service-loss fraction and the discount rate, and must never be reduced to a single figure.
- The **service-loss fraction** (`baseline - injured`) is the most contested input and a matter of expert judgement, not a lookup.
- The **discount rate** is a policy and economic choice; state it and test alternatives.
- The calculator sizes restoration to offset injury; it is not a route to a damages windfall.

## Legal status in India

REA/HEA has **no documented NGT or Indian precedent**. It is offered as persuasive comparative methodology to quantify the restoration the NGT may already order under NGT Act s.15(1)(c) (restitution of the environment), s.17, and Schedule II head (g) (restoration of the quality of the environment), applying the polluter pays principle (s.20). Every result is `methodology_status: novel_persuasive` and `validation_status: pending_expert_review` until a named ecological expert validates the inputs. The output is expert-witness input material, never a final compensation figure, and never legal advice.

## Provenance

US NRDA under CERCLA and the Oil Pollution Act; NOAA habitat and resource equivalency guidance. See the `hea` and `rea` entries in `catalog/provisions.json` for sources.
