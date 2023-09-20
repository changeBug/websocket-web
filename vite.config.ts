import { fileURLToPath, URL } from 'node:url';
import path from 'path';

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'


// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
    return {
      esbuild: {
        // 去掉log与debug
        drop: ['console', 'debugger']
      },
      plugins: [
        vue(),
        vueJsx(),
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
          // '@': fileURLToPath(new URL('./src', import.meta.url))
        }
      },
      define: {
        __APP_ENV__: env.APP_ENV
      },
      base: './',
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
      },
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `@use "@/components/main.scss" as *;`
          }
        }
      }
    }
  }
)
