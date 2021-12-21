import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);

import VueSocketIO  from 'vue-socket.io'

//引入socket.io配置连接
Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://127.0.0.1:9092',
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    },
    // options: { path: "/my-app/" } //Optional options
}));

//是否web程序
if (!process.env.IS_WEB){
    Vue.use(require('vue-electron'))
}
//axios
Vue.http = Vue.prototype.$http = axios;
//阻止显示生产模式的消息
Vue.config.productionTip = false;
//解决Electron Security Warning
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
