// Phase and Scenario data structures — PRD.md §5.1, §5.3.
//
// Forward-compat note (PRD §5.3): a Phase currently holds one activity
// (activityType/intensity). When compound/stacked activities are added
// post-V1, this becomes `activities: Activity[]` per phase. Phase-level
// concerns (the age range) and activity-level concerns (type/intensity) are
// kept in separate helper functions below so that change stays additive.

export const AGE_MIN = 10;
export const AGE_MAX = 90;

export const ACTIVITY_TYPES = ['sedentary', 'strengthTraining', 'cardio', 'walking'];
export const INTENSITIES = ['low', 'moderate', 'high'];

/**
 * @typedef {Object} Phase
 * @property {number} startAge
 * @property {number} endAge
 * @property {'sedentary'|'strengthTraining'|'cardio'|'walking'} activityType
 * @property {'low'|'moderate'|'high'} [intensity] - omitted when sedentary
 */

/** @param {Partial<Phase>} fields */
export function createPhase({ startAge, endAge, activityType, intensity }) {
  /** @type {Phase} */
  const phase = { startAge, endAge, activityType };
  if (activityType !== 'sedentary') {
    phase.intensity = intensity ?? 'moderate';
  }
  return phase;
}

/**
 * @typedef {Object} Scenario
 * @property {string} id
 * @property {string} label
 * @property {'male'|'female'} sex
 * @property {Phase[]} phases - ordered, contiguous, covering AGE_MIN-AGE_MAX
 * @property {number} colorIndex
 */

/** @param {Partial<Scenario>} fields */
export function createScenario({ id, label, sex = 'male', phases, colorIndex = 0 }) {
  return { id, label, sex, phases, colorIndex };
}

/** Find the phase covering a given age (inclusive of AGE_MAX on the last phase). */
export function findPhaseAtAge(phases, age) {
  return phases.find((phase, i) => age >= phase.startAge && (age < phase.endAge || i === phases.length - 1));
}

/**
 * Change phases[index]'s end age, clamped to at least a 1-year span.
 *
 * For any phase but the last, this just moves the boundary with its next
 * neighbor (both keep at least a 1-year span). The last phase has no next
 * neighbor to hand its shortened range to, so lowering its end age below
 * AGE_MAX instead auto-splits it: it's shortened, and a new trailing phase
 * (a copy of it, same activity) is appended to fill the rest up to AGE_MAX —
 * this is how the UI lets a user carve out a new final phase without a
 * separate "Split" control: the last phase's end age is always editable,
 * and editing it down is the split.
 *
 * Returns a new array.
 */
export function setPhaseEndAge(phases, index, newEndAge) {
  if (index < 0 || index >= phases.length) return phases;
  const phase = phases[index];
  const isLast = index === phases.length - 1;
  const minEnd = phase.startAge + 1;
  const maxEnd = isLast ? AGE_MAX : phases[index + 1].endAge - 1;
  const clamped = Math.min(Math.max(newEndAge, minEnd), maxEnd);

  if (!isLast) {
    return phases.map((p, i) => {
      if (i === index) return { ...p, endAge: clamped };
      if (i === index + 1) return { ...p, startAge: clamped };
      return p;
    });
  }
  if (clamped >= AGE_MAX) {
    return phases.map((p, i) => (i === index ? { ...p, endAge: AGE_MAX } : p));
  }
  return [
    ...phases.slice(0, index),
    { ...phase, endAge: clamped },
    { ...phase, startAge: clamped, endAge: AGE_MAX },
  ];
}

/**
 * Remove a phase, extending a neighbor to keep the timeline contiguous.
 * Refuses to remove the last remaining phase. Returns a new array.
 */
export function removePhase(phases, index) {
  if (phases.length <= 1) return phases;
  const phase = phases[index];
  if (index === 0) {
    const next = phases[1];
    return [{ ...next, startAge: phase.startAge }, ...phases.slice(2)];
  }
  const prev = phases[index - 1];
  return [...phases.slice(0, index - 1), { ...prev, endAge: phase.endAge }, ...phases.slice(index + 1)];
}
