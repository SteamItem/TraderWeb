import Vue from 'vue'
import Router from 'vue-router'
import Bot from '@/components/Bot'
import BotUser from '@/components/BotUser'
import Wishlist from '@/components/Wishlist'
import WishlistItem from '@/components/WishlistItem'
import Rollbit from '@/components/Rollbit'
import Profit from '@/components/Profit'
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
    }, {
      path: '/Wishlist',
      name: 'Wishlist',
      component: Wishlist,
      beforeEnter: authGuard
    }, {
      path: '/WishlistItem/:id',
      name: 'WishlistItem',
      component: WishlistItem,
      beforeEnter: authGuard
    }, {
      path: '/Bot/:id',
      name: 'Bot',
      component: Bot,
      beforeEnter: authGuard
    }, {
      path: '/BotUser/:id',
      name: 'BotUser',
      component: BotUser,
      beforeEnter: authGuard
    }, {
      path: '/Rollbit',
      name: 'Rollbit',
      component: Rollbit,
      beforeEnter: authGuard
    }, {
      path: '/Profit',
      name: 'Profit',
      component: Profit,
      beforeEnter: authGuard
    }
  ]
})
