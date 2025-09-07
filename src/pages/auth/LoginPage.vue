<template>
    <div
        class="tw:flex tw:justify-center tw:items-center tw:h-screen tw:p-4 tw:max-w-sm tw:mx-auto"
    >
        <div class="tw:w-full">
            <BannerInstallPWA />
            <div class="tw:border tw:border-gray-300 tw:p-4 tw:rounded-lg bg-orange-2">
                <div class="text-center">
                    <q-avatar round color="" size="150px">
                        <img alt="logo" src="/icons/icon-512x512.png" />
                    </q-avatar>
                </div>

                <div class="tw:text-2xl text-center q-my-lg tw:font-light">Halaman Login</div>
                <form @submit.prevent="onLogin">
                    <div class="q-gutter-y-md column">
                        <q-input
                            bg-color="orange-1"
                            outlined
                            label="Login"
                            name="login"
                            v-model="login"
                            required
                            hint="Username atau email/surel Anda!"
                            autocomplete="off"
                            autocapitalize="none"
                            class="full-width"
                        />
                        <q-input
                            id="password"
                            :type="isPwd ? 'password' : 'text'"
                            bg-color="orange-1"
                            outlined
                            label="Password"
                            name="password"
                            v-model="password"
                            required
                            autocomplete="off"
                            autocapitalize="none"
                            hint="Password atau kata sandi"
                            class="full-width"
                        >
                            <template v-slot:append>
                                <q-icon
                                    :name="isPwd ? 'visibility_off' : 'visibility'"
                                    class="cursor-pointer"
                                    @click="isPwd = !isPwd"
                                />
                            </template>
                        </q-input>
                        <q-btn
                            type="submit"
                            class="full-width q-pa-sm text-orange-10"
                            color="orange-4"
                            label="Login"
                        />

                        <q-card class="text-orange-10 text-center bg-orange-1 q-pa-sm" flat>
                            Belum punya akun atau lupa password? <br />
                            Hubungi Admin!
                        </q-card>

                        <q-spinner-cube
                            v-if="isLoading"
                            color="orange-12"
                            size="14em"
                            class="absolute-center"
                        />
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script setup>
import Auth from '@/models/Auth';
import authStore from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import BannerInstallPWA from '@/components/BannerInstallPWA.vue';

const login = ref('');
const password = ref('');
const router = useRouter();
const isPwd = ref(true);
const isLoading = ref(false);

const onLogin = () => {
    isLoading.value = true;
    Auth.login({ login: login.value, password: password.value })
        .then((res) => {
            authStore().login(res);
            if (res.user.must_change_password) {
                router.replace('/profile');
            } else {
                router.replace('/');
            }
        })
        .catch((err) => console.log('error on login ', err))
        .finally(() => (isLoading.value = false));
};
</script>
