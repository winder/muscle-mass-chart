// Placeholder approximations only — see PRD.md §7. Every curve below carries
// `source: null` until the Milestone 5 research pass replaces these with
// cited values (PRD.md §10 M5).
//
// Values are % of the sedentary/untrained reference peak (PRD.md §5.2) —
// nonExerciserCurve's own peak (100, at age 30) IS that reference. It's the
// baseline that computeCurve.js interpolates and applies activity-driven
// "bonus" adjustments on top of (see computeCurve.js), and a trained
// scenario's curve is expected to exceed 100 — the M1 hardcoded "Exerciser"
// curve was replaced by that computed curve in Milestone 2 and removed from
// here as dead weight.

export const nonExerciserCurve = {
  label: 'Non-exerciser',
  source: null,
  points: [
    { age: 10, value: 55 },
    { age: 15, value: 78 },
    { age: 20, value: 92 },
    { age: 25, value: 99 },
    { age: 30, value: 100 },
    { age: 35, value: 96 },
    { age: 40, value: 90 },
    { age: 45, value: 84 },
    { age: 50, value: 78 },
    { age: 55, value: 72 },
    { age: 60, value: 66 },
    { age: 65, value: 60 },
    { age: 70, value: 54 },
    { age: 75, value: 48 },
    { age: 80, value: 42 },
    { age: 85, value: 37 },
    { age: 90, value: 33 },
  ],
};

// Placeholder threshold value — see PRD §7, refined in the M5 research pass.
export const disabilityThreshold = {
  label: 'Disability threshold',
  value: 55,
  source: null,
};
