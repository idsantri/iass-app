import MainLayout from '@/layouts/MainLayout.vue';
import HomeView from '@/pages/HomeView.vue';
import _common from './_common';

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
                path: 'members',
                meta: { title: 'Anggota' },
                children: [
                    {
                        path: '',
                        component: () => import('../pages/member/MemberIndex.vue'),
                    },
                    {
                        path: ':id',
                        component: () => import('../pages/member/MemberDetail.vue'),
                    },
                ],
            },
            // {
            //     path: 'nks',
            //     component: () => import('@/pages/nks/NksIndex.vue'),
            //     meta: { title: 'NKS' },
            // },
            // {
            //     path: 'nks/:id',
            //     component: () => import('@/pages/nks/NksDetail.vue'),
            //     meta: { title: 'NKS' },
            // },
            // {
            //     path: 'nks/:nksId/notes',
            //     component: () => import('@/pages/nks-note/IndexPage.vue'),
            //     meta: { title: 'Catatan NKS' },
            // },
            // {
            //     path: 'nks/:nksId/notes/form',
            //     component: () => import('@/pages/nks-note/EditPage.vue'),
            //     meta: { title: 'Catatan NKS' },
            // },
            // {
            //     path: 'nks/:nksId/absence',
            //     component: () => import('@/pages/nks-absence/IndexPage.vue'),
            //     meta: { title: 'Absensi NKS' },
            // },
            // {
            //     path: 'nks/:nksId/absence/qr',
            //     component: () => import('@/pages/nks-absence/QRPage.vue'),
            //     meta: { title: 'Absensi NKS' },
            // },
            // {
            //     path: 'nks/absence/rekap-komisariat',
            //     component: () => import('@/pages/nks-absence/RekapKomisariat.vue'),
            //     meta: { title: 'Absensi NKS | Rekap Komisariat' },
            // },
            // {
            //     path: 'nks/absence/rekap-member',
            //     component: () => import('@/pages/nks-absence/RekapMember.vue'),
            //     meta: { title: 'Absensi NKS | Rekap Anggota' },
            // },

            // Wilayah
            {
                path: 'wilayah',
                meta: { scope: 'Wilayah', title: 'Kegiatan Wilayah' },
                children: [
                    ..._common,
                    {
                        path: 'absence-nks/rekap-komisariat',
                        component: () => import('@/pages/absences/RekapKomisariat.vue'),
                        meta: { title: 'Absensi NKS | Rekap Komisariat' },
                    },
                    {
                        path: 'absence-nks/rekap-member',
                        component: () => import('@/pages/absences/RekapMember.vue'),
                        meta: { title: 'Absensi NKS | Rekap Anggota' },
                    },
                ],
            },

            // Komisariat
            {
                path: 'komisariat',
                meta: { scope: 'Komisariat', title: 'Kegiatan Komisariat' },
                children: _common,
            },

            // Settings
            {
                path: 'settings',
                meta: { title: 'Pengaturan' },
                children: [
                    {
                        path: 'lists',
                        component: () => import('../pages/lists/ListsIndex.vue'),
                        meta: { title: 'Pengaturan: List' },
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
                        meta: { title: 'Pengaturan: Pengguna' },
                    },
                    {
                        path: 'users/:id',
                        component: () => import('../pages/users/UserId.vue'),
                        meta: { title: 'Pengaturan: Pengguna' },
                    },
                ],
            },

            // Profile
            {
                path: 'profile',
                meta: { title: 'Profil Saya' },
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
