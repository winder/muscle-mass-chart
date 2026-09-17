// Computes a muscle-mass-vs-age curve for a Scenario — PRD.md §5.1, §7.
//
// Model (placeholder, source: null — PRD §7), tuned to visually match the
// shape of the Northern Michigan Sports Medicine reference chart (shared
// early-life rise, then a plateau for trained individuals vs. an earlier,
// steadier decline for sedentary ones, with a growing gap over time — not a
// curve that's merely shifted up by a constant amount). Two per-phase
// quantities exponentially approach a steady-state target each year (simple
// exponential approach, Euler-integrated in 1-year steps):
//
// - `bonus`: extra percentage points added during the sedentary curve's
//   growth years (10 to its own peak, ~30), so a trained scenario reaches a
//   higher peak than sedentary — not just a later one.
// - `retention`: the fraction of the sedentary curve's year-over-year
//   *decline* (post-peak) that a trained scenario still experiences. 1.0
//   means no protection (declines exactly like sedentary); a trained
//   scenario's retention well below 1 is what produces a visible plateau
//   and a gap from the sedentary line that widens with age, rather than a
//   fixed-size gap.
//
// Sedentary itself has bonus=0 and retention=1, so it reproduces
// nonExerciserCurve exactly. All magnitudes here are illustrative and
// expected to be replaced by the Milestone 5 research pass.
//
// The metric (PRD §5.2) is % of the SEDENTARY/UNTRAINED reference peak, not
// each scenario's own peak — 100 is nonExerciserCurve's peak specifically,
// and a trained scenario is expected to exceed 100 at its own peak. There is
// deliberately no upper clamp here: capping at 100 would make it impossible
// for any activity to ever show a higher peak than sedentary, which
// contradicts the whole premise of the tool.

import { nonExerciserCurve } from './muscleModel.js';
import { AGE_MIN, AGE_MAX, findPhaseAtAge } from './scenario.js';

const APPROACH_RATE_PER_YEAR = 0.15;

// Steady-state bonus (percentage points) added during the growth years
// (10-30ish) for an indefinitely sustained activity/intensity.
export const ACTIVITY_TARGET_BONUS = {
  sedentary: { low: 0, moderate: 0, high: 0 },
  walking: { low: 2, moderate: 4, high: 6 },
  cardio: { low: 3, moderate: 5, high: 8 },
  strengthTraining: { low: 6, moderate: 12, high: 18 },
};

// Steady-state fraction of the sedentary curve's post-peak year-over-year
// decline a scenario still experiences (1 = full decline, lower = slower).
export const ACTIVITY_TARGET_RETENTION = {
  sedentary: { low: 1, moderate: 1, high: 1 },
  walking: { low: 0.95, moderate: 0.9, high: 0.85 },
  cardio: { low: 0.9, moderate: 0.8, high: 0.7 },
  strengthTraining: { low: 0.75, moderate: 0.6, high: 0.45 },
};

function targetFor(table, phase) {
  const row = table[phase.activityType] ?? table.sedentary;
  return row[phase.intensity ?? 'moderate'] ?? row.moderate;
}

/** Piecewise-linear interpolation over the sedentary baseline curve. */
function baselineValueAt(age) {
  const points = nonExerciserCurve.points;
  if (age <= points[0].age) return points[0].value;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (age >= a.age && age <= b.age) {
      const t = (age - a.age) / (b.age - a.age);
      return a.value + t * (b.value - a.value);
    }
  }
  return points[points.length - 1].value;
}

/** @param {import('./scenario.js').Scenario} scenario */
export function computeScenarioCurve(scenario, { stepYears = 1 } = {}) {
  const phases = [...scenario.phases].sort((a, b) => a.startAge - b.startAge);
  const points = [{ age: AGE_MIN, value: baselineValueAt(AGE_MIN) }];
  let bonus = 0;
  let retention = 1;
  let value = baselineValueAt(AGE_MIN);
  let prevBaseline = baselineValueAt(AGE_MIN);
  for (let age = AGE_MIN + stepYears; age <= AGE_MAX; age += stepYears) {
    const phase = findPhaseAtAge(phases, age) ?? phases[phases.length - 1];
    const prevBonus = bonus;
    bonus += (targetFor(ACTIVITY_TARGET_BONUS, phase) - bonus) * APPROACH_RATE_PER_YEAR * stepYears;
    retention += (targetFor(ACTIVITY_TARGET_RETENTION, phase) - retention) * APPROACH_RATE_PER_YEAR * stepYears;

    const baseline = baselineValueAt(age);
    const baselineDelta = baseline - prevBaseline;
    // Growing years get the full baseline growth plus that year's increase
    // in the training bonus (a higher achievable peak); declining years get
    // only `retention`'s share of the baseline's loss that year (a slower
    // decline that widens the gap from sedentary over time).
    value += baselineDelta >= 0 ? baselineDelta + (bonus - prevBonus) : baselineDelta * retention;
    prevBaseline = baseline;

    points.push({ age, value: Math.max(0, value) });
  }
  return points;
}
