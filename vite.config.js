import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), cloudflare()],
  base: '/',
  build: {
    outDir: 'dist', // Ensure it goes to dist
    emptyOutDir: true, // Clears the folder before building
  }
})