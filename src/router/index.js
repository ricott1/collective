import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import List from '@/components/List'
import Dashboard from '@/components/Dashboard'
import Profile from '@/components/sections/Profile.vue'
import ProfileForm from '@/components/sections/ProfileForm.vue'
import Web3Message from '@/components/sections/Web3Message.vue'
import Add from '@/components/Add'

Vue.use(Router)

export default new Router({
  routes: [
    {
      mode: 'history',
      path: '/',
      name: 'Root',
      component: Home,
      meta: { view: Web3Message }
    },
    {
      mode: 'history',
      path: '/projects',
      name: 'Home',
      component: List,
      meta: { view: Web3Message }
    },
    {
      path: '/new-project',
      name: 'Add',
      component: Add,
      // meta: { view: Web3Message }
    },
    {
      mode: 'history',
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { view: Profile }
    },
    {
      mode: 'history',
      path: '/sign-up',
      name: 'SignUp',
      component: Home,
      meta: { view: ProfileForm }
    },
    {
      mode: 'history',
      path: '/profile/edit',
      name: 'ProfileEdit',
      component: Dashboard,
      meta: { view: ProfileForm }
    }
  ]
})
