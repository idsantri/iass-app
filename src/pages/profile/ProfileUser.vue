<template lang="">
    <CardPage>
        <CardHeader @on-reload="loadData" title="Profil Saya" />
        <LoadingAbsolute v-if="loading" />
        <q-card-section class="q-pa-sm" style="max-width: 600px">
            <div v-if="user.must_change_password" class="text-center q-mb-sm">
                <div class="q-pa-md text-negative bg-red-1" style="border-radius: 10px">
                    Anda perlu mengganti password <br />sebelum memulai!
                </div>
            </div>
            <QMarkupTable flat bordered>
                <tbody>
                    <tr>
                        <td class="text-italic text-caption">Nama</td>
                        <td>{{ user.name }}</td>
                    </tr>

                    <tr>
                        <td class="text-italic text-caption">Username</td>
                        <td>{{ user.username }}</td>
                    </tr>
                    <tr>
                        <td class="text-italic text-caption">Komisariat</td>
                        <td>{{ user.komisariat }}</td>
                    </tr>
                    <tr>
                        <td colspan="2" class="text-right">
                            <q-btn
                                label="Atur Password"
                                icon="edit"
                                no-caps
                                dense
                                class="q-px-sm"
                                color="orange-7"
                                @click="showPasswordForm = !showPasswordForm"
                            />
                        </td>
                    </tr>
                </tbody>
            </QMarkupTable>

            <QCard v-if="showPasswordForm" flat bordered class="q-my-sm">
                <PasswordForm @loading="(v) => (loading = v)" @success="onSuccess" />
            </QCard>

            <q-list bordered separator class="q-mt-sm">
                <q-item class="q-pa-sm bg-grey-2">
                    <q-item-section>
                        <q-item-label overline> User Group (Role) </q-item-label>
                        <q-item-label v-if="user">
                            <div class="fit row wrap justify-start items-start content-start">
                                <div v-for="(item, index) in user.roles" :key="index" class="col-6">
                                    <q-toggle
                                        :model-value="item.value"
                                        color="orange"
                                        :label="item.label"
                                        :true-value="true"
                                        :false-value="false"
                                        disable
                                    />
                                </div>
                            </div>
                        </q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-card-section>
    </CardPage>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import User from '@/models/User';
import LoadingAbsolute from '@/components/LoadingAbsolute.vue';
import PasswordForm from './PasswordForm.vue';
import authStore from '@/stores/authStore';
import { useRouter } from 'vue-router';

const user = ref({});
const loading = ref(false);
const showPasswordForm = ref(false);
const router = useRouter();

async function loadData() {
    try {
        loading.value = true;
        const data = await User.me();
        user.value = data.user;
    } catch (error) {
        console.log('error get user ', error);
    } finally {
        loading.value = false;
    }
}

onMounted(async () => {
    await loadData();
});

const onSuccess = () => {
    showPasswordForm.value = false;
    authStore().logout();
    router.replace('/login');
};
</script>
<style lang=""></style>
