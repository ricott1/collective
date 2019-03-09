import Vue from 'vue'
import Router from 'vue-router'
import Add from '@/components/Add'
import Home from '@/components/Home'
import Dashboard from '@/components/Dashboard'
import Profile from '@/components/sections/Profile.vue'
import ProfileForm from '@/components/sections/ProfileForm.vue'
import Web3Message from '@/components/sections/Web3Message.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Root',
      component: Home,
      // meta: { view: Web3Message }
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      // meta: { view: Web3Message }
    },
    {
      path: '/new-project',
      name: 'Add',
      component: Add,
      // meta: { view: Web3Message }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { view: Profile }
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: Home,
      meta: { view: ProfileForm }
    },
    {
      path: '/profile/edit',
      name: 'ProfileEdit',
      component: Dashboard,
      meta: { view: ProfileForm }
    }
  ]
})
