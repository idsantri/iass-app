<template lang="">
    <q-card id="qr">
        <q-card-section class="q-pa-sm bg-orange-7 text-orange-1 text-center">
            {{ env.VITE_APP_INSTANCE }}
        </q-card-section>
        <q-card-section class="flex flex-center q-mx-xl q-mb-none q-mt-md">
            <q-avatar size="150px" class="text-center tw:ring-4 tw:ring-orange-300/75 tw:m-2">
                <q-skeleton v-if="loadingAvatar" type="QAvatar" size="150px" />
                <q-img :src="avatarUrl" fit="cover" ratio="1" width="200px" />
            </q-avatar>
        </q-card-section>
        <q-card-section class="flex flex-center q-mx-xl q-my-none" @click="captureQrCode">
            <qrcode-vue :value="member.id.toString()" :size="200" level="H" render-as="svg" />
        </q-card-section>
        <q-card-section class="no-padding tw:text-center tw:text-xl tw:font-mono tw:font-bold">
            {{ member.id }}
        </q-card-section>

        <q-card-section class="text-center bg-orange-3 q-mt-md">
            <div class="tw:text-xl">
                {{ member.nama?.toUpperCase() }}
            </div>
            <div class="tw:text-xl tw:font-light">
                {{ member.komisariat }} | {{ member.kelompok }}
            </div>
        </q-card-section>
    </q-card>
    <q-dialog v-model="loadingCapture" persistent>
        <q-card flat class="q-pa-md flex flex-center">
            <q-spinner-dots size="50px" color="primary" />
            <div class="q-ml-md">Menyimpan QR Code...</div>
        </q-card>
    </q-dialog>
</template>

<script setup>
import Member from '@/models/Member';
import { domToPng } from 'modern-screenshot';
import QrcodeVue from 'qrcode.vue';
import { onMounted, onUnmounted, nextTick, ref } from 'vue';

const props = defineProps({
    member: {
        type: Object,
        required: true,
    },
});

const loadingAvatar = ref(false);
const loadingCapture = ref(false);
const avatarUrl = ref('/user-default.png');
const env = import.meta.env;

async function captureQrCode() {
    try {
        loadingCapture.value = true;
        const dataUrl = await domToPng(document.querySelector('#qr'), {
            quality: 1.0,
            scale: 1.5, // Untuk kualitas lebih tinggi
        });

        const link = document.createElement('a');
        link.download = `iass-${props.member.id}-qr.png`;
        link.href = dataUrl;
        link.click();

        console.log('Screenshot captured successfully');
    } catch (error) {
        console.error('Failed to capture screenshot:', error);
    } finally {
        loadingCapture.value = false;
    }
}
async function loadAvatar() {
    try {
        loadingAvatar.value = true;
        const data = await Member.getAvatar(props.member.id);
        avatarUrl.value = data;
    } catch (error) {
        console.error('Error loading avatar image:', error);
        avatarUrl.value = '/user-default.png';
    } finally {
        loadingAvatar.value = false;
    }
}
onMounted(async () => {
    await loadAvatar();
    await nextTick();

    // Tunggu sedikit lebih lama untuk memastikan semua resource loaded
    loadingCapture.value = true;
    setTimeout(async () => {
        console.log('Attempting screenshot capture...');
        await captureQrCode();
    }, 500);
});

onUnmounted(() => {
    if (avatarUrl.value && avatarUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl.value);
    }
});
</script>

<style lang=""></style>
