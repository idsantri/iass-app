export default [
    {
        path: 'activities',
        component: () => import('@/pages/activities/ActivitiesIndex.vue'),
    },
    {
        path: 'activities/:id',
        component: () => import('@/pages/activities/ActivityDetail.vue'),
        redirect: (to) => `${to.path}/absence-summaries`,
        children: [
            {
                path: 'absence-summaries',
                component: () => import('@/pages/absences/AbsenceSummary.vue'),
            },
            {
                path: 'notes',
                component: () => import('@/pages/notes/IndexNotes.vue'),
            },
        ],
    },
    {
        path: 'activities/:id/notes/form',
        component: () => import('@/pages/notes/EditNote.vue'),
    },
    {
        path: 'activities/:id/absences',
        component: () => import('@/pages/absences/AbsencesIndex.vue'),
    },
    {
        path: 'activities/:id/absences/qr',
        component: () => import('@/pages/absences/AbsencesQR.vue'),
    },
];
