import { createApp } from 'vue'
import App from './App.vue'
import Bus from "./utils/bus"
// import checkDebug from "./utils/checkDebug"


// if(import.meta.env.MODE==="production"){
//     checkDebug()
// }

const app = createApp(App);
app.config.globalProperties.$bus = Bus;
app.mount('#app')
