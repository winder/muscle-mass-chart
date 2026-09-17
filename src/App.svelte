<script>
  import MuscleChart from './lib/MuscleChart.svelte';
  import TimelineEditor from './lib/TimelineEditor.svelte';
  import { PRESETS } from './data/presets.js';
  import { createScenario } from './data/scenario.js';

  let selectedPresetId = $state(PRESETS[0].id);
  let phases = $state(PRESETS[0].generate());

  function selectPreset(id) {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    selectedPresetId = id;
    phases = preset.generate();
  }

  const scenario = $derived(
    createScenario({
      id: 'primary',
      label: PRESETS.find((p) => p.id === selectedPresetId)?.label ?? 'Custom scenario',
      sex: 'male',
      phases,
      colorIndex: 0,
    })
  );
</script>

<main>
  <h1>Muscle Mass vs. Age Calculator</h1>

  <label class="preset-picker">
    Fitness background preset:
    <select value={selectedPresetId} onchange={(e) => selectPreset(e.target.value)}>
      {#each PRESETS as preset (preset.id)}
        <option value={preset.id}>{preset.label}</option>
      {/each}
    </select>
  </label>

  <TimelineEditor bind:phases />

  <MuscleChart {scenario} />
</main>

<style>
  .preset-picker {
    display: block;
    margin: 1rem 0;
  }
</style>
