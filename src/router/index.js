import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import CsGoEmpireBots from '@/components/CsGoEmpireBots'
import CsGoEmpireBotEdit from '@/components/CsGoEmpireBotEdit'
import RollbitBots from '@/components/RollbitBots'
import RollbitBotEdit from '@/components/RollbitBotEdit'
import DuelbitsBots from '@/components/DuelbitsBots'
import DuelbitsBotEdit from '@/components/DuelbitsBotEdit'
import RollbitHistory from '@/components/RollbitHistory'
import Profit from '@/components/Profit'
import { authGuard } from "@/auth/authGuard";

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      beforeEnter: authGuard
    }, {
      path: '/CsGoEmpireBots',
      name: 'CsGoEmpireBots',
      component: CsGoEmpireBots,
      beforeEnter: authGuard
    }, {
      path: '/CsGoEmpireBotEdit',
      name: 'CsGoEmpireBotCreate',
      component: CsGoEmpireBotEdit,
      beforeEnter: authGuard
    }, {
      path: '/CsGoEmpireBotEdit/:botId',
      name: 'CsGoEmpireBotEdit',
      component: CsGoEmpireBotEdit,
      beforeEnter: authGuard
    }, {
      path: '/RollbitBots',
      name: 'RollbitBots',
      component: RollbitBots,
      beforeEnter: authGuard
    }, {
      path: '/RollbitBotEdit',
      name: 'RollbitBotCreate',
      component: RollbitBotEdit,
      beforeEnter: authGuard
    }, {
      path: '/RollbitBotEdit/:botId',
      name: 'RollbitBotEdit',
      component: RollbitBotEdit,
      beforeEnter: authGuard
    }, {
      path: '/DuelbitsBots',
      name: 'DuelbitsBots',
      component: DuelbitsBots,
      beforeEnter: authGuard
    }, {
      path: '/DuelbitsBotEdit',
      name: 'DuelbitsBotCreate',
      component: DuelbitsBotEdit,
      beforeEnter: authGuard
    }, {
      path: '/DuelbitsBotEdit/:botId',
      name: 'DuelbitsBotEdit',
      component: DuelbitsBotEdit,
      beforeEnter: authGuard
    }, {
      path: '/RollbitHistory',
      name: 'RollbitHistory',
      component: RollbitHistory,
      beforeEnter: authGuard
    }, {
      path: '/Profit',
      name: 'Profit',
      component: Profit,
      beforeEnter: authGuard
    }
  ]
})
