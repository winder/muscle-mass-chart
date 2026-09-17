// Placeholder approximations only — see PRD.md §7. Every curve below carries
// `source: null` until the Milestone 5 research pass replaces these with
// cited values (PRD.md §10 M5).
//
// Values are % of that individual's own peak muscle mass (PRD.md §5.2),
// so both curves reach 100 at their own peak; they differ in how long that
// peak is sustained and how fast it declines afterward.

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

export const exerciserCurve = {
  label: 'Exerciser',
  source: null,
  points: [
    { age: 10, value: 55 },
    { age: 15, value: 80 },
    { age: 20, value: 95 },
    { age: 25, value: 100 },
    { age: 30, value: 100 },
    { age: 35, value: 99 },
    { age: 40, value: 97 },
    { age: 45, value: 94 },
    { age: 50, value: 90 },
    { age: 55, value: 86 },
    { age: 60, value: 81 },
    { age: 65, value: 76 },
    { age: 70, value: 71 },
    { age: 75, value: 66 },
    { age: 80, value: 61 },
    { age: 85, value: 56 },
    { age: 90, value: 51 },
  ],
};

// Placeholder threshold: picked so it sits between the two curves' late-life
// trajectories (non-exerciser crosses below it in the 70s, exerciser not
// until near 90), matching the qualitative shape of the reference chart.
export const disabilityThreshold = {
  label: 'Disability threshold',
  value: 55,
  source: null,
};
