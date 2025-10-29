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
                path: 'nks/:nksId/notes',
                component: () => import('@/pages/nks-note/IndexPage.vue'),
                meta: { title: 'Catatan NKS' },
            },
            {
                path: 'nks/:nksId/notes/form',
                component: () => import('@/pages/nks-note/EditPage.vue'),
                meta: { title: 'Catatan NKS' },
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
                path: 'nks/absence/rekap-komisariat',
                component: () => import('@/pages/nks-absence/RekapKomisariat.vue'),
                meta: { title: 'Absensi NKS | Rekap Komisariat' },
            },
            {
                path: 'nks/absence/rekap-member',
                component: () => import('@/pages/nks-absence/RekapMember.vue'),
                meta: { title: 'Absensi NKS | Rekap Anggota' },
            },
            {
                path: 'members',
                meta: { title: 'Anggota' },
                component: () => import('../pages/member/MemberIndex.vue'),
            },
            {
                path: 'members/:id',
                meta: { title: 'Anggota' },
                component: () => import('../pages/member/MemberDetail.vue'),
            },

            // KOMISARIAT
            {
                path: 'komisariat',
                children: [
                    {
                        path: 'activities',
                        component: () => import('../pages/komisariat/activities/IndexPage.vue'),
                        meta: { title: 'Komisariat: Kegiatan' },
                    },
                ],
            },

            // SETTING
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
