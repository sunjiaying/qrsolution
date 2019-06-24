import Vue from 'vue'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io';
// import socketio from 'socket.io-client';

Vue.use(new VueSocketIO({
  debug: false,
  connection: 'http://212.64.68.222:8000'
}));

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
