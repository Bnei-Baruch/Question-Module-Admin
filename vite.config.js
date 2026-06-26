import { defineConfig, transformWithOxc } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    {
      name: 'treat-js-files-as-jsx',
      enforce: 'pre',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/) || id.match(/node_modules/)) return null;
        return transformWithOxc(code, id, { lang: 'jsx' });
      },
    },
    react(),
  ],
  resolve: {
    alias: {
      actions:    path.resolve(__dirname, 'src/actions'),
      components: path.resolve(__dirname, 'src/components'),
      containers: path.resolve(__dirname, 'src/containers'),
      reducers:   path.resolve(__dirname, 'src/reducers'),
      store:      path.resolve(__dirname, 'src/store'),
      utils:      path.resolve(__dirname, 'src/utils'),
      config:     path.resolve(__dirname, 'src/config'),
      index:      path.resolve(__dirname, 'src/index.jsx'),
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': 'http://localhost:2200',
      '/socket.io': {
        target: 'http://localhost:2200',
        ws: true
      }
    }
  }
})
