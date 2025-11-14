import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: true, // permite conexiones externas
    allowedHosts: [
      '3qk7pq-ip-181-117-9-224.tunnelmole.net' // <- el dominio que te mostró Tunnelmole
    ]
  }
})
