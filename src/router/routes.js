import MainLayout from '@/layouts/MainLayout.vue';
import HomeView from '@/pages/HomeView.vue';

export default [
    {
        path: '/',
        children: [
            {
                path: 'login',
                name: 'Login',
                component: () => import('@/pages/auth/LoginPage.vue'),
            },
            {
                path: 'logout',
                name: 'Logout',
                component: () => import('@/pages/auth/LogoutPage.vue'),
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
                path: 'nks',
                component: () => import('@/pages/nks/NksIndex.vue'),
                meta: { title: 'NKS' },
            },
            {
                path: 'nks/:id',
                component: () => import('@/pages/nks/NksDetail.vue'),
                meta: { title: 'NKS' },
            },
            {
                path: 'nks/:nksId/absence',
                component: () => import('@/pages/nks-absence/IndexPage.vue'),
                meta: { title: 'Absensi NKS' },
            },
            {
                path: 'nks/:nksId/absence/qr',
                component: () => import('@/pages/nks-absence/QRPage.vue'),
                meta: { title: 'Absensi NKS' },
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
                    {
                        path: 'users',
                        component: () => import('../pages/users/UserPage.vue'),
                        meta: { title: 'Setting: User' },
                    },
                    {
                        path: 'users/:id',
                        component: () => import('../pages/users/UserId.vue'),
                        meta: { title: 'Setting: User' },
                    },
                ],
            },
            {
                path: 'profile',
                component: () => import('../pages/profile/ProfileUser.vue'),
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
