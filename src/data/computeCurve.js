// Computes a muscle-mass-vs-age curve for a Scenario — PRD.md §5.1, §7.
//
// Model (placeholder, source: null — PRD §7): each phase's activity pulls a
// "bonus" (percentage points above the sedentary baseline) toward a
// steady-state target. Training phases have a positive target; sedentary
// phases have a target of 0, so the same formula also models detraining
// (the bonus decays back toward the baseline instead of vanishing
// instantly). The bonus moves a fixed fraction of the remaining gap toward
// its target each year (simple exponential approach, Euler-integrated in
// 1-year steps) — this produces the "fast initial gains that plateau" and
// "gradual detraining" shapes seen in real training-response literature,
// without being derived from any specific cited study yet. All of this is
// expected to be replaced by the Milestone 5 research pass.

import { nonExerciserCurve } from './muscleModel.js';
import { AGE_MIN, AGE_MAX, findPhaseAtAge } from './scenario.js';

const BONUS_APPROACH_RATE_PER_YEAR = 0.15;

// Steady-state bonus (percentage points of % of peak) an indefinitely
// sustained activity/intensity is assumed to produce over the sedentary
// baseline. Placeholder magnitudes only.
export const ACTIVITY_TARGET_BONUS = {
  sedentary: { low: 0, moderate: 0, high: 0 },
  walking: { low: 3, moderate: 5, high: 7 },
  cardio: { low: 4, moderate: 7, high: 10 },
  strengthTraining: { low: 6, moderate: 12, high: 18 },
};

function targetBonusFor(phase) {
  const table = ACTIVITY_TARGET_BONUS[phase.activityType] ?? ACTIVITY_TARGET_BONUS.sedentary;
  return table[phase.intensity ?? 'moderate'] ?? 0;
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
  const points = [];
  let bonus = 0;
  for (let age = AGE_MIN; age <= AGE_MAX; age += stepYears) {
    const phase = findPhaseAtAge(phases, age) ?? phases[phases.length - 1];
    const target = targetBonusFor(phase);
    bonus += (target - bonus) * BONUS_APPROACH_RATE_PER_YEAR * stepYears;
    const value = Math.min(100, Math.max(0, baselineValueAt(age) + bonus));
    points.push({ age, value });
  }
  return points;
}
