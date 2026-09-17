// Sourced from the Milestone 5 research pass — see RESEARCH.md for full
// analysis, methodology and citation list (PRD.md §7, §10 M5).
//
// Values are % of the sedentary/untrained reference peak (PRD.md §5.2) —
// nonExerciserCurve's own peak (100, at age 30) IS that reference. It's the
// baseline that computeCurve.js interpolates and applies activity-driven
// "bonus" adjustments on top of (see computeCurve.js), and a trained
// scenario's curve is expected to exceed 100 — the M1 hardcoded "Exerciser"
// curve was replaced by that computed curve in Milestone 2 and removed from
// here as dead weight.
//
// This curve uses male-population figures. RESEARCH.md §1 also derived a
// separate female curve (different peak age and decline rates), but
// `Scenario.sex` isn't wired into the computation path yet — see the
// sex-wiring follow-up issue. Using this single male curve for all
// scenarios in the meantime is a known simplification, not an oversight.

export const nonExerciserCurve = {
  label: 'Non-exerciser',
  source:
    'Mitchell et al. 2012 (decade decline rates); Goodpaster et al. 2006 ' +
    '(post-60 acceleration); Janssen et al. 2000 (cross-sectional shape). ' +
    'Ages 10-20 extrapolated from general pubertal-accretion timing, not ' +
    'directly cited. Male-population values; see RESEARCH.md §1.',
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
};

// Sourced from the Milestone 5 research pass — see RESEARCH.md §4. This is
// an approximation of an approximation (a height/BMI-normalized clinical
// index translated into this tool's "% of peak" metric), so it's the single
// most uncertain constant in this module — flagged as such in-app (tu9.3),
// not presented as clinical fact.
export const disabilityThreshold = {
  label: 'Disability threshold',
  value: 70,
  source:
    'Approximated from EWGSOP2 (Cruz-Jentoft et al. 2019), Baumgartner et ' +
    'al. 1998, and FNIH (Cawthon et al. 2014) appendicular-lean-mass-index ' +
    'cutoffs, translated to % of sedentary peak via reference-population CV; ' +
    'plausible range 65-75. See RESEARCH.md §4.',
};
