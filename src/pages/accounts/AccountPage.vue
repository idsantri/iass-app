<template lang="">
    <CardPage>
        <CardHeader :title="titlePage" @on-reload="reload" :show-add="true" @on-add="handleAdd" />
        <q-card-section class="q-pa-sm" style="max-width: 1024px">
            <q-table
                flat
                bordered
                :rows="accounts"
                :columns="columns"
                row-key="id"
                :loading="loading"
                :rows-per-page-options="[10, 25, 50, 100, 0]"
            >
                <template v-slot:body-cell-private="props">
                    <q-td :props="props">
                        <q-toggle
                            :model-value="props.value"
                            :true-value="true"
                            :false-value="false"
                            checked-icon="check"
                            unchecked-icon="clear"
                            color="orange-10"
                            @update:model-value="
                                (value, event) => handleToggle(value, props.row.id)
                            "
                        />
                    </q-td>
                </template>
                <template v-slot:body-cell-id="props">
                    <q-td :props="props">
                        <q-btn
                            icon="edit"
                            flat
                            dense
                            color="orange-10"
                            :model-value="props.value"
                            @click="handleEdit(props.row)"
                        />
                    </q-td>
                </template>
                <template v-slot:body-cell-go="props">
                    <q-td :props="props">
                        <q-btn
                            icon="info"
                            flat
                            dense
                            color="orange-10"
                            :to="{
                                path: '/cash-flows',
                                query: {
                                    scope: query.scope,
                                    rekening: props.row.slug,
                                },
                            }"
                        />
                    </q-td>
                </template>
            </q-table>
        </q-card-section>
        <QDialog v-model="dialog">
            <AccountForm
                @success-create="onCreate"
                @success-update="onUpdate"
                @success-delete="onDelete"
                :dataInputs="account"
                :scope="query.scope"
            />
        </QDialog>
    </CardPage>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import Account from '@/models/Account';
import { toProperCase } from '@/utils/string';
import ArrayCrud from '@/models/ArrayCrud';
import { notifyWarning } from '@/utils/notify';
import AccountForm from '@/components/forms/AccountForm.vue';

const { query } = useRoute();
const titlePage = 'Daftar Rekening ' + toProperCase(query.scope);

const loading = ref(false);
const dialog = ref(false);
const accounts = ref([]);
const account = ref({});

onMounted(async () => {
    reload();
});

function reload() {
    dialog.value = false;
    loading.value = true;
    Account.getAll({
        lingkup: query.scope,
    })
        .then((res) => {
            // console.log('🚀 ~ reload ~ res:', res);
            if (res && res.accounts) {
                accounts.value = res.accounts;
            }
        })
        .catch((err) => console.log(err))
        .finally(() => (loading.value = false));
}
async function handleToggle(value, id) {
    try {
        loading.value = true;
        accounts.value = ArrayCrud.update(accounts.value, id, { private: value });
        const data = ArrayCrud.findById(accounts.value, id);
        await Account.update(id, data, { lingkup: query.scope });
        if (value) {
            notifyWarning(
                'Arus kas untuk rekening ini hanya dapat dilihat oleh Anda sendiri atau pengguna dengan peran (role) yang sama',
            );
        } else {
            notifyWarning('Arus kas untuk rekening ini dapat diakses oleh seluruh pengguna');
        }
    } catch (err) {
        accounts.value = ArrayCrud.update(accounts.value, id, { private: value ? false : true });
        console.error('🚀 ~ toggleHidden ~ err:', err);
    } finally {
        loading.value = false;
    }
}

const handleEdit = (acc) => {
    const data = JSON.parse(JSON.stringify(acc));
    account.value = {
        komisariat: toProperCase(query.komisariat),
        ...data,
    };
    // console.log('🚀 ~ handleEdit ~ data:', data);
    dialog.value = true;
};

const handleAdd = () => {
    account.value = {
        komisariat: toProperCase(query.komisariat) ?? null,
        private: true,
    };
    dialog.value = true;
};

const onCreate = (data) => {
    accounts.value = ArrayCrud.create(accounts.value, data, 'first');
    dialog.value = false;
};

const onUpdate = (data) => {
    accounts.value = ArrayCrud.update(accounts.value, data.id, data);
    dialog.value = false;
};

const onDelete = (id) => {
    accounts.value = ArrayCrud.remove(accounts.value, id);
    dialog.value = false;
};

const columns = [
    {
        name: 'private',
        label: 'Private',
        field: 'private',
        align: 'center',
    },
    {
        name: 'nama',
        label: 'Nama',
        field: 'nama',
        align: 'left',
    },
    {
        name: 'komisariat',
        label: 'Komisariat',
        field: 'komisariat',
        align: 'left',
    },
    {
        name: 'id',
        label: 'Edit',
        field: 'id',
        align: 'center',
    },
    {
        name: 'go',
        label: '!',
        field: 'id',
        align: 'center',
    },
];
</script>
<style lang=""></style>
