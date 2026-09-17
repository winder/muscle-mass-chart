# Research Pass — Muscle Mass vs. Age Model Constants (Milestone 5 / tu9.1)

This document supports tu9.2 ("replace placeholder constants with literature-grounded
values"). It is organized so each section maps directly onto one constant/table in
`src/data/muscleModel.js` or `src/data/computeCurve.js`. Every numeric recommendation
carries an inline citation; the full reference list is at the end.

**Scope reminder (per PRD §7/§9):** this tool is an educational approximation, not a
clinical instrument. The goal below is defensible, well-cited *approximations* that
capture the right shape and right order of magnitude — not clinical-grade precision.
Where the literature doesn't cleanly support a number, that is stated explicitly rather
than papered over.

---

## 0. Sex-in-model gap (read this first)

`Scenario.sex` (`src/data/scenario.js`) is **not currently wired into the computation
path**. `computeCurve.js` calls `baselineValueAt()` against a single, sex-unaware
`nonExerciserCurve`, and `ACTIVITY_TARGET_BONUS`/`ACTIVITY_TARGET_RETENTION` are single
flat tables with no sex dimension. So today, toggling a Scenario's sex in the UI has
*zero* effect on its computed curve.

This research pass assumes tu9.2 will fix that, because PRD §5.6 explicitly requires
sex to be "fully modeled in V1," and the literature review below confirms the premise:
sex-specific data is genuinely available and the sexes differ enough (in peak timing,
decline rate, and — to a smaller extent — training response) that a single shared curve
is a real gap, not just a nice-to-have. Concretely, tu9.2 will need to:

- Split `nonExerciserCurve` into male/female point tables (§1 below gives both).
- Make `disabilityThreshold` sex-aware, or at minimum document why a single compromise
  value is acceptable for this tool's precision level (§4 discusses both cutoffs).
- Decide whether `ACTIVITY_TARGET_BONUS`/`ACTIVITY_TARGET_RETENTION` need a sex
  dimension too. My recommendation, based on §2/§3: **no split needed for the
  activity-response tables** — the best sex-difference evidence found (a 2025
  Bayesian meta-analysis, Refalo et al.) shows *relative* hypertrophy response is
  essentially sex-independent; the sex effect lives almost entirely in the baseline
  curve (§1), not the training-response multipliers. This should be called out
  explicitly in the tu9.2 implementation so it's a deliberate decision, not an
  oversight.

---

## 1. `nonExerciserCurve` — age-related decline by sex

### Shape and evidence summary

The literature consistently supports the PRD's assumed shape: a rise through
adolescence, a peak in the mid-20s to ~30, a slow decline through midlife, and an
**accelerating** decline from roughly age 60 onward.

- Cross-sectional whole-body MRI data (468 men and women aged 18–88) found relative
  skeletal muscle mass begins declining as early as the third decade, but a
  *noticeable* absolute decline doesn't appear until the end of the fifth decade (~50),
  concentrated in the lower body (Janssen et al., 2000).
- A quantitative review of cross-sectional and longitudinal studies gives a median
  cross-sectional decline of **4.7% of peak mass per decade in men** and **3.7% per
  decade in women**, and — critically for the "accelerating" shape — longitudinal data
  at age 75 shows muscle mass being lost at **0.80–0.98%/year in men** and
  **0.64–0.70%/year in women** at that age specifically, i.e., decade-equivalent rates
  of ~8–10%/decade by the mid-70s, well above the all-ages median (Mitchell et al.,
  2012).
- The Health, Aging and Body Composition (Health ABC) longitudinal cohort is the
  primary source underlying that "post-60 acceleration" claim in the broader sarcopenia
  literature (Goodpaster et al., 2006).
- A large (n=18,625) Brazilian normative-values study reports **women's appendicular
  skeletal muscle (ASM) peaks earlier** (third decade) than men's, and found accelerated
  post-peak decline of **~5.7%/decade from the sixth decade** in women specifically —
  supporting both an earlier female peak age and a steeper late-life drop (Silva et al.,
  Front Public Health, 2023).

**Peak age placement:** the ASM-specific (not whole-body lean mass) literature
consistently shows women's peak preceding men's by roughly 5 years (women: third decade,
~mid-20s; men: ~30), consistent with earlier female puberty/skeletal maturation. This
tool proposes male peak = age 30, female peak = age 25.

**What's well-supported vs. extrapolated:** the post-peak decline shape (ages 25/30–90)
is grounded in the decade-rate citations above. The **growth phase (age 10 to peak)**
is weakly sourced by comparison — I did not find a study reporting "% of adult peak
muscle mass" specifically for ages 10–25 on the same index used post-peak. The values
below for ages 10–20 are extrapolated from general knowledge of pubertal muscle
accretion timing (earlier onset in girls, ~10–14, vs. boys, ~12–16) rather than a single
cited curve, and should be treated as the least rigorously grounded numbers in this
whole document. tu9.2 should keep the `source` field on the growth-phase segment honest
about that (e.g., "extrapolated; no directly-cited source for ages 10–20").

### Proposed `nonExerciserCurve` — male (peak = 100 at age 30)

| age | value | basis |
|---|---|---|
| 10 | 45 | extrapolated (pre-pubertal) |
| 15 | 68 | extrapolated (mid-puberty accretion) |
| 20 | 88 | extrapolated (post-pubertal, still rising) |
| 25 | 96 | extrapolated, approaching peak |
| 30 | 100 | peak (reference = 100) |
| 35 | 99 | −3%/decade, ages 30–40 (Mitchell et al., 2012, lower end) |
| 40 | 97 | ” |
| 45 | 95 | −5%/decade, ages 40–50 |
| 50 | 92 | ” |
| 55 | 89 | −6%/decade, ages 50–60 |
| 60 | 86 | ” |
| 65 | 82 | −8%/decade, ages 60–70 (Goodpaster et al., 2006 acceleration) |
| 70 | 78 | ” |
| 75 | 73 | −10%/decade, ages 70–80 |
| 80 | 68 | ” |
| 85 | 62 | −12%/decade, ages 80–90 |
| 90 | 56 | ” |

### Proposed `nonExerciserCurve` — female (peak = 100 at age 25)

| age | value | basis |
|---|---|---|
| 10 | 50 | extrapolated (pre-pubertal; girls start puberty earlier, so closer to peak by 10) |
| 15 | 75 | extrapolated (puberty typically ~2 yr earlier onset than boys) |
| 20 | 92 | extrapolated, approaching peak |
| 25 | 100 | peak (reference = 100 **for this sex's own curve**; see note below) |
| 30 | 99 | −2.5%/decade, ages 25–40 (Mitchell et al., 2012, lower end for women) |
| 35 | 98 | ” |
| 40 | 96 | ” |
| 45 | 94 | −4%/decade, ages 40–50 |
| 50 | 92 | ” |
| 55 | 90 | −5%/decade, ages 50–60 |
| 60 | 87 | ” |
| 65 | 84 | −7%/decade, ages 60–70 |
| 70 | 80 | ” |
| 75 | 76 | −9%/decade, ages 70–80 |
| 80 | 71 | ” |
| 85 | 66 | −10%/decade, ages 80–90 |
| 90 | 61 | ” |

**Important cross-sex metric note:** PRD §5.2 defines "% of peak" against **the
sedentary/untrained reference peak**, currently a single shared 100. Once sex is wired
in, tu9.2 needs to decide: is 100 "that sex's own peak" (as tabulated above, which is
how these two tables were built) or is there a single shared cross-sex reference (e.g.,
because Janssen et al., 2000 shows men have ~33kg vs. women's ~21kg of skeletal muscle
in absolute terms — men's absolute peak is substantially higher)? Given PRD's existing
"why not % of own peak" reasoning (§5.2, third paragraph) was specifically about
*activity* not flattening the sedentary/trained comparison, I'd recommend keeping "% of
own-sex sedentary peak" as the 100-point for each sex's curve (i.e., treat male-100 and
female-100 as two independently normalized references, since the interesting
comparisons in this tool are same-sex activity-vs-sedentary, not cross-sex absolute
mass). This should be called out as a deliberate product decision in tu9.2, not left
implicit.

---

## 2. Resistance training response — `ACTIVITY_TARGET_BONUS.strengthTraining` / `ACTIVITY_TARGET_RETENTION.strengthTraining`

### Evidence on magnitude of the trained-vs-sedentary peak gap ("bonus")

The clearest, most directly-applicable data point comes from a 2023 cross-sectional
comparison of lifelong competitive strength, sprint, and endurance athletes against
age-matched sedentary controls (young cohort 20–39y, old cohort 70–89y):

- **Young (20–39y) lifelong strength athletes' appendicular lean mass index (ALMI) was
  ~19% higher than age-matched sedentary controls** (10.4 ± 1.1 vs. 8.4 ± 0.8 kg/m²)
  (Walker et al., 2023).
- **Older (70–89y) lifelong strength athletes' ALMI was ~9% higher** than older sedentary
  controls (8.9 ± 0.9 vs. 7.7 ± 0.7 kg/m²) (Walker et al., 2023).
- Prevalence of low muscle mass (ALM < 20kg) was 16% in older sedentary controls vs.
  only 2–3% in older lifelong athletes (Walker et al., 2023) — a strong qualitative
  confirmation that lifelong training meaningfully shifts the whole curve, not just the
  peak.

Shorter-duration RCT evidence in older, previously-sedentary adults shows resistance
training *can* still produce real gains even starting late, just of smaller relative
magnitude over the RCT's short timeframe: a meta-analysis of resistance-training RCTs
in older adults found a pooled **+1.1 kg lean body mass gain** over ~20 weeks (Peterson
et al., 2011), and other RCTs report **quadriceps CSA increases of ~10–11%** after
12–24 weeks of resistance training in adults 65–75 and 85+ (Straight/related RCT
literature per Nunes et al., IJSNEM 2023), alongside a more modest **~2% whole-body lean
mass increase** over the same 12 weeks. These are *early-phase* training responses in
previously sedentary people and are expected to continue accumulating toward — but not
indefinitely beyond — something like the ~19% ALMI gap seen in lifelong trainers; this
is consistent with the code's existing exponential-approach-to-steady-state design
(`APPROACH_RATE_PER_YEAR`), not a contradiction of it.

**Recommendation for `ACTIVITY_TARGET_BONUS.strengthTraining`:**

| intensity | value (pp) | basis |
|---|---|---|
| low | 5 | fraction of the high-intensity target; casual/inconsistent lifting |
| moderate | 12 | current placeholder retained — mid-point, no direct citation pins this exactly but it sits sensibly between low and the ~19% lifelong-athlete figure |
| high | 18 | ≈ the ~19% ALMI advantage of lifelong strength athletes over sedentary controls at young/peak age (Walker et al., 2023) |

### Evidence on late-starting vs. lifelong training ("does starting late still work?")

This is the most directly relevant finding for the "started lifting at 50" scenario in
PRD §1: a study of master endurance runners who started training either before age 35
("early starters," ~52 years of training history) or after age 50 ("late starters,"
~18 years of training history) found **no significant difference in leg lean mass
between the two groups** — both groups had ~12% greater leg lean mass than non-athletic
controls, despite a >30-year difference in total training duration (Piasecki et al.,
2019). Similarly, Wroblewski et al. (2011) found masters athletes aged 40–81 showed
**no significant age-related decline in mid-thigh muscle cross-sectional area** (p=0.31)
on MRI, in contrast to the well-documented decline in sedentary populations.

This is strong support for the model's existing structural choice (not a value to
change, but worth flagging as validated): a late starter's `bonus`/`retention` should
approach the *same* steady-state target as a lifelong trainer, just later — which is
exactly what the exponential-approach-to-target design in `computeCurve.js` already
does. tu9.2 should not need to add an explicit "years of training history" penalty term;
the existing per-year approach-rate mechanism appears to be a reasonable model of this
literature.

### Evidence on retention (protection from post-peak decline)

Direct "retention fraction" numbers don't exist in the literature (this is a model
construct, not a measured quantity), so this is reasoned from the athlete-vs-control
comparisons above: the ~19%→~9% *narrowing* of the relative ALMI gap between young and
old lifelong-strength cohorts in the same cross-sectional study (Walker et al., 2023)
looks at first glance like it argues for a *higher* (less protective) retention value.
However, this is a cross-sectional (different people at different ages), not
longitudinal, comparison, and is likely confounded by survivorship in the oldest athlete
cohort, reduced training volume with age even among "masters" competitors, and possible
changes to bone/height normalization. The longitudinal-in-spirit evidence — Wroblewski's
near-zero measured decline in trained quadriceps CSA with age, and Piasecki's finding
that even *late* starters match early starters' lean-mass advantage — is more directly
about retention/protection and argues for a low (strongly protective) retention value at
high intensity.

**Recommendation for `ACTIVITY_TARGET_RETENTION.strengthTraining`:**

| intensity | value | basis |
|---|---|---|
| low | 0.80 | some protection; occasional/low-volume lifting |
| moderate | 0.60 | current placeholder retained; between low and high |
| high | 0.40 | ≈ current placeholder (0.45); supported qualitatively by Wroblewski et al. (2011)'s near-flat trained muscle CSA with age, and Piasecki et al. (2019)'s late-starters-catch-up finding |

### Sex differences in training response

A 2025 systematic review with Bayesian meta-analysis of resistance-training studies
found **absolute** hypertrophy slightly favored males (larger baseline muscle to grow
from), but **relative** (%) increases in muscle size were essentially the same between
sexes (~0.69 percentage-point difference, not meaningfully different), including for
Type II fiber hypertrophy specifically (Refalo et al., 2025). Since `ACTIVITY_TARGET_*`
tables are defined as % / percentage-point deltas (relative quantities), this directly
supports **not** sex-splitting the strength-training bonus/retention tables — the
existing single flat table is fine here; the sex difference belongs entirely in §1's
baseline curves.

---

## 3. Cardio/walking's smaller but non-zero effect — `ACTIVITY_TARGET_BONUS`/`RETENTION` for `cardio` and `walking`

This is the weakest-evidence section of the document. Direct literature quantifying "how
many percentage points of bonus" or "what retention fraction" specifically for
aerobic/walking exercise (as distinct from strength training) barely exists, because
most exercise-and-sarcopenia research either studies resistance training in isolation or
combined/multicomponent programs. What is available:

- Systematic reviews of exercise in older adults with sarcopenia consistently find
  **resistance training has a large effect on muscle mass, while aerobic training has a
  small-to-null effect** on muscle mass specifically (though a positive effect on
  strength/function/quality of life) (Wang et al., 2022; related 2026 systematic
  review/meta-analysis of exercise in sarcopenic older adults).
- However, cross-sectional comparisons of lifelong-trained masters *endurance* athletes
  vs. sedentary age-matched controls do show a real, non-zero advantage: older (70–89y)
  endurance athletes' appendicular lean mass exceeded sedentary controls by
  **0.35–2.95 kg**, versus strength athletes' **1.97–5.53 kg** advantage over the same
  controls (Walker et al., 2023) — i.e., endurance training's advantage is real but
  roughly one-third to one-half the size of strength training's, at least in this
  cohort.
- Earlier narrative summaries note more mixed findings for endurance-trained masters
  athletes specifically, with some reports of endurance athletes' muscle mass being
  "comparable" to non-trained counterparts (in contrast to strength/power athletes who
  clearly separate from controls) — underscoring that this category has more
  study-to-study variance than resistance training does.

Given the sparse direct evidence, the recommended `cardio`/`walking` values below are
**extrapolated proportionally** from the strength-training numbers (§2) using the
Walker et al. (2023) ratio (endurance advantage ≈ 1/3–1/2 of strength advantage) as an
anchor, with `walking` set lower than `cardio` to reflect it being the lowest-intensity,
least anabolic activity type in the model, consistent with the RT-vs-aerobic
"large vs. small effect size" contrast above. These numbers should be treated as
**judgment calls informed by adjacent literature, not values read directly off a
citation** — flag this clearly in the `source` field (e.g., `source: "extrapolated,
see RESEARCH.md §3"` rather than a bare citation) so future readers don't mistake it for
a directly-measured number.

**Recommendation for `ACTIVITY_TARGET_BONUS`:**

| intensity | `cardio` | `walking` | basis |
|---|---|---|---|
| low | 2 | 1 | small, extrapolated |
| moderate | 4 | 2 | extrapolated at ~1/3 of strength-training moderate (12) |
| high | 7 | 4 | ≈ 1/2.5 of strength-training high (18), roughly matching Walker et al.'s ~0.35–2.95kg vs ~1.97–5.53kg (endurance ≈ 30–55% of strength advantage) |

**Recommendation for `ACTIVITY_TARGET_RETENTION`:**

| intensity | `cardio` | `walking` | basis |
|---|---|---|---|
| low | 0.92 | 0.96 | minimal protection at low volume |
| moderate | 0.80 | 0.90 | current cardio-moderate placeholder retained (0.8); walking kept less protective than cardio per RT>aerobic literature |
| high | 0.65 | 0.80 | reflects meaningful but sub-strength-training protection; anchored qualitatively to Walker et al.'s finding that endurance athletes clearly outperform sedentary controls at old age, just less than strength athletes |

---

## 4. `disabilityThreshold` — translating clinical sarcopenia cutoffs into "% of peak"

### The clinical cutoffs

Three widely-cited systems define "low muscle mass" thresholds, all normalized
differently:

1. **Baumgartner et al. (1998)** — the original sarcopenia definition. Appendicular
   skeletal muscle mass index (ASMI = ASM/height², kg/m²), cutoff = 2 SD below a
   young (18–40y) reference-group mean. Cutoffs: **7.26 kg/m² (men)**, **5.45 kg/m²
   (women)**, derived from a New Mexico elderly cohort. Sarcopenia prevalence by this
   definition rose from 13–24% under age 70 to over 50% over age 80 in the same cohort —
   itself a useful sanity check on where a threshold should sit relative to this tool's
   accelerating late-life decline curve.
2. **EWGSOP2 (Cruz-Jentoft et al., 2019)** — the current European consensus. Recommends
   (among several population-specific options) DXA-based ALM/height² cutoffs of
   **<7.0 kg/m² (men)**, **<5.5 kg/m² (women)** — very close to Baumgartner's original
   values.
3. **FNIH Sarcopenia Project (Cawthon et al., 2014, part of the broader Studenski et
   al., 2014 project)** — cutpoints chosen to predict clinically meaningful *weakness*
   rather than a fixed SD-based statistical threshold: ALM/BMI **<0.789 (men)**,
   **<0.512 (women)**, equivalently reported as absolute ALM **<19.75 kg (men)**,
   **<15.02 kg (women)** in that pooled cohort.

### Translating an index cutoff into "% of this tool's sedentary peak"

None of these cutoffs are expressed as "% of young/peak reference value" directly — they
are height- or BMI-normalized indices, which is a genuinely different quantity from this
tool's simple "% of sedentary peak" metric (PRD §5.2). The translation below is
therefore an approximation of an approximation, and should be treated as the most
uncertain single number in this document.

**Method used:** for a threshold defined as *mean − 2·SD* of a young reference
population, the fraction of the young mean that the cutoff represents is
`1 − 2·(SD/mean)`, i.e., `1 − 2·CV` where CV is the reference population's coefficient
of variation for that index. A DXA study of 216 healthy young (20–40y) Mexican adults
reports ASMI mean ± SD of **7.5 ± 0.8 kg/m² (men)** and **5.8 ± 0.5 kg/m² (women)**
(Alemán-Mateo & Ruiz Valenzuela, 2014), giving CVs of ~10.7% (men) and ~8.6% (women).
Applying the formula: cutoff ≈ **79% of young-reference peak for men**, **≈83% for
women**. Caveat: this same paper notes Caucasian-population reference cutoffs (like
Baumgartner's and EWGSOP2's) are *higher* than this Mexican cohort's, so its CV isn't
necessarily representative of the populations underlying those cutoffs — different
reference cohorts plausibly land anywhere in a 70–85% range depending on the population
studied.

**Recommendation:** given that uncertainty range, I recommend a single rounded
approximate value rather than false precision:

- `disabilityThreshold.value` ≈ **70** (up from the current placeholder of 55), i.e.,
  roughly "when a person's own-sex sedentary curve would put them at 70% of their
  sedentary peak, per-literature muscle-mass-based sarcopenia thresholds cluster
  somewhere in this neighborhood."
- If tu9.2 sex-splits this (see §0): a plausible split, following the CV-based estimate
  above, would be **~68 (male) / ~73 (female)** — women's index has a smaller CV in the
  cited reference sample, placing their cutoff proportionally closer to their own peak.
  This directional split (women's threshold closer to their peak, in relative terms)
  should be treated as low-confidence — it's derived from one reference-population study
  with a fairly small sample per sex, not a cross-study consensus.
- Given the explicit approximate/educational framing already required by PRD §9, I'd
  suggest documenting this as a *range* (e.g., 65–75) in the UI's "about the model"
  panel (PRD §10 M5) rather than presenting 70 as a precise clinical fact.

State plainly in the `source` field that this value is a **derived approximation**, not
a directly-cited number: e.g. `source: "approximated from EWGSOP2/Baumgartner ALM index
cutoffs translated to % of peak; see RESEARCH.md §4"`.

---

## References

- Alemán-Mateo H, Ruiz Valenzuela RE. Skeletal Muscle Mass Indices in Healthy Young
  Mexican Adults Aged 20–40 Years: Implications for Diagnoses of Sarcopenia in the
  Elderly Population. *Sci World J.* 2014;2014:672158.
  https://pmc.ncbi.nlm.nih.gov/articles/PMC3933398/
- Baumgartner RN, Koehler KM, Gallagher D, et al. Epidemiology of sarcopenia among the
  elderly in New Mexico. *Am J Epidemiol.* 1998;147(8):755–763.
  https://academic.oup.com/aje/article-abstract/147/8/755/88959
- Cawthon PM, Peters KW, Shardell MD, et al. Cutpoints for Low Appendicular Lean Mass
  That Identify Older Adults With Clinically Significant Weakness. *J Gerontol A Biol
  Sci Med Sci.* 2014;69(5):567–575.
  https://academic.oup.com/biomedgerontology/article/69/5/567/672754
- Cruz-Jentoft AJ, Bahat G, Bauer J, et al. Sarcopenia: revised European consensus on
  definition and diagnosis (EWGSOP2). *Age Ageing.* 2019;48(1):16–31.
  https://pmc.ncbi.nlm.nih.gov/articles/PMC6322506/
- Goodpaster BH, Park SW, Harris TB, et al. The loss of skeletal muscle strength, mass,
  and quality in older adults: the Health, Aging and Body Composition Study. *J
  Gerontol A Biol Sci Med Sci.* 2006;61(10):1059–1064.
  https://academic.oup.com/biomedgerontology/article/61/10/1059/600461
- Janssen I, Heymsfield SB, Wang ZM, Ross R. Skeletal muscle mass and distribution in
  468 men and women aged 18–88 yr. *J Appl Physiol.* 2000;89(1):81–88.
  https://journals.physiology.org/doi/full/10.1152/jappl.2000.89.1.81 /
  https://pubmed.ncbi.nlm.nih.gov/10904038/
- Mitchell WK, Williams J, Atherton P, Larvin M, Lund J, Narici M. Sarcopenia,
  dynapenia, and the impact of advancing age on human skeletal muscle size and
  strength; a quantitative review. *Front Physiol.* 2012;3:260.
  https://pmc.ncbi.nlm.nih.gov/articles/PMC3429036/
- Nunes JP, et al. Muscle Mass and Strength Gains Following Resistance Exercise
  Training in Older Adults 65–75 Years and Older Adults Above 85 Years. *Int J Sport
  Nutr Exerc Metab.* 2023;34(1):11–20.
  https://journals.humankinetics.com/view/journals/ijsnem/34/1/article-p11.xml
- Peterson MD, Sen A, Gordon PM. Influence of resistance exercise on lean body mass in
  aging adults: a meta-analysis. *Med Sci Sports Exerc.* 2011;43(2):249–258.
  https://pubmed.ncbi.nlm.nih.gov/20543750/
- Piasecki J, Ireland A, Piasecki M, Deere KC, Hannam K, Tobias JH, McPhee JS.
  Comparison of Muscle Function, Bone Mineral Density and Body Composition of Early
  Starting and Later Starting Older Masters Athletes. *Front Physiol.* 2019;10:1050.
  https://pmc.ncbi.nlm.nih.gov/articles/PMC6719569/
- Refalo MC, Nuckols G, Galpin AJ, Gallagher IJ, Hamilton DL, Fyfe JJ. Sex differences
  in absolute and relative changes in muscle size following resistance training in
  healthy adults: a systematic review with Bayesian meta-analysis. *PeerJ.*
  2025;13:e19042. https://pmc.ncbi.nlm.nih.gov/articles/PMC11869894/
- Silva et al. Age- and sex-specific normative values for muscle mass parameters in
  18,625 Brazilian adults. *Front Public Health.* 2023;11:1287994.
  https://pmc.ncbi.nlm.nih.gov/articles/PMC10791914/
- Studenski SA, Peters KW, Alley DE, et al. The FNIH Sarcopenia Project: Rationale,
  Study Description, Conference Recommendations, and Final Estimates. *J Gerontol A
  Biol Sci Med Sci.* 2014;69(5):547–558.
  https://academic.oup.com/biomedgerontology/article/69/5/547/672497
- Walker S, von Bonsdorff M, Cheng S, Häkkinen K, Bondarev D, Heinonen A, Korhonen MT.
  Body composition in male lifelong trained strength, sprint and endurance athletes and
  healthy age-matched controls. *Front Sports Act Living.* 2023;5:1295906.
  https://pmc.ncbi.nlm.nih.gov/articles/PMC10650965/
- Wang H, Huang WY, Zhao Y. Efficacy of Exercise on Muscle Function and Physical
  Performance in Older Adults with Sarcopenia: An Updated Systematic Review and
  Meta-Analysis. *Int J Environ Res Public Health.* 2022.
  https://pmc.ncbi.nlm.nih.gov/articles/PMC9266336/
- Wroblewski AP, Amati F, Smiley MA, Goodpaster B, Wright V. Chronic Exercise Preserves
  Lean Muscle Mass in Masters Athletes. *Phys Sportsmed.* 2011;39(3):172–178.
  https://www.researchgate.net/publication/51748759_Chronic_Exercise_Preserves_Lean_Muscle_Mass_in_Masters_Athletes
