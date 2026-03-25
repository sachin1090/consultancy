import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // Added "plugin-" here

export default defineConfig({
  plugins: [react()],
  // If you are deploying to a subfolder like /consultancy/, keep this. 
  // If it's the main domain, use '/'
  base: '/', 
})