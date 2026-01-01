<template>
    <CardPage>
        <CardHeader
            title="Data Pengguna"
            @on-reload="loadData"
            :show-add="true"
            @on-add="dialog = true"
        >
        </CardHeader>

        <q-table
            class="q-px-sm"
            :rows="users"
            :columns="columns"
            row-key="name"
            :loading="loading"
            :filter="filter"
            @row-click="(evt, row, index) => $router.push(`/settings/users/${row.id}`)"
            :rows-per-page-options="[25, 50, 75, 100, 0]"
        >
            <template v-slot:top-right>
                <q-input outlined dense debounce="300" v-model="filter" placeholder="Cari">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>
        </q-table>
    </CardPage>
    <QDialog v-model="dialog">
        <UserForm
            @success-delete="() => $router.go(-1)"
            @success-submit="(res) => $router.push(`/settings/users/${res.id}`)"
        />
    </QDialog>
    <!-- <pre>{{ users }}</pre> -->
</template>
<script setup>
import UserForm from '@/components/forms/UserForm.vue';
import User from '@/models/User';
import { onMounted, ref, shallowRef } from 'vue';

const filter = ref('');
const loading = ref(false);
const users = shallowRef([]);
const dialog = ref(false);

const columns = [
    {
        name: 'name',
        label: 'Nama',
        align: 'left',
        field: 'name',
        sortable: true,
    },
    {
        name: 'username',
        label: 'Username',
        align: 'left',
        field: 'username',
        sortable: true,
    },

    {
        name: 'roles',
        label: 'Group (Role)',
        align: 'left',
        field: (row) => row.roles.join(', '),
        sortable: true,
    },
    {
        name: 'komisariat',
        label: 'Komisariat',
        align: 'left',
        field: 'komisariat',
        sortable: true,
    },

    {
        name: 'must_change_password',
        label: 'Ganti Password',
        align: 'left',
        field: 'must_change_password',
        format: (val) => `${val ? 'Ya' : 'Tidak'}`,
        sortable: true,
    },
];

async function loadData() {
    try {
        loading.value = true;
        users.value = [];
        const data = await User.getAll();
        users.value = data.users;
    } catch (error) {
        console.log('error get users ', error);
    } finally {
        loading.value = false;
    }
    // console.log(users.value);
}

onMounted(async () => {
    await loadData();
});
</script>
<style></style>
