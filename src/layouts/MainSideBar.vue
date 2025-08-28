<template>
    <q-scroll-area class="fit">
        <q-list>
            <template v-for="(menuItem, index) in menuList" :key="index">
                <q-item
                    clickable
                    :active="menuItem.label === 'Outbox'"
                    v-ripple
                    :to="menuItem.route"
                >
                    <q-item-section avatar>
                        <q-icon :name="menuItem.icon" />
                    </q-item-section>
                    <q-item-section>
                        {{ menuItem.label }}
                    </q-item-section>
                </q-item>
                <q-separator :key="'sep' + index" v-if="menuItem.separator" />
            </template>
        </q-list>
    </q-scroll-area>
</template>
<script setup>
const menuList = [
    {
        icon: 'groups',
        label: 'Anggota',
        route: '/anggota',
        separator: true,
    },
    {
        icon: 'sym_o_history_2',
        label: 'NKS',
        route: '/',
        separator: false,
    },
    {
        icon: 'sym_o_list_alt_check',
        label: 'Absensi',
        route: '/',
        separator: true,
    },

    {
        icon: 'sym_o_grading',
        label: 'List (Auto Complete)',
        route: '/settings/lists',
        separator: false,
    },
    {
        icon: 'manage_accounts',
        label: 'Pengaturan Pengguna',
        route: '/settings/users',
        separator: true,
    },
    // {
    //     icon: 'info',
    //     label: 'Tentang',
    //     route: '/about',
    //     separator: true,
    // },
    {
        icon: 'logout',
        label: 'Keluar',
        route: '/logout',
        separator: false,
    },
];
</script>
