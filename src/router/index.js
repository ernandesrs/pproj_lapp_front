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
            beforeEnter: [
              middleware.authorize.listAccess
            ],
            component: () => import('@/views/default/users/ListView.vue')
          },
          {
            path: '/administradores',
            name: 'dashboard.users.admins',
            beforeEnter: [
              middleware.authorize.listAccess
            ],
            component: () => import('@/views/default/users/AdminsView.vue')
          },
          {
            path: 'criar',
            name: 'dashboard.users.create',
            beforeEnter: [
              middleware.authorize.createAccess
            ],
            component: () => import('@/views/default/users/FormView.vue')
          },
          {
            path: 'ver/:user_id',
            name: 'dashboard.users.show',
            beforeEnter: [
              middleware.authorize.showAccess
            ],
            component: () => import('@/views/default/users/ShowView.vue')
          },
          {
            path: 'editar/:user_id',
            name: 'dashboard.users.edit',
            beforeEnter: [
              middleware.authorize.editAccess
            ],
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
            beforeEnter: [
              middleware.authorize.listAccess
            ],
            component: () => import('@/views/default/roles/ListView.vue')
          },
          {
            path: 'criar',
            name: 'dashboard.roles.create',
            beforeEnter: [
              middleware.authorize.createAccess
            ],
            component: () => import('@/views/default/roles/FormView.vue')
          },
          {
            path: 'ver/:role_id',
            name: 'dashboard.roles.show',
            beforeEnter: [
              middleware.authorize.showAccess
            ],
            component: () => import('@/views/default/roles/ShowView.vue')
          },
          {
            path: 'editar/:role_id',
            name: 'dashboard.roles.edit',
            beforeEnter: [
              middleware.authorize.editAccess
            ],
            component: () => import('@/views/default/roles/FormView.vue')
          }
        ]
      },
      {
        path: 'configuracoes',
        children: [
          {
            path: 'configuracoes-local',
            name: 'dashboard.settings.local',
            component: () => import('@/views/default/LocalSettingsView.vue')
          },
          {
            path: 'configuracoes-sistema',
            name: 'dashboard.settings.system',
            component: () => import('@/views/default/AppSettingsView.vue')
          }
        ]
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
      },
      {
        path: 'forget',
        name: 'auth.forget',
        beforeEnter: [
          middleware.redirectIf.authenticated
        ],
        component: () => import('@/views/auth/ForgetView.vue')
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
