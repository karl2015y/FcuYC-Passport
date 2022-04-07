import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import styleImport, { VantResolve } from 'vite-plugin-style-import';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({

    template: {
      // 添加以下内容
      compilerOptions: {
        isCustomElement: tag => tag === 'lottie-player'
      }
    }
  }),
  styleImport({
    resolves: [VantResolve()],
  })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0'
  }
})
