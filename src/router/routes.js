import MainLayout from '@/layouts/MainLayout.vue';
import HomeView from '@/pages/HomeView.vue';

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
                path: 'anggota',
                meta: { title: 'Anggota' },
                component: () => import('../pages/anggota/AnggotaIndex.vue'),
            },
            {
                path: 'anggota/:id',
                meta: { title: 'Anggota' },
                component: () => import('../pages/anggota/AnggotaDetail.vue'),
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
            {
                path: 'settings',
                children: [
                    {
                        path: 'lists',
                        component: () => import('../pages/lists/ListsIndex.vue'),
                        meta: { title: 'Setting: List' },
                        children: [
                            {
                                path: ':listKey',
                                component: () => import('../pages/lists/ListsByKey.vue'),
                            },
                        ],
                    },
                ],
            },
        ],
    },
    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('@/pages/ErrorNotFound.vue'),
    },
];
