// Sourced from the Milestone 5 research pass — see RESEARCH.md for full
// analysis, methodology and citation list (PRD.md §7, §10 M5).
//
// Values are % of the sedentary/untrained reference peak (PRD.md §5.2) —
// nonExerciserCurve's own peak (100) IS that reference. It's the baseline
// that computeCurve.js interpolates and applies activity-driven "bonus"
// adjustments on top of (see computeCurve.js), and a trained scenario's
// curve is expected to exceed 100 — the M1 hardcoded "Exerciser" curve was
// replaced by that computed curve in Milestone 2 and removed from here as
// dead weight.
//
// Split by sex per RESEARCH.md §1: male and female peak at different ages
// (30 vs. 25) and decline at different rates, so each is normalized against
// its OWN peak (100 = that sex's own sedentary peak, not a shared cross-sex
// reference) — RESEARCH.md §1's "cross-sex metric note" recommends this
// because the comparisons this tool cares about are same-sex
// activity-vs-sedentary, not cross-sex absolute mass.

export const nonExerciserCurve = {
  male: {
    label: 'Non-exerciser (male)',
    source:
      'Mitchell et al. 2012 (decade decline rates); Goodpaster et al. 2006 ' +
      '(post-60 acceleration); Janssen et al. 2000 (cross-sectional shape). ' +
      'Ages 10-20 extrapolated from general pubertal-accretion timing, not ' +
      'directly cited. Male-population values.',
    points: [
      { age: 10, value: 45 },
      { age: 15, value: 68 },
      { age: 20, value: 88 },
      { age: 25, value: 96 },
      { age: 30, value: 100 },
      { age: 35, value: 99 },
      { age: 40, value: 97 },
      { age: 45, value: 95 },
      { age: 50, value: 92 },
      { age: 55, value: 89 },
      { age: 60, value: 86 },
      { age: 65, value: 82 },
      { age: 70, value: 78 },
      { age: 75, value: 73 },
      { age: 80, value: 68 },
      { age: 85, value: 62 },
      { age: 90, value: 56 },
    ],
  },
  female: {
    label: 'Non-exerciser (female)',
    source:
      'Silva et al. 2023 (earlier ASM peak, accelerated post-60 decline in ' +
      'women); Mitchell et al. 2012 (decade decline rates, lower end for ' +
      'women). Ages 10-20 extrapolated from general pubertal-accretion ' +
      'timing (earlier onset than boys), not directly cited. ' +
      'Female-population values.',
    points: [
      { age: 10, value: 50 },
      { age: 15, value: 75 },
      { age: 20, value: 92 },
      { age: 25, value: 100 },
      { age: 30, value: 99 },
      { age: 35, value: 98 },
      { age: 40, value: 96 },
      { age: 45, value: 94 },
      { age: 50, value: 92 },
      { age: 55, value: 90 },
      { age: 60, value: 87 },
      { age: 65, value: 84 },
      { age: 70, value: 80 },
      { age: 75, value: 76 },
      { age: 80, value: 71 },
      { age: 85, value: 66 },
      { age: 90, value: 61 },
    ],
  },
};

// Sourced from the Milestone 5 research pass — see RESEARCH.md §4. This is
// an approximation of an approximation (a height/BMI-normalized clinical
// index translated into this tool's "% of peak" metric), so it's the single
// most uncertain constant in this module — flagged as such in-app (tu9.3),
// not presented as clinical fact.
//
// Deliberately NOT sex-split (RESEARCH.md §4 discusses this explicitly):
// the ~68 (male) / ~73 (female) split RESEARCH.md derives is called out
// there as low-confidence, resting on one small reference-population study
// rather than a cross-study consensus — unlike nonExerciserCurve's male/
// female split above, which several independent studies agree on. A single
// shared value applied to both sexes' own-peak-normalized curves is judged
// the better tradeoff for this tool's "educational approximation, not
// clinical instrument" framing (PRD §9).
export const disabilityThreshold = {
  label: 'Disability threshold',
  value: 70,
  source:
    'Approximated from EWGSOP2 (Cruz-Jentoft et al. 2019), Baumgartner et ' +
    'al. 1998, and FNIH (Cawthon et al. 2014) appendicular-lean-mass-index ' +
    'cutoffs, translated to % of sedentary peak via reference-population CV; ' +
    'plausible range 65-75. Applied uniformly to both sexes\' own-peak-' +
    'normalized curves — see RESEARCH.md §4 for why this is not sex-split.',
};
