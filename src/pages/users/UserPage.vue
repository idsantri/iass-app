<template>
    <q-card>
        <SectionHeader title="Data Pengguna" @on-reload="loadData">
            <template #left>
                <QBtn
                    dense
                    label="Tambah"
                    outline=""
                    icon="add"
                    no-caps
                    class="q-px-md q-mr-sm text-orange-1"
                    @click="dialog = true"
                />
            </template>
        </SectionHeader>

        <q-table
            class="q-px-sm"
            :rows="users"
            :columns="columns"
            row-key="name"
            :loading="loading"
            :filter="filter"
            @row-click="(evt, row, index) => $router.push(`/settings/users/${row.id}`)"
        >
            <!-- :rows-per-page-options="[10, 25, 50, 75, 100, 0]" -->
            <template v-slot:top-right>
                <q-input outlined dense debounce="300" v-model="filter" placeholder="Cari">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>
        </q-table>
    </q-card>
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
import SectionHeader from '@/components/SectionHeader.vue';
import User from '@/models/User';
import { onMounted, ref } from 'vue';

const filter = ref('');
const loading = ref(false);
const users = ref([]);
const dialog = ref(false);

const columns = [
    {
        name: 'name',
        label: 'Nama',
        align: 'left',
        field: 'name',
        sortable: true,
        // sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
    },
    {
        name: 'username',
        label: 'Username',
        align: 'left',
        field: 'username',
        sortable: true,
        // sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
    },
    // {
    //     name: 'email',
    //     label: 'Email',
    //     align: 'left',
    //     field: 'email',
    //     sortable: true,
    //     // sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
    // },
    {
        name: 'roles',
        label: 'Group (Role)',
        align: 'left',
        field: 'roles',
        sortable: true,
        // sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
    },
    {
        name: 'komisariat',
        label: 'Komisariat',
        align: 'left',
        field: 'komisariat',
        sortable: true,
        // sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
    },
    // {
    //     name: 'confirmed_at',
    //     label: 'Konfirmasi',
    //     align: 'left',
    //     field: 'confirmed_at',
    //     format: (val) => `${val ? 'Ya' : 'Tidak'}`,
    //     sortable: true,
    //     // sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
    // },
    // {
    //     name: 'verified',
    //     label: 'Verikasi',
    //     align: 'left',
    //     field: 'email_verified_at',
    //     format: (val) => `${val ? 'Ya' : 'Tidak'}`,
    //     sortable: true,
    //     // sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
    // },
    {
        name: 'must_change_password',
        label: 'Ganti Password',
        align: 'left',
        field: 'must_change_password',
        format: (val) => `${val ? 'Ya' : 'Tidak'}`,
        sortable: true,
        // sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
    },
];

async function loadData() {
    try {
        loading.value = true;
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
