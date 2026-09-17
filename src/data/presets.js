// Fitness-background presets — PRD.md §5.4.
//
// Presets are timeline *generators*: selecting one produces a fresh Phase[]
// for a scenario, which the user is then free to edit. The ages, activity
// types and intensities below are illustrative placeholders (source: null in
// spirit, same as muscleModel.js) matching the qualitative shape in the PRD
// §5.4 table — they are not derived from cited data and will be revisited in
// the Milestone 5 research pass. Ages 10-18 default to 'sedentary' for every
// preset as a simplification (pre-adulthood activity isn't modeled in V1).

import { AGE_MIN, AGE_MAX, createPhase } from './scenario.js';

const YOUTH_END = 18;

export const PRESETS = [
  {
    id: 'sedentary',
    label: 'Sedentary / never trained',
    generate: () => [createPhase({ startAge: AGE_MIN, endAge: AGE_MAX, activityType: 'sedentary' })],
  },
  {
    id: 'detrained',
    label: 'Previously active, now detrained',
    generate: () => [
      createPhase({ startAge: AGE_MIN, endAge: YOUTH_END, activityType: 'sedentary' }),
      createPhase({ startAge: YOUTH_END, endAge: 35, activityType: 'strengthTraining', intensity: 'moderate' }),
      createPhase({ startAge: 35, endAge: AGE_MAX, activityType: 'sedentary' }),
    ],
  },
  {
    id: 'recreational',
    label: 'Recreationally active',
    generate: () => [
      createPhase({ startAge: AGE_MIN, endAge: YOUTH_END, activityType: 'sedentary' }),
      createPhase({ startAge: YOUTH_END, endAge: AGE_MAX, activityType: 'walking', intensity: 'moderate' }),
    ],
  },
  {
    id: 'lifelongTrainer',
    label: 'Lifelong structured trainer',
    generate: () => [
      createPhase({ startAge: AGE_MIN, endAge: YOUTH_END, activityType: 'sedentary' }),
      createPhase({ startAge: YOUTH_END, endAge: AGE_MAX, activityType: 'strengthTraining', intensity: 'high' }),
    ],
  },
];
