// Color palette for user-added scenarios — PRD.md §6 ("distinct colors").
// Reserves red (#c62828) and gray (#616161) for the fixed sedentary
// baseline and disability threshold lines drawn separately in
// MuscleChart.svelte, so scenario colors never collide with them.

const SCENARIO_COLORS = [
  '#2e7d32', // green
  '#1565c0', // blue
  '#f9a825', // amber
  '#6a1b9a', // purple
  '#00838f', // teal
  '#ad1457', // pink
];

export function colorForIndex(index) {
  return SCENARIO_COLORS[index % SCENARIO_COLORS.length];
}
