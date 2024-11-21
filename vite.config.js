import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/stock-management-react/',
  plugins: [react()],
  optimizeDeps: {
    include: ['@mui/material', '@mui/x-date-pickers', '@emotion/react', '@emotion/styled'],
  },
});
