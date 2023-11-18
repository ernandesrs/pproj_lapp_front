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
        path: 'usuarios',
        children: [
          {
            path: '',
            name: 'dashboard.users',
            component: () => import('@/views/default/users/ListView.vue')
          },
          {
            path: 'criar',
            name: 'dashboard.users.create',
            component: () => import('@/views/default/users/FormView.vue')
          },
          {
            path: 'ver/:user_id',
            name: 'dashboard.users.show',
            component: () => import('@/views/default/users/ShowView.vue')
          },
          {
            path: 'editar/:user_id',
            name: 'dashboard.users.edit',
            component: () => import('@/views/default/users/FormView.vue')
          }
        ]
      },
      {
        path: 'funcoes',
        children: [
          {
            path: '',
            name: 'dashboard.roles',
            component: () => import('@/views/default/roles/ListView.vue')
          },
          {
            path: 'criar',
            name: 'dashboard.roles.create',
            component: () => import('@/views/default/roles/FormView.vue')
          },
          {
            path: 'ver/:role_id',
            name: 'dashboard.roles.show',
            component: () => import('@/views/default/roles/ShowView.vue')
          },
          {
            path: 'editar/:role_id',
            name: 'dashboard.roles.edit',
            component: () => import('@/views/default/roles/FormView.vue')
          }
        ]
      },
      {
        path: 'configuracoes',
        name: 'dashboard.settings',
        component: () => import('@/views/default/SettingsView.vue')
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
