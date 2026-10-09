import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Pre GitHub Pages: VITE_BASE=/nazov-repozitara/ npm run build
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [vue()],
})
