<script>
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';

  let canvas;
  let chart;

  onMount(() => {
    chart = new Chart(canvas, {
      type: 'line',
      data: { datasets: [] },
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
