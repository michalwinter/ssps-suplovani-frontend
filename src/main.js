import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import store from './store'

Vue.config.productionTip = false

import "./assets/scss/main.scss";

new Vue({
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
