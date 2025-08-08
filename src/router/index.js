import { createRouter, createWebHistory } from 'vue-router'
import { useApiStore } from '@/stores/api'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/setup',
      name: 'setup',
      component: () => import('@/views/SetupView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const apiStore = useApiStore()
  
  if (to.meta.requiresAuth && !apiStore.hasApiKey) {
    next('/setup')
  } else if (to.name === 'setup' && apiStore.hasApiKey) {
    next('/')
  } else {
    next()
  }
})

export default router
