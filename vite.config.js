import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({

    template: {
      // 添加以下内容
      compilerOptions: {
        isCustomElement: tag => tag === 'lottie-player'
      }
    }
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
})
