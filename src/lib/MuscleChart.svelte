<script>
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';
  import { disabilityThreshold } from '../data/muscleModel.js';
  import { computeScenarioCurve } from '../data/computeCurve.js';
  import { AGE_MIN, AGE_MAX, createScenario } from '../data/scenario.js';
  import { colorForIndex } from '../data/colors.js';

  let { scenarios, showDisabilityThreshold = true } = $props();

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
    const datasets = [
      ...scenarios.map((scenario) =>
        toDataset(computeScenarioCurve(scenario), scenario.label, colorForIndex(scenario.colorIndex))
      ),
      toDataset(computeScenarioCurve(baselineScenario), baselineScenario.label, '#c62828'),
    ];
    if (showDisabilityThreshold) {
      datasets.push({
        label: disabilityThreshold.label,
        data: [
          { x: AGE_MIN, y: disabilityThreshold.value },
          { x: AGE_MAX, y: disabilityThreshold.value },
        ],
        borderColor: '#616161',
        borderDash: [6, 4],
        pointRadius: 0,
        tension: 0,
      });
    }
    return datasets;
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
            max: 140,
            title: { display: true, text: '% of Sedentary Reference Peak' },
          },
        },
      },
    });
  });

  $effect(() => {
    // Re-read scenarios and showDisabilityThreshold so this effect reruns
    // whenever either changes (a scenario edit, or the threshold toggle).
    scenarios;
    showDisabilityThreshold;
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

  @media (max-width: 480px) {
    .chart-wrap {
      height: 320px;
    }
  }
</style>
