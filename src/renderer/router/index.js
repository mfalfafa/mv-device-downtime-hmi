import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: require('@/components/login').default
    },
    {
      path: '/downtimepage',
      name: 'downtimepage',
      component: require('@/components/DowntimePage').default
    },
    {
      path: '/konfigurasi',
      name: 'konfigurasi',
      component: require('@/components/Konfigurasi').default
    }
  ]
})
