<template>
    <div class="q-pa-sm bg-orange-1 q-my-sm flex items-center justify-between">
        <div>Riwayat Status</div>
        <QBtn label="Tambah" icon="add" outline dense no-caps="" class="q-px-md" />
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
            <QItem v-for="item in statuses" :key="item.id">
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
                    <QBtn icon="edit" round outline glossy />
                </QItemSection>
            </QItem>
        </template>
    </QList>
</template>
<script setup>
import formatDate from '@/utils/format-date';
defineProps({
    statuses: {
        // type: Array,
        required: true,
    },
});
</script>
