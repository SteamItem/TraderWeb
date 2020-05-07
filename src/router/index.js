import Vue from 'vue'
import Router from 'vue-router'
import Wishlist from '@/components/Wishlist'
import { authGuard } from "@/auth/authGuard";

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Wishlist',
      component: Wishlist,
      beforeEnter: authGuard
    }
  ]
})
