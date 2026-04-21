import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '127.0.0.1', //Força o Vite a usar o IP local, evitando problemas de rede em alguns ambientes
    port: 5173, // Porta padrão do Vite
  }
})