<template>
    <QCardSection class="q-pa-sm bg-orange-2"> Formulir Ganti Password </QCardSection>
    <q-card-section class="q-pa-sm">
        <form @submit.prevent="onSubmit">
            <q-input
                v-model="inputs.password_current"
                class="q-my-sm"
                label="Password Lama"
                outlined
                dense
                type="password"
            />
            <q-input
                v-model="inputs.password"
                class="q-my-sm"
                label="Password Baru"
                outlined
                dense
                type="password"
            />
            <q-input
                v-model="inputs.password_confirmation"
                class="q-my-sm"
                label="Ulangi Password Baru"
                outlined
                dense
                type="password"
            />
            <div class="text-right">
                <QBtn label="Simpan" no-caps color="orange" type="submit" />
            </div>
        </form>
    </q-card-section>
</template>
<script setup>
import User from '@/models/User';
import { ref } from 'vue';

const inputs = ref({});
const emit = defineEmits(['loading', 'success']);
async function onSubmit() {
    const data = JSON.parse(JSON.stringify(inputs.value));

    try {
        emit('loading', true);
        await User.updateMyPassword(data);
        emit('success');
    } catch (error) {
        console.log('error update password ', error);
    } finally {
        emit('loading', false);
    }
}
</script>
