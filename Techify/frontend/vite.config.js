import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
    parserOptions: {
    ecmaFeatures: {
      jsx: true, // ✅ enable JSX
    },
  },
  plugins: [react()],
  server: {
    proxy : {
      "/api/" : "http://localhost:5000",
    }
  }
})
