import Vue from 'vue'
import Router from 'vue-router'
import Manage from '@/components/Manage'
import Rollbit from '@/components/Rollbit'
import { authGuard } from "@/auth/authGuard";

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Manage',
      component: Manage,
      beforeEnter: authGuard
    },
    {
      path: '/rollbit',
      name: 'Rollbit',
      component: Rollbit,
      beforeEnter: authGuard
    }
  ]
})
