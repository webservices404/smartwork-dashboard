import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/smartwork-dashboard/', // <-- Add this exact line
  plugins: [react()],
})
