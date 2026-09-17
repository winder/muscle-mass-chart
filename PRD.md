# Muscle Mass vs. Age Calculator — PRD

## 1. Overview

A single-page web app that visualizes expected skeletal muscle mass across
the human lifespan (ages 10–90), letting users compare multiple scenarios
built from activity history (strength training, cardio, walking) against
each other and against a sedentary baseline. The motivating reference is
the classic "exercisers vs. non-exercisers" sarcopenia chart (Northern
Michigan Sports Medicine Center), extended here to let a user construct
their *own* activity timeline instead of picking one of two fixed lines.

Primary use case: "If I start strength training at 50, having been
sedentary before that, how much of the expected muscle loss can I reverse
or avoid, compared to someone who trained their whole life, or someone who
never trains at all?"

## 2. Goals

- Plot one or more muscle-mass-vs-age curves on a single chart, each
  derived from a user-editable activity timeline.
- Let users start from a named preset (fitness background) and then
  customize it.
- Make the underlying model swappable: ship with rough approximations,
  but structure the data layer so a future formal-research pass can
  replace the constants with cited values without changing the app
  architecture.
- Ship as a free, publicly shareable static web tool.

## 3. Non-Goals (V1)

- Absolute muscle mass in kg/lbs (see §5.2 — deferred).
- Lean body mass as a metric (see §5.2 — deferred, UI slot only).
- Compound/stacked activities within a single phase (e.g., strength +
  cardio + walking concurrently) — V1 is one activity type per phase.
  The data model must not preclude adding this later.
- User accounts, saved/shareable links, data persistence, analytics.
- Backend of any kind. This is a static, client-only app.
- Clinically validated predictions. This is an educational approximation
  tool, not a medical device — see §9 (Disclaimer).

## 4. Users

- **Primary (V1 driver)**: the author, exploring "what if I start X at
  age Y" questions for personal interest.
- **Secondary (post-launch)**: general public using it as a free,
  informal calculator/motivational tool. No sign-up, no data collection.

## 5. Core Concepts & Data Model

### 5.1 Scenario

A **Scenario** is one line on the chart. The user can add or remove
scenarios freely (not a fixed "baseline + 1" — full side-by-side
comparison of any number of scenarios).

```
Scenario {
  id
  label                 // e.g. "Started lifting at 50"
  sex: "male" | "female"
  phases: Phase[]       // ordered, contiguous, covering age 10–90
  colorIndex
}
```

### 5.2 Metric (Y-axis)

A scenario-independent, chart-wide setting:

```
Metric = "percentOfPeak" | "leanBodyMass"   // V1: only "percentOfPeak" enabled
```

- `percentOfPeak`: muscle mass expressed as % of the **sedentary/untrained
  reference peak** (typically reached mid-20s to 30) — not each scenario's
  own peak. This is a deliberate correction from an earlier draft: defining
  it as "% of one's own peak" makes every scenario hit exactly 100 at its
  own peak by construction, which makes it impossible to show that an
  active person can reach a *higher* peak than a sedentary one — the whole
  premise of the tool. With a single shared reference (the sedentary
  curve), 100 means "sedentary peak," and a trained scenario's curve can
  and should rise above 100. Chosen for V1 (over absolute kg) because
  relative decline/gain rates are much better supported by available
  research than absolute kg trajectories per activity type, and it
  normalizes across body sizes.
- `leanBodyMass`: absolute lean body mass in kg/lbs. **UI selector shows
  this option but disables it with a "coming soon" label** — deferred
  because it requires a materially different research base (needs
  population baseline mass distributions, not just relative rates).

### 5.3 Phase

A **Phase** is a contiguous age range within a scenario with one
activity assignment.

```
Phase {
  startAge
  endAge
  activityType: "sedentary" | "strengthTraining" | "cardio" | "walking"
  intensity: "low" | "moderate" | "high"   // ignored/omitted when sedentary
  cardioZone?: "zone1_2" | "zone3" | "zone4_5"  // only when activityType === "cardio"
}
```

Phases within a scenario are contiguous and cover the full 10–90 range
(no gaps). Editing a phase boundary adjusts the adjacent phase
automatically.

**Forward-compat note**: `Phase` currently holds a single activity. When
compound activities are added later, this becomes
`activities: Activity[]` per phase instead of a single
`activityType`/`intensity` pair. Keep phase-level concerns (age range)
and activity-level concerns (type, intensity, effect) in separate
structures now so that change is additive, not a rewrite.

### 5.4 Fitness Background Presets

Presets are **timeline generators**, not stored state — selecting one
populates `phases` with a default timeline, which the user can then
freely edit (add/split/remove phases, change ages, change activity).

| Preset | Default timeline shape |
|---|---|
| Sedentary / never trained | `sedentary` for the entire 10–90 range |
| Previously active, now detrained | `moderate` strength training or cardio from ~18–35, `sedentary` from 35–90 |
| Recreationally active | Low/moderate mixed activity (walking + occasional cardio) continuously from ~18–90, never structured strength training |
| Lifelong structured trainer | `moderate`–`high` strength training continuously from ~18–90 |

Exact default ages/intensities are placeholders until Milestone 5
(research pass); see §7.

### 5.5 Disability Threshold

A single global, toggleable horizontal reference line on the chart,
representing an approximate muscle-mass threshold below which
age-related functional disability risk rises sharply (per the source
chart's concept). Value is a rough approximation in V1, refined in the
research pass.

### 5.6 Sex

Per-scenario toggle: `male` | `female`. Both fully modeled in V1 (not
deferred like lean body mass) — the literature this tool draws on
typically already reports sarcopenia/training-response rates split by
sex, so there's little extra cost to supporting both from the start.

## 6. Chart Requirements

- X-axis: age, fixed range 10–90.
- Y-axis: current `Metric` (V1: % of peak muscle mass).
- One line per `Scenario`, distinct colors, legend with scenario labels.
- Optional horizontal dashed line for the disability threshold, toggle
  in the UI.
- Smooth curve through phase-derived data points (not sharp linear
  segments at every age) — the underlying model still evaluates
  discretely per phase, but rendering should read like the reference
  image's continuous curves.
- Chart library: Chart.js.

## 7. Research Approach

- **V1**: reasonable approximations from general exercise-science
  knowledge, no formal citations. All model constants (decline rates,
  training-response gain rates by preset/intensity/age-at-start,
  disability threshold value) live in a single isolated data module
  (e.g. `src/data/muscleModel.js`), not scattered through UI code.
- Each constant in that module carries a `source: null` placeholder
  field from the start, so the future research pass is a data-only
  change: replace values and fill in `source` with a citation, no
  structural refactor.
- **Future (post-V1, Milestone 5)**: run a formal research pass (e.g.
  via a dedicated research task) to replace placeholder constants with
  values grounded in cited meta-analyses / studies on:
  - age-related sarcopenia decline rates by sex
  - resistance-training-induced muscle mass response by age-at-start
    and training-history (untrained-starting-late vs. lifelong trainer
    show materially different response curves)
  - cardio/walking's comparatively smaller but non-zero effect on
    muscle mass retention
  - approximate disability-threshold muscle mass levels

## 8. Technical Approach

- **Stack**: Svelte + Vite, Chart.js for rendering. No backend, no
  server-side state — fully static.
- **Hosting**: static hosting (GitHub Pages or Vercel); exact provider
  is an implementation detail to pick during setup, not fixed here.
- **Repo**: currently not a git repo — `git init` is part of Milestone 1
  setup, since `bd` (the issue tracker used to run this roadmap) needs
  a git-backed workspace.

## 9. Disclaimer

Since this is a publicly shared health-adjacent tool, the UI must
include a persistent disclaimer along the lines of: *"This is an
educational approximation based on general research trends, not
medical advice or a clinical prediction tool. Individual results vary
significantly."* Non-optional — always present, not something a user
can dismiss. Placement: below the chart, styled quietly (muted text,
no colored callout box) rather than as a prominent banner — it should
read as boilerplate, not as an alarming warning.

## 10. Milestone Roadmap

Each milestone should be small enough to hand to an agent in
incremental steps. This section is the source for the `bd` issue set to
be created when implementation starts (not created yet).

### M1 — Static baseline chart
- [ ] `git init`; scaffold Svelte + Vite project
- [ ] Add Chart.js, render an empty chart with fixed X (10–90) / Y axes
- [ ] Create `src/data/muscleModel.js` with hardcoded placeholder curves
      for exactly two lines: "exerciser" and "non-exerciser" (mirroring
      the reference image), each with a `source: null` field
- [ ] Render those two static lines on the chart, no interactivity yet
- [ ] Add the disability threshold as a hardcoded horizontal line
      (toggle deferred to M4)

### M2 — Presets & timeline editing
- [ ] Define `Phase` and `Scenario` data structures per §5.1/§5.3
- [ ] Implement the 4 fitness-background presets (§5.4) as timeline
      generators
- [ ] Build a phase-timeline editor UI (add/split/remove phase, edit
      start/end age, activity type, intensity)
- [ ] Wire preset selection → populates an editable scenario timeline
- [ ] Replace M1's hardcoded curves with computed curves derived from a
      scenario's phases

### M3 — Toggles & multi-scenario comparison
- [ ] Add/remove scenario controls (start from any preset per scenario)
- [ ] Per-scenario sex toggle (male/female), both fully modeled
- [ ] Global metric selector: "% of peak" (active) / "Lean body mass"
      (visibly present, disabled, "coming soon")
- [ ] Multi-line rendering with legend, distinct colors per scenario
- [ ] Cardio zone sub-selector when activity type is "cardio"

### M4 — Disability threshold toggle & polish
- [ ] Make the disability threshold line user-toggleable
- [ ] Add the required disclaimer (§9) as a persistent UI element
- [ ] Responsive/mobile layout pass
- [ ] Basic empty/edge-case handling (e.g. zero scenarios, single-age
      phases)

### M5 — Research-grounded data
- [ ] Run formal research pass per §7, producing a cited research
      document
- [ ] Replace placeholder constants in `muscleModel.js` with sourced
      values; fill in `source` fields
- [ ] Surface citations in-app (e.g. an "about the model" panel)

## 11. Open Risks / Assumptions

- Curve smoothing between discrete phase segments needs a concrete
  interpolation approach — deferred to M2 implementation detail, not
  specified here.
- Default preset ages/intensities in §5.4 are illustrative placeholders
  until M5's research pass.
- Lean body mass metric and compound per-phase activities are
  explicitly out of scope for V1 but the data model (§5.3, §5.6 forward
  note) is designed to accommodate both later.
