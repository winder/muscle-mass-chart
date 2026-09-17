<script>
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';
  import { exerciserCurve, nonExerciserCurve } from '../data/muscleModel.js';

  let canvas;
  let chart;

  function toDataset(curve, color) {
    return {
      label: curve.label,
      data: curve.points.map((p) => ({ x: p.age, y: p.value })),
      borderColor: color,
      backgroundColor: color,
      tension: 0.3,
      pointRadius: 0,
    };
  }

  onMount(() => {
    chart = new Chart(canvas, {
      type: 'line',
      data: {
        datasets: [
          toDataset(exerciserCurve, '#2e7d32'),
          toDataset(nonExerciserCurve, '#c62828'),
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'linear',
            min: 10,
            max: 90,
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
