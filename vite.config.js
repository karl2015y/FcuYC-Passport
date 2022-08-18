import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';


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
  Components({
    resolvers: [VantResolver()],
  }),
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
