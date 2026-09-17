<script>
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';
  import { disabilityThreshold } from '../data/muscleModel.js';
  import { computeScenarioCurve } from '../data/computeCurve.js';
  import { AGE_MIN, AGE_MAX, createScenario } from '../data/scenario.js';

  let { scenario } = $props();

  const baselineScenario = createScenario({
    id: 'baseline',
    label: 'Sedentary baseline',
    phases: [{ startAge: AGE_MIN, endAge: AGE_MAX, activityType: 'sedentary' }],
  });

  let canvas;
  let chart;

  function toDataset(points, label, color, extra = {}) {
    return {
      label,
      data: points.map((p) => ({ x: p.age, y: p.value })),
      borderColor: color,
      backgroundColor: color,
      tension: 0.3,
      pointRadius: 0,
      ...extra,
    };
  }

  function buildDatasets() {
    return [
      toDataset(computeScenarioCurve(scenario), scenario.label, '#2e7d32'),
      toDataset(computeScenarioCurve(baselineScenario), baselineScenario.label, '#c62828'),
      {
        label: disabilityThreshold.label,
        data: [
          { x: AGE_MIN, y: disabilityThreshold.value },
          { x: AGE_MAX, y: disabilityThreshold.value },
        ],
        borderColor: '#616161',
        borderDash: [6, 4],
        pointRadius: 0,
        tension: 0,
      },
    ];
  }

  onMount(() => {
    chart = new Chart(canvas, {
      type: 'line',
      data: { datasets: buildDatasets() },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'linear',
            min: AGE_MIN,
            max: AGE_MAX,
            title: { display: true, text: 'Age' },
            ticks: { stepSize: 10 },
          },
          y: {
            min: 0,
            max: 110,
            title: { display: true, text: '% of Peak Muscle Mass' },
          },
        },
      },
    });
  });

  $effect(() => {
    // Re-read scenario so this effect reruns whenever its phases change.
    scenario;
    if (chart) {
      chart.data.datasets = buildDatasets();
      chart.update();
    }
  });

  onDestroy(() => {
    chart?.destroy();
  });
</script>

<div class="chart-wrap">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .chart-wrap {
    position: relative;
    height: 480px;
  }
</style>
