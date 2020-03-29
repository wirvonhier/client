import Vue from 'vue';
import { App, router, attachHttp, attachDB, attachServices, attachI18n, attachWorker } from './ui';
import { store } from './store';
import { i18n } from './services';
import { vuetify } from './ui';

Vue.config.productionTip = false;

attachServices(store);
attachI18n(store);
attachDB(store);
attachHttp(store);
attachWorker(store);

new Vue({
  i18n,
  store,
  router,
  vuetify,
  render: (h): Vue.VNode => h(App),
}).$mount('#app');
