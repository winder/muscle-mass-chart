<script>
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';
  import { nonExerciserCurve, disabilityThreshold } from '../data/muscleModel.js';
  import { SEX_COLORS } from '../data/colors.js';
  import { CITATION_URLS } from '../data/citations.js';

  let activeFactor = $state(0);

  // Age-decade buckets, not "decades since peak" — 20s/30s straddle each
  // sex's peak, so those two are clamped to only the post-peak portion
  // (the "fudge": we show the max loss after peak, not the net change
  // across a decade that's partly still muscle growth).
  const DECADE_STARTS = [20, 30, 40, 50, 60, 70, 80];
  const DECADE_LABELS = DECADE_STARTS.map((start) => `${start}s`);

  function decadeDeclines(curve) {
    const points = curve.points;
    const peak = points.reduce((best, p) => (p.value > best.value ? p : best));
    const valueAt = (age) => points.find((p) => p.age === age)?.value;
    return DECADE_STARTS.map((start) => {
      const end = start + 10;
      if (peak.age >= end) return 0;
      const from = Math.max(peak.age, start);
      return valueAt(from) - valueAt(end);
    });
  }

  const maleDeclines = decadeDeclines(nonExerciserCurve.male);
  const femaleDeclines = decadeDeclines(nonExerciserCurve.female);

  const NODE_POSITIONS = [
    { cx: 220, cy: 50 },
    { cx: 334, cy: 133 },
    { cx: 291, cy: 267 },
    { cx: 149, cy: 267 },
    { cx: 106, cy: 133 },
  ];

  const CONTRIBUTING_FACTORS = [
    {
      lines: ['Physical', 'inactivity'],
      title: 'Physical inactivity',
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
      body: `Motor neurons die off with age; the fast-twitch fibers they controlled are reinnervated by slower neurons or lost outright — the "dynapenia" <a href="${CITATION_URLS.mitchell2012}" target="_blank" rel="noopener noreferrer">Mitchell et al. (2012)</a> describe.`,
    },
    {
      lines: ['Chronic', 'inflammation'],
      title: 'Chronic inflammation',
      body: `Persistent low-grade inflammation and fat infiltrating the muscle itself both degrade tissue quality, not just quantity (<a href="${CITATION_URLS.goodpaster2006}" target="_blank" rel="noopener noreferrer">Goodpaster et al., 2006</a>).`,
    },
  ];

  const BONE_ACTIVITY_EFFECTS = [
    {
      activity: 'High-intensity strength + impact training',
      effect: `Meaningful bone gains are possible even with existing low bone mass: +2.9% lumbar spine BMD over 8 months, vs −1.2% in a low-intensity control group (<a href="${CITATION_URLS.watson2018}" target="_blank" rel="noopener noreferrer">Watson et al., 2018</a>).`,
    },
    {
      activity: 'Weight-bearing cardio (walking, running)',
      effect: `Repeated impact loading stimulates bone formation; competitive runners had spinal osteopenia at roughly a third the rate of competitive cyclists of similar fitness (<a href="${CITATION_URLS.rector2008}" target="_blank" rel="noopener noreferrer">Rector et al., 2008</a>).`,
    },
    {
      activity: 'Non-weight-bearing cardio (cycling, swimming)',
      effect: 'Little to no bone benefit despite excellent cardiovascular fitness — same comparison as above.',
    },
  ];

  const DISABILITY_TASKS = [
    {
      task: 'Rising from a chair',
      muscles: 'Quadriceps, glutes',
      note: `The clinical five-times chair-stand test — timing five sit-to-stands with no arm push — is one of <a href="${CITATION_URLS.cruzJentoft2019}" target="_blank" rel="noopener noreferrer">EWGSOP2</a>’s own physical-performance measures (<a href="${CITATION_URLS.cruzJentoft2019}" target="_blank" rel="noopener noreferrer">Cruz-Jentoft et al., 2019</a>).`,
    },
    {
      task: 'Climbing a flight of stairs',
      muscles: 'Quadriceps, calves',
      note: 'Needs eccentric and concentric leg strength well above what level walking requires.',
    },
    {
      task: 'Carrying groceries, opening jars',
      muscles: 'Grip, forearm, shoulder',
      note: `Grip strength is one of the screening measures for probable sarcopenia in <a href="${CITATION_URLS.cruzJentoft2019}" target="_blank" rel="noopener noreferrer">EWGSOP2</a>.`,
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
        data: maleDeclines,
        backgroundColor: SEX_COLORS.male,
        borderRadius: 4,
        maxBarThickness: 28,
      },
      {
        label: 'Female',
        data: femaleDeclines,
        backgroundColor: SEX_COLORS.female,
        borderRadius: 4,
        maxBarThickness: 28,
      },
    ];
  }

  onMount(() => {
    chart = new Chart(canvas, {
      type: 'bar',
      data: { labels: DECADE_LABELS, datasets: buildDatasets() },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: 'Age' },
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: 'typical % muscle loss' },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.y}%`,
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
    <strong>sarcopenia</strong>
    (<a href={CITATION_URLS.sarcopeniaWikipedia} target="_blank" rel="noopener noreferrer">wikipedia</a>).
    It's no longer treated as an inevitable, purely cosmetic side effect of
    getting older — it has its own diagnostic criteria and its own ICD-10-CM
    billing code
    (<a href={CITATION_URLS.icd10M6284} target="_blank" rel="noopener noreferrer">M62.84</a>),
    and it's independently linked to falls, fractures, longer hospital
    stays, and loss of independent living (<a href={CITATION_URLS.cruzJentoft2019} target="_blank" rel="noopener noreferrer">Cruz-Jentoft et al., 2019</a>).
  </p>

  <h3>What drives it</h3>
  <p>
    Sarcopenia isn't caused by one thing — several mechanisms compound with
    age, and inactivity is only the one this tool lets you control for.
    Click a factor below to see what's happening.
  </p>

  <div class="factor-picker">
    <div class="diagram-wrap">
      <svg
        viewBox="0 0 440 340"
        role="img"
        aria-label="Diagram of five factors contributing to sarcopenia, radiating from a central node. Select one to read what's happening."
      >
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

        {#each NODE_POSITIONS as pos, i (CONTRIBUTING_FACTORS[i].title)}
          <g
            class="node"
            class:active={activeFactor === i}
            role="button"
            tabindex="0"
            aria-pressed={activeFactor === i}
            aria-label={`Show what's happening: ${CONTRIBUTING_FACTORS[i].title}`}
            onclick={() => (activeFactor = i)}
            onkeydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activeFactor = i;
              }
            }}
          >
            <circle cx={pos.cx} cy={pos.cy} r="42" />
            <text x={pos.cx} y={pos.cy - 4} text-anchor="middle" class="node-label">
              <tspan x={pos.cx} dy="0">{CONTRIBUTING_FACTORS[i].lines[0]}</tspan>
              <tspan x={pos.cx} dy="14">{CONTRIBUTING_FACTORS[i].lines[1]}</tspan>
            </text>
          </g>
        {/each}
      </svg>
    </div>

    <div class="factor-detail">
      <h4>{CONTRIBUTING_FACTORS[activeFactor].title}</h4>
      <p>{@html CONTRIBUTING_FACTORS[activeFactor].body}</p>
    </div>
  </div>

  <p class="fine-print">
    Hormonal decline and anabolic resistance are well established in the
    sarcopenia literature but aren't separately modeled as inputs here —
    this tool only lets you vary overall activity level.
  </p>

  <h3>How the rate of loss changes with age</h3>
  <p>
    Loss isn't linear — it accelerates with age, and it starts earlier for
    women than men. Bars are grouped by decade of life; for the 20s and 30s,
    only the decline <em>after</em> each sex's own peak counts (age 25 for
    women, 30 for men) — before that, muscle is still increasing.
  </p>

  <div class="chart-wrap">
    <canvas bind:this={canvas}></canvas>
  </div>
  <p class="fine-print">
    Source: decline rates from
    <a href={CITATION_URLS.mitchell2012} target="_blank" rel="noopener noreferrer">Mitchell et al. (2012)</a>
    and
    <a href={CITATION_URLS.goodpaster2006} target="_blank" rel="noopener noreferrer">Goodpaster et al. (2006, Health ABC study)</a>;
    earlier female peak and steeper late-life decline from
    <a href={CITATION_URLS.silva2023} target="_blank" rel="noopener noreferrer">Silva et al. (2023)</a>.
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
      definition (<a href={CITATION_URLS.baumgartner1998} target="_blank" rel="noopener noreferrer">Baumgartner et al., 1998</a>).
    </p>
  </div>

  <h3>From percentages to daily life</h3>
  <p>
    The dashed disability threshold on the chart above (shown from age
    {disabilityThreshold.minAge} onward, since the cutoffs behind it are
    defined against a young-<em>adult</em> reference population — before
    that, a low number just means still growing, not declining) sits at
    <strong>{disabilityThreshold.value}% of sedentary peak</strong> — an
    approximation of the clinical low-muscle-mass cutoffs used to diagnose
    sarcopenia (<a href={CITATION_URLS.baumgartner1998} target="_blank" rel="noopener noreferrer">Baumgartner et al., 1998</a>;
    <a href={CITATION_URLS.cruzJentoft2019} target="_blank" rel="noopener noreferrer">EWGSOP2</a>,
    <a href={CITATION_URLS.cruzJentoft2019} target="_blank" rel="noopener noreferrer">Cruz-Jentoft et al., 2019</a>;
    <a href={CITATION_URLS.fnihProject} target="_blank" rel="noopener noreferrer">FNIH</a>,
    <a href={CITATION_URLS.cawthon2014} target="_blank" rel="noopener noreferrer">Cawthon et al., 2014</a>).
    Crossing it doesn't flip a switch; it marks the zone where everyday
    tasks that used to be automatic start requiring compensation, assistance
    from others, or become impossible outright — starting with the simplest
    ones, like standing up out of a chair without using your arms.
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
            <td>{@html row.note}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h3>Other contributing factors</h3>
  <p>
    Strength training and weight-bearing cardio don't just protect
    muscle — they're also among the best tools against
    <strong>osteoporosis</strong>
    (<a href={CITATION_URLS.osteoporosisWikipedia} target="_blank" rel="noopener noreferrer">wikipedia</a>),
    a bone-thinning condition that often runs alongside sarcopenia. Bone
    loss can even outpace muscle loss at the same age: postmenopausal
    women lose bone at roughly 1.9% a year in the years right after
    menopause (<a href={CITATION_URLS.riggs2003} target="_blank" rel="noopener noreferrer">Riggs et al., 2003</a>)
    — around 10% in just five years.
  </p>

  <div class="stat-tile">
    <div class="stat-block">
      <span class="stat-value">19.6%</span>
      <span class="stat-label">of women 50+</span>
    </div>
    <span class="stat-arrow" aria-hidden="true">&rarr;</span>
    <div class="stat-block">
      <span class="stat-value">27.1%</span>
      <span class="stat-label">of women 65+</span>
    </div>
    <p class="stat-caption">
      have osteoporosis by DXA scan — and counting low bone mass too,
      over 80% of women 65+ have one or the other
      (<a href={CITATION_URLS.sarafrazi2021} target="_blank" rel="noopener noreferrer">Sarafrazi Isfahani et al., 2021</a>).
    </p>
  </div>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Activity type</th>
          <th>Effect on bone density</th>
        </tr>
      </thead>
      <tbody>
        {#each BONE_ACTIVITY_EFFECTS as row (row.activity)}
          <tr>
            <td class="factor-name">{row.activity}</td>
            <td>{@html row.effect}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <p>
    The two conditions compound each other more than simple addition would
    suggest: one postmenopausal cohort found the odds of a fragility
    fracture were 2.5&times; with osteoporosis alone, 1.9&times; with
    sarcopenia alone, and 3.7&times; with both together —
    "osteosarcopenia" —
    (<a href={CITATION_URLS.lin2021} target="_blank" rel="noopener noreferrer">Lin et al., 2021</a>).
    Muscle and bone protection are complementary benefits of the same
    activity, not two separate reasons to exercise.
  </p>

  <p class="fine-print">
    Bone density isn't modeled by this tool's calculator; it's included
    here as context for why strength training and weight-bearing cardio
    are recommended beyond their effect on the muscle-mass curve above.
  </p>
</section>

<style>
  .science {
    container-type: inline-size;
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

  .science :global(a) {
    color: inherit;
    text-decoration: underline;
    text-decoration-color: var(--text-muted);
    text-underline-offset: 2px;
  }

  .science :global(a:hover),
  .science :global(a:focus-visible) {
    text-decoration-color: currentColor;
  }

  .fine-print {
    font-size: 0.8em;
    color: var(--text-muted);
    max-width: 68ch;
  }

  .factor-picker {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin: 1rem 0;
  }

  @container (min-width: 620px) {
    .factor-picker {
      flex-direction: row;
      align-items: stretch;
    }

    .factor-picker .diagram-wrap {
      flex: 0 0 300px;
      max-width: 300px;
      margin: 0;
    }

    .factor-picker .factor-detail {
      flex: 1 1 260px;
    }
  }

  .diagram-wrap {
    --diagram-accent: #5b4b8a;
    max-width: 440px;
    margin: 0 auto;
  }

  @media (prefers-color-scheme: dark) {
    .diagram-wrap {
      --diagram-accent: #8a72cf;
    }
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
    fill: var(--diagram-accent);
    stroke: none;
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

  .node {
    cursor: pointer;
    outline: none;
  }

  .node circle {
    fill: var(--bg);
    stroke: var(--border);
    stroke-width: 2;
    transition: fill 0.15s ease, stroke 0.15s ease;
  }

  .node:hover circle {
    stroke: var(--diagram-accent);
  }

  .node:focus-visible circle {
    stroke: var(--diagram-accent);
    stroke-width: 3;
  }

  .node.active circle {
    fill: var(--diagram-accent);
    stroke: var(--diagram-accent);
  }

  .node-label {
    fill: var(--text);
    font-size: 12px;
  }

  .node.active .node-label {
    fill: #fff;
  }

  .factor-detail {
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    min-height: 110px;
    box-sizing: border-box;
  }

  .factor-detail h4 {
    margin: 0 0 0.4rem;
    font-size: 1rem;
  }

  .factor-detail p {
    margin: 0;
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
