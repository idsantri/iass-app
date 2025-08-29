<template>
    <q-scroll-area class="fit">
        <q-list>
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
                        {{ item.label }}
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
        route: '/anggota',
        separator: true,
        disable: false,
    },
    {
        icon: 'sym_o_history_2',
        label: 'NKS',
        route: '/nks',
        separator: false,
        disable: false,
    },
    {
        icon: 'sym_o_list_alt_check',
        label: 'Absensi',
        route: '/',
        separator: true,
        disable: true,
    },

    {
        icon: 'sym_o_grading',
        label: 'List (Auto Complete)',
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
