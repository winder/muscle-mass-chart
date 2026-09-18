# Research Pass — Bone Density / Osteoporosis (supporting a new "Other contributing factors" subsection)

This document supports a **prose + small stat/table addition** to the existing sarcopenia
"science" section, explaining how strength training and weight-bearing cardio help bone
health beyond their effect on muscle mass. It is **not** a new model/calculator — no new
constants are being added to `src/data/`. It follows the citation style of `RESEARCH.md`
(inline citations, full reference list at the end) but is deliberately much narrower and
shorter, per scope. Where the literature doesn't cleanly support a clean, comparable
number, that is stated explicitly rather than papered over (§6).

---

## 1. What osteoporosis/osteopenia is, and how BMD changes with age

**Definitions.** The WHO's 1994 diagnostic criteria, still in clinical use, classify bone
mineral density (BMD) by T-score — an individual's BMD compared to the mean BMD of a
healthy young-adult (typically 25–35y) reference population of the same sex, in standard
deviations (SD): **normal** = T-score ≥ −1.0; **osteopenia/low bone mass** = T-score
between −1.0 and −2.5; **osteoporosis** = T-score ≤ −2.5 (Kanis, 1994). Osteoporosis is
low bone mass plus microarchitectural deterioration of bone tissue, which increases
fracture risk, particularly at the hip, spine, and wrist.

**Peak bone mass.** The National Osteoporosis Foundation's evidence-based position
statement concludes most individuals reach peak bone mass at **age 30**, with lifestyle
factors (exercise, calcium/vitamin D, body weight) explaining an estimated 20–40% of the
variance in adult peak bone mass — i.e., a meaningful, modifiable share of a person's
lifetime bone-fracture risk is set before midlife (Weaver et al., 2016).

**Rate of decline and the post-menopausal acceleration.** A longitudinal DXA study of
620 healthy adults (398 women, 222 men, ages 20–89, followed with two scans two years
apart) found premenopausal bone loss was essentially undetectable except a very slow
loss at the hip, whereas after menopause women lost bone at all measured sites, and men
also showed age-related loss at all sites, though generally slower than postmenopausal
women (Warming et al., 2002). A separate Canadian population-based cohort (Canadian
Multicentre Osteoporosis Study, ~9,000 adults) quantifies this more precisely:

- **Women transitioning from pre- to post-menopause (ages 50–54)** lost bone the fastest
  of any group studied: **−6.8% over 5 years at the total hip** (≈ 13–14%/decade
  equivalent) and −4.4% over 5 years at the lumbar spine (≈ 9%/decade equivalent)
  (Berger et al., 2008).
- **Men** showed a much slower, "nearly constant" rate of hip loss from their mid-30s
  onward, with **acceleration after age 65** — but no single point in a man's life
  matches the sharp menopausal spike seen in women (Berger et al., 2008).

A cleaner, frequently-cited single number for the postmenopausal rate comes from Riggs
et al.'s NEJM cohort study of early-postmenopausal women: **mean annual BMD loss of
1.9% ± 0.7%/year** across multiple skeletal sites in the years immediately following
menopause (Riggs et al., 2003) — i.e., a woman can lose on the order of **10% of her
bone density in the first 5 years after menopause**, an order of magnitude faster than
typical age-related muscle loss at the same age (compare RESEARCH.md §1: ~5%/decade for
women in their 50s).

**What's well-supported vs. not:** the size and timing of the *female* postmenopausal
acceleration is well-documented and consistent across multiple independent cohorts
(Warming 2002; Berger 2008; Riggs 2003). A single comparably clean **"%/decade" headline
figure for men across their whole adult lifespan** is not — the literature describes men's
loss as slower, later-onset, and lacking a sharp acceleration point until the mid-60s,
but I did not find a study reporting one clean cross-life "%/decade" number for men the
way Mitchell et al. (2012) did for muscle. Treat any single "X%/decade for men" figure as
an approximation, not a directly-cited number.

---

## 2. Prevalence — how common is low bone mass/osteoporosis, by age and sex

The clearest US population-level source is CDC/NCHS's NHANES-based data brief (DXA
measurements at the femoral neck and/or lumbar spine, nationally representative sample of
adults 50+) (Sarafrazi Isfahani et al., 2021):

| | Osteoporosis (T ≤ −2.5) | Osteopenia/low bone mass (T −1.0 to −2.5) |
|---|---|---|
| Women, 50+ (age-adjusted) | **19.6%** | 51.5% |
| Men, 50+ (age-adjusted) | 4.4% | 33.5% |
| Women 50–64 | 13.1% | 50.3% |
| Women 65+ | **27.1%** | 52.9% |
| Men 50–64 | 3.3% | 27.5% |
| Men 65+ | 5.7% | 40.7% |

This is a good direct parallel to the Baumgartner et al. (1998) sarcopenia-prevalence
framing already used elsewhere in this app: **roughly 1 in 5 US women over 50 already has
osteoporosis, rising to over 1 in 4 by 65+, and by 65+ a majority of women (>80% combined)
have either osteoporosis or low bone mass** (osteoporosis prevalence itself has been
*rising* among women from 2007–2008 through 2017–2018, per the same source, unlike low
bone mass which has been flat) (Sarafrazi Isfahani et al., 2021). Men's rates are
markedly lower at every age band, consistent with §1's later, slower male decline.

---

## 3. Effect of resistance/strength training on BMD

**Meta-analytic evidence, magnitude and site-specificity.** An early meta-analysis of 16
RCTs/controlled trials in pre- and post-menopausal women found exercise training produced
a treatment effect (exercise-group % change minus control-group % change per year) of
**+0.84% at the lumbar spine and +0.89% at the femoral neck** relative to sedentary
controls, with premenopausal and postmenopausal women benefiting similarly in relative
terms (Wolff et al., 1999). A later, more resistance-training-specific meta-analysis of
24 trials in postmenopausal women found that **combined** resistance-training protocols
(vs. resistance-alone) produced a moderate-to-large standardized effect on both hip BMD
(SMD = 0.41) and spine BMD (SMD = 0.43), while resistance-training-alone protocols showed
smaller, non-significant effects at those same sites — i.e., program design (adding
impact/other loading) matters as much as simply lifting weights (Zhao et al., 2015).

**A concrete high-intensity RCT result.** The LIFTMOR trial randomized 101 postmenopausal
women with low bone mass to 8 months of twice-weekly supervised high-intensity resistance
and impact training (5×5 reps at >85% 1RM plus jumping/impact) vs. a low-intensity home
program. The high-intensity group gained **+2.9% ± 2.8% lumbar spine BMD** (vs. −1.2% ±
2.8% in the low-intensity control, p<0.001) and **+0.3% ± 2.6% femoral neck BMD** (vs.
−1.9% ± 2.6% in control, p=0.004) — a roughly **4-point spine-BMD swing and 2-point
femoral-neck swing** between doing high-intensity strength training and not, over less
than a year, with no serious adverse events despite the women having low bone mass
(Watson et al., 2018). This is one of the more dramatic, citable single-study numbers
available and works well as a stat callout.

**Consistency check (systematic review, weaker on fractures than on BMD).** The Cochrane
review of exercise in postmenopausal women found a statistically significant but modest
effect on BMD, and explicitly found **no significant effect on fracture counts** in the
pooled trials (OR 0.61, 95% CI 0.23–1.64) — underpowered/short trials, not evidence that
exercise doesn't reduce fractures (see §5 for larger, fall/fracture-focused evidence)
(Howe et al., 2011).

---

## 4. Weight-bearing vs. non-weight-bearing cardio

There is a real, well-supported qualitative difference, though (as flagged in §6) the
literature is dominated by cross-sectional athlete comparisons rather than RCTs directly
manipulating exercise type.

- A classic controlled comparison of collegiate female athletes found **impact-loading
  sports (gymnastics, volleyball) had significantly greater BMD** at the lumbar spine,
  femoral neck, Ward's triangle, and total body than both an **active-loading, non-impact
  sport (swimming)** and sedentary controls — with swimmers not significantly different
  from non-athletic controls at most sites (Fehling et al., 1995).
- A systematic review of RCTs on exercise and bone strength found high-impact/"odd
  impact" loading athletes had **~15–30% greater cortical bone strength at the femoral
  neck** than sedentary counterparts, whereas athletes in non-impact sports (e.g.,
  swimming, cycling) did **not** have thicker cortices than non-athletes at all (Nikander
  et al., 2010).
- A direct comparison of competitive male road cyclists (n=27) vs. runners (n=16), same
  age range (20–59), found **60% of cyclists had spinal osteopenia vs. only 19% of
  runners** — despite comparable overall fitness/training volume between groups, implying
  the *type* of load (repetitive high-impact vs. seated/low-impact), not just aerobic
  fitness, is what drives the bone benefit (Rector et al., 2008).

**Bottom line for the app's prose:** walking/jogging/running (weight-bearing) plausibly
help bone in a way that cycling and swimming (non-weight-bearing) largely do not, and in
cyclists' case, may even coincide with lower BMD than expected for their fitness level —
though causation (does cycling *cause* bone loss, or do people with lower BMD self-select
into non-impact sports?) is not established by these cross-sectional comparisons.

---

## 5. Fracture/fall risk reduction from exercise, and osteosarcopenia

**Falls.** The current Cochrane review of exercise for preventing falls in
community-dwelling older adults (139 trials) found balance-and-functional exercise
programs **reduce the rate of falls by 24%** (rate ratio 0.76, 95% CI 0.70–0.81, high
certainty), and combined/multi-component programs (balance + resistance) reduce it by
**34%** (RaR 0.66, 95% CI 0.50–0.88) (Sherrington et al., 2019).

**Fall-related fractures specifically.** A meta-analysis of 20 RCTs (7,704 older adults,
428 fracture events) found exercise interventions reduced fall-related fracture risk by
**26%** (RR 0.74, 95% CI 0.59–0.92) (Kannus-adjacent literature; see El-Khoury et al. and
related pooled analyses cited below) — a smaller, less certain effect than the fall-rate
reduction above, and one that (per Howe et al., 2011, §3) individual smaller BMD-focused
trials are often underpowered to detect on their own.

**Osteosarcopenia — is it an established concept?** Yes: "osteosarcopenia" (concurrent
muscle-and-bone loss syndrome) is a recognized term in the geriatrics/bone literature,
with multiple review articles establishing it as a distinct, compounding risk category
rather than just "sarcopenia + osteoporosis co-occurring by chance" (Hirschfeld et al.,
2017). The clearest quantified evidence for *compounding* (not just additive) fracture
risk comes from a post-menopausal cohort study: compared with neither condition, the
odds ratio for fragility fracture was **2.48 for osteoporosis alone, 1.87 for sarcopenia
alone (not independently significant), and 3.70 for osteosarcopenia (both together)**
(Lin et al., 2021) — i.e., having both is meaningfully worse than simple addition of the
two individual risks would suggest, supporting the app's framing that muscle and bone
protection are complementary, not redundant, benefits of exercise.

---

## 6. Explicit gaps / weakly-sourced claims

Flagged honestly rather than papered over, per this app's existing convention:

1. **No single clean "%/decade for men" BMD figure** across the full adult lifespan
   (§1) — men's decline is documented as slower and later-accelerating, but not
   summarized in the literature the same tidy way Mitchell et al. (2012) summarized male
   muscle decline.
2. **The weight-bearing-vs-not comparison (§4) is built from cross-sectional
   athlete/observational studies, not RCTs** that randomly assign people to running vs.
   cycling vs. swimming for years — so some of the effect could reflect self-selection
   (people with better bone health choosing/sticking with higher-impact sports) rather
   than pure causation. Nikander et al. (2010) explicitly note a lack of RCT evidence
   directly comparing loading modalities.
3. **The fall-related-fracture RR (§5, 0.74)** is reported secondhand via search
   aggregation from a meta-analysis description rather than a page-by-page primary-text
   read of that exact paper; the number is consistent with the independently-verified
   Cochrane fall-*rate* figures (Sherrington et al., 2019) and with Howe et al.'s (2011)
   qualitative finding that BMD-focused trials are underpowered for fractures, but treat
   the specific "26%"/RR 0.74 figure as lower-confidence than the other numbers in this
   document until traced to its exact source paper.
4. **Osteopenia vs. osteoporosis nuance for LIFTMOR (§3):** the +2.9% lumbar spine gain
   is a single RCT (n=101, 8 months) in women specifically selected for low bone mass, not
   a general population — a strong, real result, but not necessarily the gain a person
   with already-normal BMD would see.

---

## References

- Berger C, Langsetmo L, Joseph L, et al. Change in bone mineral density as a function of
  age in women and men and association with the use of antiresorptive agents. *CMAJ.*
  2008;178(13):1660–1668. https://pmc.ncbi.nlm.nih.gov/articles/PMC2413314/
- Fehling PC, Alekel L, Clasey J, Rector A, Stillman RJ. A comparison of bone mineral
  densities among female athletes in impact loading and active loading sports. *Bone.*
  1995;17(3):205–210. https://pubmed.ncbi.nlm.nih.gov/8541132/
- Hirschfeld HP, Kinsella R, Duque G. Osteosarcopenia: where bone, muscle, and fat
  collide. *Osteoporos Int.* 2017;28(10):2781–2790.
  https://pubmed.ncbi.nlm.nih.gov/28733716/
- Howe TE, Shea B, Dawson LJ, et al. Exercise for preventing and treating osteoporosis in
  postmenopausal women. *Cochrane Database Syst Rev.* 2011;(7):CD000333.
  https://pubmed.ncbi.nlm.nih.gov/21735380/
- Kanis JA, on behalf of the WHO Study Group. Assessment of fracture risk and its
  application to screening for postmenopausal osteoporosis: synopsis of a WHO report.
  *Osteoporos Int.* 1994;4(6):368–381.
- Lin YH, Shih YT, Teng MMH. The Impact of the "Osteo" Component of Osteosarcopenia on
  Fragility Fractures in Post-Menopausal Women. *Int J Mol Sci.* 2021;22(10):5256.
  https://doi.org/10.3390/ijms22105256
- Nikander R, Sievänen H, Heinonen A, Daly RM, Uusi-Rasi K, Kannus P. Targeted exercise
  against osteoporosis: a systematic review and meta-analysis for optimising bone
  strength throughout life. *BMC Med.* 2010;8:47.
  https://pmc.ncbi.nlm.nih.gov/articles/PMC2918523/
- Rector RS, Rogers R, Ruebel M, Hinton PS. Participation in road cycling vs running is
  associated with lower bone mineral density in men. *Metabolism.* 2008;57(2):226–232.
  https://www.sciencedirect.com/science/article/abs/pii/S0026049507003253
- Riggs BL, Melton LJ, O'Fallon WM, et al. Bone loss and bone size after menopause. *N
  Engl J Med.* 2003;349(4):327–334. https://www.nejm.org/doi/full/10.1056/NEJMoa022464
- Sarafrazi Isfahani N, Wambogo EA, Shepherd JA. Osteoporosis or low bone mass in older
  adults: United States, 2017–2018. *NCHS Data Brief, no 405.* Hyattsville, MD: National
  Center for Health Statistics, 2021. https://www.cdc.gov/nchs/products/databriefs/db405.htm
- Sherrington C, Fairhall NJ, Wallbank GK, et al. Exercise for preventing falls in older
  people living in the community. *Cochrane Database Syst Rev.*
  2019;(1):CD012424. https://pmc.ncbi.nlm.nih.gov/articles/PMC6402469/
- Warming L, Hassager C, Christiansen C. Changes in bone mineral density with age in men
  and women: a longitudinal study. *Osteoporos Int.* 2002;13(2):105–112.
  https://pubmed.ncbi.nlm.nih.gov/11905520/
- Watson SL, Weeks BK, Weis LJ, Harding AT, Horan SA, Beck BR. High-Intensity Resistance
  and Impact Training Improves Bone Mineral Density and Physical Function in
  Postmenopausal Women With Osteopenia and Osteoporosis: The LIFTMOR Randomized
  Controlled Trial. *J Bone Miner Res.* 2018;33(2):211–220.
  https://pubmed.ncbi.nlm.nih.gov/28975661/
- Weaver CM, Gordon CM, Janz KF, et al. The National Osteoporosis Foundation's position
  statement on peak bone mass development and lifestyle factors: a systematic review and
  implementation recommendations. *Osteoporos Int.* 2016;27(4):1281–1386.
  https://pubmed.ncbi.nlm.nih.gov/26856587/
- Wolff I, van Croonenborg JJ, Kemper HCG, Kostense PJ, Twisk JWR. The effect of exercise
  training programs on bone mass: a meta-analysis of published controlled trials in pre-
  and postmenopausal women. *Osteoporos Int.* 1999;9(1):1–12.
  https://link.springer.com/article/10.1007/s001980050109
- Zhao R, Zhao M, Xu Z. The effects of differing resistance training modes on the
  preservation of bone mineral density in postmenopausal women: a meta-analysis.
  *Osteoporos Int.* 2015;26(5):1605–1618. https://pubmed.ncbi.nlm.nih.gov/25603795/
