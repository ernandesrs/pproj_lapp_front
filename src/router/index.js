// Composables
import middleware from '@/core/middleware'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/DefaultLayout.vue'),
    beforeEnter: [
      middleware.redirectIf.unauthenticated
    ],
    children: [
      {
        path: '',
        name: 'dashboard.home',
        component: () => import('@/views/default/HomeView.vue'),
      },
      {
        path: 'example-1',
        name: 'dashboard.exampleOne',
        component: () => import('@/views/default/ExampleOneView.vue'),
      },
      {
        path: 'example-2',
        name: 'dashboard.exampleTwo',
        component: () => import('@/views/default/ExampleTwoView.vue'),
      },
      {
        path: 'perfil',
        name: 'dashboard.profile',
        component: () => import('@/views/default/ProfileView.vue')
      }
    ],
  },

  // auth
  {
    path: '/auth',
    component: () => import('@/layouts/auth/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'auth.login',
        beforeEnter: [
          middleware.redirectIf.authenticated
        ],
        component: () => import('@/views/auth/LoginView.vue')
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
