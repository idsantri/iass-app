<template>
    <div class="q-pa-sm tw:flex tw:flex-col tw:gap-y-4 tw:gap-x-2 tw:items-center tw:sm:flex-row">
        <q-avatar
            size="200px"
            class="text-center tw:ring-4 tw:ring-orange-300/75 tw:shadow-lg tw:shadow-orange-500/75 tw:m-2"
            @click="emit('onClickUpload')"
        >
            <q-img
                :src="anggota?.avatar_url || '/user-default.png'"
                fit="cover"
                ratio="1"
                width="200px"
            />
            <q-tooltip class="bg-orange"> Klik/tap untuk upload foto </q-tooltip>
        </q-avatar>
        <QMarkupTable class="tw:grow" flat>
            <tbody>
                <tr>
                    <td>ID IASS</td>
                    <td class="flex items-center justify-between">
                        <span>{{ anggota.id }}</span>
                        <span>{{ anggota.th_berhenti }}</span>
                    </td>
                </tr>
                <tr>
                    <td>Nama</td>
                    <td>{{ anggota.nama }}</td>
                </tr>
                <tr>
                    <td>Kelahiran</td>
                    <td>
                        {{ anggota.tmp_lahir }},
                        {{ formatDate(anggota.tgl_lahir, 'dd MMMM yyyy') }} ({{
                            getAge(anggota.tgl_lahir)
                        }}
                        tahun)
                    </td>
                </tr>
                <tr>
                    <td>Alamat Lengkap</td>
                    <td>{{ anggota.alamat_lengkap }}</td>
                </tr>
                <tr>
                    <td>Keanggotaan</td>
                    <td>
                        {{ anggota.keanggotaan }} (<span class="text-weight-bold">{{
                            anggota.status_max
                        }}</span
                        >)
                    </td>
                </tr>
                <tr>
                    <td>Komisariat</td>
                    <td>{{ anggota.komisariat }}</td>
                </tr>
                <tr>
                    <td>Kelompok</td>
                    <td>{{ anggota.kelompok }}</td>
                </tr>
                <tr>
                    <td>Nomor HP</td>
                    <td class="flex items-center justify-between">
                        <span>
                            {{ anggota.no_hp }}
                        </span>
                        <QBtn
                            v-if="anggota.no_hp"
                            dense
                            icon="phone_enabled"
                            color="orange-7"
                            glossy=""
                            round
                            outline
                            type="a"
                            :href="`https://wa.me/${anggota?.no_hp?.replace(/^0/, '62') ?? ''}?text=Assalamualaikum%20${anggota?.nama}`"
                            target="_blank"
                            rel="noopener noreferrer"
                        />
                    </td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>{{ anggota.email }}</td>
                </tr>
            </tbody>
        </QMarkupTable>
    </div>
</template>

<script setup>
import { formatDate, getAge } from '@/utils/date-operation';

defineProps({
    anggota: {
        type: Object,
        required: true,
    },
});
const emit = defineEmits(['onAvatarClick']);
</script>
<style scoped>
td {
    white-space: normal;
    word-wrap: break-word;
}
</style>
