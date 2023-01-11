import '@/plugins/vue-composition-api'
import '@/styles/styles.scss'
import axios from 'axios'
import Vue from 'vue'
import { VueMaskDirective } from 'v-mask'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'

axios.defaults.baseURL = 'http://127.0.0.1:8000'

// axios.defaults.baseURL = 'http://10.10.0.35:8080/apiReintegro/public'
axios.defaults.headers.common.Authorization = `Bearer ${sessionStorage.getItem('tknReiFormunica')}`

Vue.config.productionTip = false
Vue.directive('mask', VueMaskDirective)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
