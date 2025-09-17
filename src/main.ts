import '@/assets/main.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from '@/App.vue'
import persistedState from 'pinia-plugin-persistedstate'

const app = createApp(App)
const pinia = createPinia();

pinia.use(persistedState);

app.use(pinia)
app.mount('#root')
