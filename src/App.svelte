<script>
  import MuscleChart from './lib/MuscleChart.svelte';
  import TimelineEditor from './lib/TimelineEditor.svelte';
  import { PRESETS } from './data/presets.js';

  let nextId = 1;
  let nextColorIndex = 1; // 0 is used by the first scenario

  function makeScenario(presetId, colorIndex) {
    const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
    return {
      id: `scenario-${nextId++}`,
      presetId: preset.id,
      label: preset.label,
      sex: 'male',
      phases: preset.generate(),
      colorIndex,
    };
  }

  let scenarios = $state([makeScenario(PRESETS[0].id, 0)]);

  function addScenario() {
    scenarios.push(makeScenario(PRESETS[0].id, nextColorIndex++));
  }

  function removeScenario(id) {
    if (scenarios.length <= 1) return;
    scenarios = scenarios.filter((s) => s.id !== id);
  }

  function selectPreset(scenario, presetId) {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    scenario.presetId = presetId;
    scenario.label = preset.label;
    scenario.phases = preset.generate();
  }
</script>

<main>
  <h1>Muscle Mass vs. Age Calculator</h1>

  {#each scenarios as scenario (scenario.id)}
    <section class="scenario-card">
      <div class="scenario-header">
        <label>
          Fitness background preset:
          <select
            value={scenario.presetId}
            onchange={(e) => selectPreset(scenario, e.target.value)}
          >
            {#each PRESETS as preset (preset.id)}
              <option value={preset.id}>{preset.label}</option>
            {/each}
          </select>
        </label>

        <button
          type="button"
          onclick={() => removeScenario(scenario.id)}
          disabled={scenarios.length <= 1}
        >
          Remove scenario
        </button>
      </div>

      <TimelineEditor bind:phases={scenario.phases} />
    </section>
  {/each}

  <button type="button" class="add-scenario" onclick={addScenario}>+ Add scenario</button>

  <MuscleChart {scenarios} />
</main>

<style>
  .scenario-card {
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
  }

  .scenario-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .add-scenario {
    display: block;
    margin: 1rem 0;
  }
</style>
