<template>
    <q-scroll-area class="fit">
        <q-list>
            <q-item to="/">
                <q-item-section>
                    <div class="text-center">
                        <q-avatar round color="" size="100px">
                            <img alt="logo" src="/icons/icon-512x512.png" />
                        </q-avatar>
                    </div>
                </q-item-section>
            </q-item>
            <MainSideItem :data="master" title="Master" />
            <q-separator />
            <MainSideItem :data="wilayah" title="Wilayah" />
            <q-separator />
            <MainSideItem :data="komisariat" title="Komisariat" />
            <q-separator />
            <MainSideItem :data="bansus" title="Bansus" />
            <q-separator />
            <MainSideItem :data="setting" title="Pengaturan" />
        </q-list>
    </q-scroll-area>
</template>
<script setup>
import MainSideItem from './MainSideItem.vue';

const master = [
    {
        icon: 'groups',
        label: 'Anggota',
        caption: 'IASS Bangkalan',
        route: '/members',
        disable: false,
    },
];

const wilayah = [
    {
        icon: 'sym_o_history_2',
        label: 'Kegiatan',
        caption: 'Kegiatan Wilayah',
        route: '/wilayah/activities',
        disable: false,
    },

    {
        icon: 'sym_o_overview_key',
        label: 'Absensi Komisariat',
        caption: 'Rekap by Komisariat',
        route: '/wilayah/absence-nks/rekap-komisariat',
        disable: false,
    },
    {
        icon: 'sym_o_clinical_notes',
        label: 'Absensi Anggota',
        caption: 'Rekap by Anggota',
        route: '/wilayah/absence-nks/rekap-member',
        separator: true,
        disable: false,
    },
];

const komisariat = [
    {
        icon: 'sym_o_history_2',
        label: 'Kegiatan',
        caption: 'Kegiatan Komisariat',
        route: '/komisariat/activities',
        disable: false,
    },
];
const bansus = [
    {
        icon: 'sym_o_person_shield',
        label: 'Personil',
        caption: 'Data Anggota',
        route: '/bansuses',
        disable: false,
    },
    {
        icon: 'sym_o_history_2',
        label: 'Kegiatan',
        caption: 'Kegiatan Bansus',
        route: '/bansus/activities',
        disable: false,
    },
];

const setting = [
    {
        icon: 'sym_o_grading',
        label: 'List',
        caption: 'Input AutoComplete',
        route: '/settings/lists',
        disable: false,
    },
    {
        icon: 'manage_accounts',
        label: 'Pengaturan Pengguna',
        route: '/settings/users',
        disable: false,
    },
];
</script>
