import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/home',
            name: 'home',
            component: require('@/components/Home').default
        },
        {
            path: '/index',
            name: 'index',
            component: require('@/components/Index').default
        },
        {
            path: '*',
            redirect: '/index'
        }
    ]
})
