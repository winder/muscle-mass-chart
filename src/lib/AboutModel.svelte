<script>
  import { nonExerciserCurve, disabilityThreshold } from '../data/muscleModel.js';
  import { ACTIVITY_TARGET_SOURCES } from '../data/computeCurve.js';

  const ACTIVITY_LABELS = {
    strengthTraining: 'Strength training',
    cardio: 'Cardio',
    walking: 'Walking',
  };

  const activitySources = Object.entries(ACTIVITY_TARGET_SOURCES).filter(([, source]) => source);
</script>

<details class="about-model">
  <summary>About the model &amp; sources</summary>
  <div class="about-model-body">
    <dl>
      <dt>{nonExerciserCurve.label} curve</dt>
      <dd>{nonExerciserCurve.source}</dd>

      <dt>{disabilityThreshold.label} ({disabilityThreshold.value})</dt>
      <dd>{disabilityThreshold.source}</dd>

      {#each activitySources as [activity, source] (activity)}
        <dt>{ACTIVITY_LABELS[activity] ?? activity} response</dt>
        <dd>{source}</dd>
      {/each}
    </dl>
  </div>
</details>

<style>
  .about-model {
    margin: 1rem 0 0;
    font-size: 0.8em;
    color: #777;
  }

  .about-model summary {
    cursor: pointer;
    color: #555;
  }

  .about-model-body {
    margin-top: 0.5rem;
  }

  dl {
    margin: 0;
  }

  dt {
    font-weight: 600;
    color: #555;
    margin-top: 0.6rem;
  }

  dt:first-child {
    margin-top: 0;
  }

  dd {
    margin: 0.15rem 0 0;
  }

</style>
