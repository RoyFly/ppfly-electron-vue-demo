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
        // {
        //     path: '/report',
        //     name: 'report',
        //     component: require('@/components/Report').default
        // },
        {
            path: '*',
            redirect: '/home'
        }
    ]
})
