<template lang="">
    <q-card flat bordered>
        <q-card-section
            class="bg-orange-7 text-orange-1 q-px-sm q-py-sm flex items-center justify-between"
        >
            Informasi Detail Anggota Bansus
            <div class="tw:py-3.5"></div>
        </q-card-section>
        <CardLoading :showing="isLoading" />
        <q-markup-table class="q-pa-sm tw:min-h-[350px]">
            <tbody>
                <tr>
                    <td class="label">ID Bansus</td>
                    <td>{{ bansus?.id }}</td>
                </tr>
                <tr>
                    <td class="label">ID Alumni</td>
                    <td class="flex justify-between items-center">
                        {{ bansus?.member_id }}
                        <q-space />
                        <q-btn
                            color="orange-6"
                            icon="person"
                            rounded
                            outline
                            glossy
                            dense
                            :to="'/members/' + bansus?.member_id"
                            class="text-right"
                        />
                    </td>
                </tr>
                <tr>
                    <td class="label">Nama</td>
                    <td style="font-variant: small-caps; letter-spacing: 0.25em; font-weight: 500">
                        {{ bansus?.member?.nama }}
                    </td>
                </tr>
                <tr>
                    <td class="label">Jabatan</td>
                    <td>{{ bansus?.jabatan_max }}</td>
                </tr>
                <tr>
                    <td class="label">Status</td>
                    <td>{{ bansus?.status_max }}</td>
                </tr>
                <tr>
                    <td class="label">Komisariat</td>
                    <td>{{ bansus?.member?.komisariat }}</td>
                </tr>
            </tbody>
        </q-markup-table>
        <q-card-actions class="q-pa-sm bg-orange-11 absolute-bottom">
            <q-btn
                color="negative"
                icon="sym_o_delete"
                class="q-px-sm"
                no-caps
                label="Hapus"
                @click="onDelete"
            />
        </q-card-actions>
    </q-card>
</template>
<script setup>
defineProps({
    bansus: {
        type: Object,
        required: true,
    },
    isLoading: {
        type: Boolean,
        required: true,
    },
    onDelete: {
        type: Function,
        required: true,
    },
});
// const emit = defineEmits(['onDelete']);
</script>
<style scoped>
td,
td * {
    white-space: normal;
    word-wrap: break-word;
}
.label {
    font-weight: lighter;
    font-style: italic;
}
</style>
