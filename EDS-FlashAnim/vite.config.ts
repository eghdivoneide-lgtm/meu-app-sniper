import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // Ignora a pasta server/ para evitar reloads quando o backend salva arquivos
      ignored: ['**/server/**', '**/node_modules/**'],
    },
  },
})

