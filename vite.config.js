import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import ViteComponents from 'vite-plugin-components'
import Layouts from 'vite-plugin-vue-layouts'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    // fs: {
    //   strict: false,
    // },
  },

  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },

  plugins: [vue(), Pages(), Layouts(), ViteComponents()],

  build: {
    target: ['chrome87', 'edge88', 'es2020'],
  },
})
