<template>
    <div></div>
</template>

<script setup>
import Auth from '@/models/Auth';
import authStore from '@/stores/authStore';
import { notifyConfirm } from '@/utils/notify';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

onMounted(async () => {
    const isConfirmed = await notifyConfirm('Keluar dari akun?');
    if (!isConfirmed) {
        router.go(-1);
    } else {
        try {
            await Auth.logout();
        } catch (error) {
            console.log('error on logout ', error);
        }
        authStore().logout();
        router.replace('/login');
    }
});
</script>
