
import { createApp } from 'vue'

import App from './App.vue'
//import { $vfm } from 'vue-final-modal'
import { store } from './store/store'

require('./assets/site.css')

const app = createApp(App)
app.use(store)
//app.use($vfm)

app.mount('#app')
