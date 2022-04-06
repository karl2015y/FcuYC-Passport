import { createApp } from 'vue'
import App from './App.vue'


import "./tools/liff"


import { createPinia } from 'pinia'


const app = createApp(App)
app.use(createPinia())
app.mount('#app')
