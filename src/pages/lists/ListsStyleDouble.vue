<template lang="">
    <q-table
        :rows="props.data"
        :columns="columns"
        :rows-per-page-options="[10, 25, 50, 100, 0]"
        flat
        :loading="props.loading"
    >
        <template v-slot:body="props">
            <q-tr :props="props">
                <q-td :props="props" key="val0">
                    {{ props.row.val0 }}
                </q-td>
                <q-td :props="props" key="val1">
                    {{ props.row.val1 }}
                </q-td>
                <q-td :props="props" key="id">
                    <q-btn
                        icon="edit"
                        outline
                        round
                        dense
                        glossy
                        color="orange-10"
                        @click="() => emit('handleEdit', props.row)"
                    />
                </q-td>
            </q-tr>
        </template>
    </q-table>
</template>
<script setup>
const emit = defineEmits(['handleEdit']);
const props = defineProps({
    data: {
        type: Array,
        required: true,
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

const columns = [
    {
        name: 'val0',
        label: 'Text 1',
        align: 'left',
        field: (row) => `${row.val0}`,
        sortable: true,
    },
    {
        name: 'val1',
        label: 'Text 2',
        align: 'left',
        field: (row) => `${row.val1}`,
        sortable: true,
    },
    {
        name: 'id',
        label: 'Edit',
        align: 'center',
        field: 'id',
        style: 'width: 90px',
    },
];
</script>
<style lang=""></style>
