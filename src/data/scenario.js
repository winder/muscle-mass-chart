// Phase and Scenario data structures — PRD.md §5.1, §5.3.
//
// Forward-compat note (PRD §5.3): a Phase currently holds one activity
// (activityType/intensity/cardioZone). When compound/stacked activities are
// added post-V1, this becomes `activities: Activity[]` per phase. Phase-level
// concerns (the age range) and activity-level concerns (type/intensity) are
// kept in separate helper functions below so that change stays additive.

export const AGE_MIN = 10;
export const AGE_MAX = 90;

export const ACTIVITY_TYPES = ['sedentary', 'strengthTraining', 'cardio', 'walking'];
export const INTENSITIES = ['low', 'moderate', 'high'];
export const CARDIO_ZONES = ['zone1_2', 'zone3', 'zone4_5'];

/**
 * @typedef {Object} Phase
 * @property {number} startAge
 * @property {number} endAge
 * @property {'sedentary'|'strengthTraining'|'cardio'|'walking'} activityType
 * @property {'low'|'moderate'|'high'} [intensity] - omitted when sedentary
 * @property {'zone1_2'|'zone3'|'zone4_5'} [cardioZone] - only when activityType is 'cardio'
 */

/** @param {Partial<Phase>} fields */
export function createPhase({ startAge, endAge, activityType, intensity, cardioZone }) {
  /** @type {Phase} */
  const phase = { startAge, endAge, activityType };
  if (activityType !== 'sedentary') {
    phase.intensity = intensity ?? 'moderate';
  }
  if (activityType === 'cardio') {
    phase.cardioZone = cardioZone ?? 'zone1_2';
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
 * Move the boundary between phases[index] and phases[index + 1] to newEndAge,
 * clamped so both phases keep at least a 1-year span. Returns a new array.
 */
export function setPhaseEndAge(phases, index, newEndAge) {
  if (index < 0 || index >= phases.length - 1) return phases;
  const minEnd = phases[index].startAge + 1;
  const maxEnd = phases[index + 1].endAge - 1;
  const clamped = Math.min(Math.max(newEndAge, minEnd), maxEnd);
  return phases.map((phase, i) => {
    if (i === index) return { ...phase, endAge: clamped };
    if (i === index + 1) return { ...phase, startAge: clamped };
    return phase;
  });
}

/** Split a phase at its midpoint into two identical-activity phases. Returns a new array. */
export function splitPhase(phases, index) {
  const phase = phases[index];
  if (!phase) return phases;
  const mid = Math.round((phase.startAge + phase.endAge) / 2);
  if (mid <= phase.startAge || mid >= phase.endAge) return phases;
  const first = { ...phase, endAge: mid };
  const second = { ...phase, startAge: mid };
  return [...phases.slice(0, index), first, second, ...phases.slice(index + 1)];
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
