import { createApp } from 'vue'
import App from './App.vue'
import Bus from "./utils/bus"

const app = createApp(App);
app.config.globalProperties.$bus = Bus;
app.mount('#app')
