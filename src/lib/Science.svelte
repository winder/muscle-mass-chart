<script>
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';
  import { nonExerciserCurve, disabilityThreshold } from '../data/muscleModel.js';
  import { SEX_COLORS } from '../data/colors.js';

  // Decade-over-decade decline, read straight off the sedentary curves that
  // drive the chart above — so this table can never drift from the model.
  function decadeDeclines(curve) {
    const points = curve.points;
    const peak = points.reduce((best, p) => (p.value > best.value ? p : best));
    const valueAt = (age) => points.find((p) => p.age === age)?.value;
    const declines = [];
    for (let age = peak.age; valueAt(age + 10) != null; age += 10) {
      declines.push({ fromAge: age, toAge: age + 10, decline: valueAt(age) - valueAt(age + 10) });
    }
    return declines;
  }

  const maleDeclines = decadeDeclines(nonExerciserCurve.male);
  const femaleDeclines = decadeDeclines(nonExerciserCurve.female);
  const decadeCount = Math.min(maleDeclines.length, femaleDeclines.length);
  const decadeLabels = Array.from({ length: decadeCount }, (_, i) => `Decade ${i + 1}`);

  const CONTRIBUTING_FACTORS = [
    {
      lines: ['Physical', 'inactivity'],
      title: 'Disuse',
      body: 'Sedentary time removes the mechanical loading signal muscle needs to maintain itself, so mass is lost faster than aging alone would cause.',
    },
    {
      lines: ['Hormonal', 'decline'],
      title: 'Hormonal decline',
      body: 'Falling testosterone, estrogen, and growth-hormone/IGF-1 output with age reduces the background anabolic drive that keeps muscle protein turnover in balance.',
    },
    {
      lines: ['Anabolic', 'resistance'],
      title: 'Anabolic resistance',
      body: 'Older muscle needs a bigger protein or exercise stimulus to trigger the same amount of muscle-building. Unchanged diet and activity increasingly under-stimulate it.',
    },
    {
      lines: ['Nerve', 'signal loss'],
      title: 'Nerve signal loss',
      body: 'Motor neurons die off with age; the fast-twitch fibers they controlled are reinnervated by slower neurons or lost outright — the "dynapenia" Mitchell et al. (2012) describe.',
    },
    {
      lines: ['Chronic', 'inflammation'],
      title: 'Chronic inflammation & fat infiltration',
      body: 'Persistent low-grade inflammation and fat infiltrating the muscle itself both degrade tissue quality, not just quantity (Goodpaster et al., 2006).',
    },
  ];

  const DISABILITY_TASKS = [
    {
      task: 'Rising from a chair',
      muscles: 'Quadriceps, glutes',
      note: 'The clinical five-times chair-stand test — timing five sit-to-stands with no arm push — is one of EWGSOP2’s own physical-performance measures (Cruz-Jentoft et al., 2019).',
    },
    {
      task: 'Climbing a flight of stairs',
      muscles: 'Quadriceps, calves',
      note: 'Needs eccentric and concentric leg strength well above what level walking requires.',
    },
    {
      task: 'Carrying groceries, opening jars',
      muscles: 'Grip, forearm, shoulder',
      note: 'Grip strength is one of the screening measures for probable sarcopenia in EWGSOP2.',
    },
    {
      task: 'Catching yourself in a stumble',
      muscles: 'Whole-body, fast-twitch fibers',
      note: 'Fast-twitch fibers are lost disproportionately with age, slowing the reflex that stops a stumble from becoming a fall.',
    },
  ];

  let canvas;
  let chart;

  function buildDatasets() {
    return [
      {
        label: 'Male',
        data: maleDeclines.slice(0, decadeCount).map((d) => d.decline),
        backgroundColor: SEX_COLORS.male,
        borderRadius: 4,
        maxBarThickness: 28,
      },
      {
        label: 'Female',
        data: femaleDeclines.slice(0, decadeCount).map((d) => d.decline),
        backgroundColor: SEX_COLORS.female,
        borderRadius: 4,
        maxBarThickness: 28,
      },
    ];
  }

  onMount(() => {
    chart = new Chart(canvas, {
      type: 'bar',
      data: { labels: decadeLabels, datasets: buildDatasets() },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: 'Decades since sex-specific peak' },
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Points of peak lost that decade' },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              afterLabel(context) {
                const declines = context.datasetIndex === 0 ? maleDeclines : femaleDeclines;
                const d = declines[context.dataIndex];
                return d ? `Ages ${d.fromAge}–${d.toAge}` : '';
              },
            },
          },
        },
      },
    });
  });

  onDestroy(() => chart?.destroy());
</script>

<section class="science">
  <h2>The science behind the numbers</h2>

  <p>
    The age-related loss of muscle mass and strength has a clinical name:
    <strong>sarcopenia</strong>. It's no longer treated as an inevitable, purely
    cosmetic side effect of getting older — it has its own diagnostic
    criteria and its own ICD-10-CM billing code (M62.84), and it's
    independently linked to falls, fractures, longer hospital stays, and loss
    of independent living (Cruz-Jentoft et al., 2019).
  </p>

  <h3>What drives it</h3>
  <p>
    Sarcopenia isn't caused by one thing — several mechanisms compound with
    age, and inactivity is only the one this tool lets you control for.
  </p>

  <div class="diagram-wrap">
    <svg viewBox="0 0 440 340" role="img" aria-label="Diagram of five factors contributing to sarcopenia, radiating from a central node">
      <g class="spokes">
        <line x1="220" y1="170" x2="220" y2="50" />
        <line x1="220" y1="170" x2="334" y2="133" />
        <line x1="220" y1="170" x2="291" y2="267" />
        <line x1="220" y1="170" x2="149" y2="267" />
        <line x1="220" y1="170" x2="106" y2="133" />
      </g>

      <g class="hub">
        <circle cx="220" cy="170" r="60" />
        <text x="220" y="167" text-anchor="middle" class="hub-label">Sarcopenia</text>
        <text x="220" y="185" text-anchor="middle" class="hub-sublabel">(muscle loss)</text>
      </g>

      {#each [{ cx: 220, cy: 50 }, { cx: 334, cy: 133 }, { cx: 291, cy: 267 }, { cx: 149, cy: 267 }, { cx: 106, cy: 133 }] as pos, i}
        <g class="node">
          <circle cx={pos.cx} cy={pos.cy} r="42" />
          <text x={pos.cx} y={pos.cy - 4} text-anchor="middle" class="node-label">
            <tspan x={pos.cx} dy="0">{CONTRIBUTING_FACTORS[i].lines[0]}</tspan>
            <tspan x={pos.cx} dy="14">{CONTRIBUTING_FACTORS[i].lines[1]}</tspan>
          </text>
        </g>
      {/each}
    </svg>
  </div>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Factor</th>
          <th>What's happening</th>
        </tr>
      </thead>
      <tbody>
        {#each CONTRIBUTING_FACTORS as factor (factor.title)}
          <tr>
            <td class="factor-name">{factor.title}</td>
            <td>{factor.body}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <p class="fine-print">
    Hormonal decline and anabolic resistance are well established in the
    sarcopenia literature but aren't separately modeled as inputs here —
    this tool only lets you vary overall activity level.
  </p>

  <h3>How the rate of loss changes with age</h3>
  <p>
    Loss isn't linear — it accelerates. Reading the decline in ten-year
    chunks starting at each sex's own peak shows roughly a doubling in pace
    from the first post-peak decade to the last:
  </p>

  <div class="chart-wrap">
    <canvas bind:this={canvas}></canvas>
  </div>
  <p class="fine-print">
    Source: decline rates from Mitchell et al. (2012) and Goodpaster et al.
    (2006, Health ABC study); earlier female peak and steeper late-life
    decline from Silva et al. (2023).
  </p>

  <div class="stat-tile">
    <div class="stat-block">
      <span class="stat-value">13&ndash;24%</span>
      <span class="stat-label">of adults under 70</span>
    </div>
    <span class="stat-arrow" aria-hidden="true">&rarr;</span>
    <div class="stat-block">
      <span class="stat-value">50%+</span>
      <span class="stat-label">of adults over 80</span>
    </div>
    <p class="stat-caption">
      meet criteria for sarcopenia, in the cohort used to derive the original
      definition (Baumgartner et al., 1998).
    </p>
  </div>

  <h3>From percentages to daily life</h3>
  <p>
    The dashed disability threshold on the chart above sits at
    <strong>{disabilityThreshold.value}% of sedentary peak</strong> — an
    approximation of the clinical low-muscle-mass cutoffs used to diagnose
    sarcopenia (Baumgartner et al., 1998; EWGSOP2, Cruz-Jentoft et al., 2019;
    FNIH, Cawthon et al., 2014). Crossing it doesn't flip a switch; it marks
    the zone where everyday tasks that used to be automatic start requiring
    compensation, assistance from others, or become impossible outright —
    starting with the simplest ones, like standing up out of a chair without
    using your arms.
  </p>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Everyday task</th>
          <th>Mainly relies on</th>
          <th>Why sarcopenia threatens it</th>
        </tr>
      </thead>
      <tbody>
        {#each DISABILITY_TASKS as row (row.task)}
          <tr>
            <td class="factor-name">{row.task}</td>
            <td>{row.muscles}</td>
            <td>{row.note}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<style>
  .science {
    margin: 2rem 0 0;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
  }

  .science h2 {
    font-size: 1.4rem;
    margin: 0 0 0.75rem;
  }

  .science h3 {
    font-size: 1.1rem;
    margin: 1.75rem 0 0.5rem;
  }

  .science p {
    margin: 0.5rem 0;
    max-width: 68ch;
  }

  .fine-print {
    font-size: 0.8em;
    color: var(--text-muted);
    max-width: 68ch;
  }

  .diagram-wrap {
    max-width: 440px;
    margin: 1rem auto;
  }

  .diagram-wrap svg {
    width: 100%;
    height: auto;
    display: block;
  }

  .spokes line {
    stroke: var(--border);
    stroke-width: 2;
  }

  .hub circle {
    fill: var(--diagram-accent, #5b4b8a);
    stroke: none;
  }

  @media (prefers-color-scheme: dark) {
    .hub circle {
      fill: #8a72cf;
    }
  }

  .hub-label {
    fill: #fff;
    font-size: 16px;
    font-weight: 600;
  }

  .hub-sublabel {
    fill: #fff;
    font-size: 10px;
    opacity: 0.85;
  }

  .node circle {
    fill: var(--bg);
    stroke: var(--border);
    stroke-width: 2;
  }

  .node-label {
    fill: var(--text);
    font-size: 12px;
  }

  .table-wrap {
    overflow-x: auto;
    margin: 0.75rem 0;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    font-size: 0.92em;
  }

  @media (min-width: 560px) {
    table {
      min-width: 480px;
    }
  }

  th,
  td {
    text-align: left;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
  }

  th {
    color: var(--text-muted);
    font-weight: 600;
    font-size: 0.85em;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .factor-name {
    font-weight: 600;
  }

  .chart-wrap {
    position: relative;
    height: 260px;
    margin: 1rem 0;
  }

  .stat-tile {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin: 1rem 0;
  }

  .stat-block {
    display: flex;
    flex-direction: column;
  }

  .stat-value {
    font-size: 1.6rem;
    font-weight: 700;
    line-height: 1.1;
  }

  .stat-label {
    font-size: 0.8em;
    color: var(--text-muted);
  }

  .stat-arrow {
    font-size: 1.4rem;
    color: var(--text-muted);
  }

  .stat-caption {
    flex-basis: 100%;
    margin: 0.25rem 0 0;
    font-size: 0.85em;
    color: var(--text-muted);
  }

  @media (max-width: 480px) {
    .chart-wrap {
      height: 220px;
    }
  }
</style>
