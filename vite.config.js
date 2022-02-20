import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: './',
  server: {
    host: '0.0.0.0',
    open: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@p': path.resolve(__dirname, './public')
    },
  },
  plugins: [vue()],
  build:{
    rollupOptions:{
      output:{
        manualChunks:{
          "pixi": ['pixi.js'],
          "gsap":["gsap"]
        }
      }
    }
  }
})
