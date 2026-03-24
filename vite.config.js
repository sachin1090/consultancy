import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/consultancy/', 
  // No special prefix needed now because we are using standard VITE_
})