import Vue from 'vue'
import Router from 'vue-router'
import BotList from '@/components/BotList'
import BotEdit from '@/components/BotEdit'
import Wishlist from '@/components/Wishlist'
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
      name: 'Index',
      component: Wishlist,
      beforeEnter: authGuard
    }, {
      path: '/Wishlist',
      name: 'Wishlist',
      component: Wishlist,
      beforeEnter: authGuard
    }, {
      path: '/BotList/:id',
      name: 'BotList',
      component: BotList,
      beforeEnter: authGuard
    }, {
      path: '/BotEdit/:id',
      name: 'CreateBot',
      component: BotEdit,
      beforeEnter: authGuard
    }, {
      path: '/BotEdit/:id/botId',
      name: 'EditBot',
      component: BotEdit,
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
