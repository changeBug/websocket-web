import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import Home from '../views/Home.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Register
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  if ((!userInfo || !userInfo.token) && to.name !== 'login' && to.name !== 'register') {
    router.replace('/login');
  }
  next();
})

export default router
