import { createApp } from 'vue'
import App from './App.vue'

import VConsole from 'vconsole';
const vConsole = new VConsole();



const app = createApp(App)


import { createPinia } from 'pinia'
app.use(createPinia())

import { router } from './tools/router'
app.use(router)


app.mount('#app')
