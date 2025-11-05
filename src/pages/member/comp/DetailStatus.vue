<template>
    <div class="q-pa-sm bg-orange-2 flex items-center justify-between">
        <div>Riwayat Status</div>
        <QBtn
            label="Tambah"
            icon="add"
            outline
            dense
            no-caps=""
            class="q-px-md"
            @click="handleAdd"
        />
    </div>
    <QList bordered separator>
        <template v-if="!statuses || !statuses?.length">
            <QItem>
                <QItemSection>
                    <QItemLabel class="text-negative text-center">
                        Tidak ada data untuk ditampilkan. <br />
                        Silakan tambahkan data!
                    </QItemLabel>
                </QItemSection>
            </QItem>
        </template>
        <template v-else>
            <QItem
                v-for="(item, index) in statuses"
                :key="item.id"
                :class="index == 0 ? 'bg-yellow-1' : ''"
            >
                <QItemSection>
                    <QItemLabel overline>
                        {{ item.status }}
                    </QItemLabel>
                    <QItemLabel caption>
                        {{ formatDate(item.created_at, 'dd MMMM yyyy') }}
                    </QItemLabel>
                    <QItemLabel>
                        {{ item.keterangan ?? '-' }}
                    </QItemLabel>
                </QItemSection>
                <QItemSection side>
                    <QBtn
                        icon="edit"
                        round
                        outline
                        glossy
                        color="orange-10"
                        @click="handleEdit(item)"
                    />
                </QItemSection>
            </QItem>
        </template>
    </QList>
    <!-- {{ member }} -->
    <QDialog v-model="dialog">
        <StatusForm
            :data="objStatus"
            @success-delete="(id) => emit('deleteStatus', id)"
            @success-create="(obj) => emit('createStatus', obj)"
            @success-update="(obj) => emit('updateStatus', obj)"
        />
    </QDialog>
</template>
<script setup>
import StatusForm from '@/components/forms/StatusForm.vue';
import { formatDate } from '@/utils/date-operation';
import { ref } from 'vue';

const emit = defineEmits(['deleteStatus', 'createStatus', 'updateStatus']);
const props = defineProps({
    statuses: {
        type: Array,
        required: true,
    },
    member: {
        type: Object,
        required: true,
    },
});

const dialog = ref(false);
const objStatus = ref({});
const handleAdd = () => {
    objStatus.value = { member_id: props.member.id, nama: props.member.nama };
    dialog.value = true;
};
const handleEdit = (obj) => {
    objStatus.value = obj;
    objStatus.value.member_id = props.member.id;
    objStatus.value.nama = props.member.nama;
    dialog.value = true;
};
</script>
