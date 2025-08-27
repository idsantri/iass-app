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
        icon: 'home',
        label: 'Anggota',
        route: '/anggota',
        separator: true,
    },
    {
        icon: 'home',
        label: 'NKS',
        route: '/',
        separator: false,
    },
    {
        icon: 'home',
        label: 'Absensi',
        route: '/',
        separator: true,
    },

    {
        icon: 'settings',
        label: 'List (Auto Complete)',
        route: '/settings/lists',
        separator: false,
    },
    {
        icon: 'settings',
        label: 'Pengaturan Pengguna',
        route: '/settings/users',
        separator: false,
    },
    {
        icon: 'info',
        label: 'Tentang',
        route: '/about',
        separator: true,
    },
    {
        icon: 'logout',
        label: 'Keluar',
        route: '/logout',
        separator: false,
    },
];
</script>
