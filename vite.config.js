import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // proxy: {
      // '/auth': 'http://localhost:8080',
      // '/usuarios': 'http://localhost:8080',
      // '/treino': 'http://localhost:8080',
      // '/dieta': 'http://localhost:8080',
      // '/dietas': {
      //   target: 'http://localhost:8080',
      //   rewrite: path => path.replace(/^\/dietas/, '/dieta'),
      //   changeOrigin: true,
      // },
    // },
    historyApiFallback: true
  },
})
