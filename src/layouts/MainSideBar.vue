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
            <template v-for="(item, index) in menus" :key="index">
                <q-item
                    clickable
                    :active="item.label === 'Outbox'"
                    v-ripple
                    :to="item.route"
                    :disable="item.disable"
                >
                    <q-item-section avatar>
                        <q-icon :name="item.icon" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>{{ item.label }}</q-item-label>
                        <q-item-label caption v-if="item.caption">
                            {{ item.caption }}
                        </q-item-label>
                    </q-item-section>
                </q-item>
                <q-separator :key="'sep' + index" v-if="item.separator" />
            </template>
        </q-list>
    </q-scroll-area>
</template>
<script setup>
const menus = [
    {
        icon: 'groups',
        label: 'Anggota',
        caption: 'IASS Bangkalan',
        route: '/members',
        separator: true,
        disable: false,
    },
    {
        icon: 'sym_o_history_2',
        label: 'NKS',
        caption: 'Jadwal NKS',
        route: '/nks',
        separator: false,
        disable: false,
    },

    {
        icon: 'sym_o_overview_key',
        label: 'Rekap Komisariat',
        caption: 'Absensi by Komisariat',
        route: '/nks/absence/rekap-komisariat',
        separator: false,
        disable: false,
    },
    {
        icon: 'sym_o_clinical_notes',
        label: 'Rekap Anggota',
        caption: 'Absensi by Anggota',
        route: '/nks/absence/rekap-member',
        separator: true,
        disable: false,
    },

    {
        icon: 'sym_o_grading',
        label: 'List',
        caption: 'Input AutoComplete',
        route: '/settings/lists',
        separator: false,
        disable: false,
    },
    {
        icon: 'manage_accounts',
        label: 'Pengaturan Pengguna',
        route: '/settings/users',
        separator: true,
        disable: false,
    },
    // {
    //     icon: 'info',
    //     label: 'Tentang',
    //     route: '/about',
    //     separator: true,
    //     disable: false,
    // },
    {
        icon: 'logout',
        label: 'Keluar',
        route: '/logout',
        separator: false,
        disable: false,
    },
];
</script>
