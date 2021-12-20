import Vue from 'vue';

/*全局变量*/
let GLOBAL_VARIABLE = {
    // winURL: 'http://localhost:8090',
    baseAPI: 'http://127.0.0.1/itsms',
    wsurl:'ws://127.0.0.1/websocket' //Websorket本地地址
}
top.window.GLOBAL_VARIABLE = GLOBAL_VARIABLE;
Vue.prototype.$global = GLOBAL_VARIABLE;
export default GLOBAL_VARIABLE