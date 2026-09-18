import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  // GitHub Pages serves project sites under /<repo>/; the deploy workflow
  // sets VITE_BASE from the repository name so a rename needs no code change.
  base: process.env.VITE_BASE ?? '/',
})
