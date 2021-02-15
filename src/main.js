import Vue from 'vue';
import VueGtm from 'vue-gtm';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import cognito from './plugins/cognito';
import apig from './plugins/apig';

Vue.use(VueGtm, {
  id: 'GTM-KCCFH42',
  enabled: true,
  debug: false,
  vueRouter: router,
});

Vue.prototype.$liff = window.liff;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  cognito,
  apig,
  render: (h) => h(App),
}).$mount('#app');
