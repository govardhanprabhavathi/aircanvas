import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/@mediapipe/hands/*',
          dest: 'mediapipe'
        }
      ]
    })
  ],
  server: {
    host: true,
    port: 5173
  },
  build: {
    target: 'esnext'
  }
});
