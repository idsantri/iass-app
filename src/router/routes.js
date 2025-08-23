import MainLayout from '@/layouts/MainLayout.vue'
import HomeView from '@/pages/HomeView.vue'

export default [
  {
    path: '/',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/pages/LoginPage.vue'),
      },
      {
        path: 'logout',
        name: 'Logout',
        component: () => import('@/pages/LogoutPage.vue'),
      },
    ],
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
      },
      {
        path: '/about',
        name: 'about',
        meta: { title: 'About' },
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../pages/AboutView.vue'),
      },
    ],
  },
]
