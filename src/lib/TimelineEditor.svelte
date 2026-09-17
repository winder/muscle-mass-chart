<script>
  import {
    ACTIVITY_TYPES,
    INTENSITIES,
    AGE_MAX,
    setPhaseEndAge,
    removePhase,
  } from '../data/scenario.js';

  let { phases = $bindable([]) } = $props();

  function updateEndAge(index, value) {
    const endAge = Number(value);
    if (Number.isNaN(endAge)) return;
    phases = setPhaseEndAge(phases, index, endAge);
  }

  function updateActivityType(index, activityType) {
    phases = phases.map((phase, i) => {
      if (i !== index) return phase;
      const next = { ...phase, activityType };
      if (activityType === 'sedentary') {
        delete next.intensity;
      } else {
        next.intensity = phase.intensity ?? 'moderate';
      }
      return next;
    });
  }

  function updateIntensity(index, intensity) {
    phases = phases.map((phase, i) => (i === index ? { ...phase, intensity } : phase));
  }

  function onRemove(index) {
    phases = removePhase(phases, index);
  }
</script>

<div class="timeline-editor">
  {#each phases as phase, index (index)}
    <div class="phase-row">
      <span class="age-range">{phase.startAge}–{phase.endAge}</span>

      <select
        value={phase.activityType}
        onchange={(e) => updateActivityType(index, e.target.value)}
      >
        {#each ACTIVITY_TYPES as type}
          <option value={type}>{type}</option>
        {/each}
      </select>

      {#if phase.activityType !== 'sedentary'}
        <select
          value={phase.intensity ?? 'moderate'}
          onchange={(e) => updateIntensity(index, e.target.value)}
        >
          {#each INTENSITIES as level}
            <option value={level}>{level}</option>
          {/each}
        </select>
      {/if}

      <label class="end-age">
        {index < phases.length - 1 ? 'ends' : 'through'}
        <input
          type="number"
          min={phase.startAge + 1}
          max={AGE_MAX}
          value={phase.endAge}
          onchange={(e) => updateEndAge(index, e.target.value)}
        />
      </label>

      <button type="button" onclick={() => onRemove(index)} disabled={phases.length <= 1}>
        Remove
      </button>
    </div>
  {/each}
</div>

<style>
  .timeline-editor {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .phase-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .age-range {
    font-variant-numeric: tabular-nums;
    min-width: 4.5rem;
  }

  .end-age {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .end-age input {
    width: 4rem;
  }
</style>
