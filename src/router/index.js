import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './config'

Vue.use(VueRouter)



const router = new VueRouter({
  mode: process.env.NODE_ENV === 'production'
    ? 'hash'
    : 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
