import './assets/scss/custom.scss'
import './assets/css/styles.css'
import 'leaflet/dist/leaflet.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'



createApp(App)
  .use(router)
  .mount('#app')
