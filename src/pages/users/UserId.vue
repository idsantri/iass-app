<template lang="">
    <q-card class="" style="max-width: 600px">
        <CardHeader
            title="Detail Pengguna"
            @on-reload="loadData"
            :show-edit="true"
            @on-edit="dialog = true"
        >
        </CardHeader>

        <q-card-section class="q-pa-sm relative-position">
            <LoadingAbsolute v-if="loading" />
            <q-markup-table flat bordered>
                <tbody>
                    <tr>
                        <td class="text-italic text-caption q-pr-sm">Nama</td>
                        <td>{{ user.name }}</td>
                    </tr>
                    <!-- <tr>
                        <td class="text-italic text-caption q-pr-sm">Email</td>
                        <td>{{ user.email }}</td>
                    </tr> -->
                    <tr>
                        <td class="text-italic text-caption q-pr-sm">Username</td>
                        <td>{{ user.username }}</td>
                    </tr>
                    <tr>
                        <td class="text-italic text-caption q-pr-sm">Komisariat</td>
                        <td>{{ user.komisariat }}</td>
                    </tr>
                </tbody>
            </q-markup-table>
            <q-list bordered separator class="q-mt-sm">
                <q-item class="q-pa-sm">
                    <q-item-section>
                        <q-item-label overline> Password </q-item-label>
                        <q-item-label v-if="user">
                            <q-toggle
                                v-model="user.must_change_password"
                                color="orange"
                                label="Harus ganti password"
                                @click="setChangePassword"
                                :true-value="1"
                                :false-value="0"
                            />
                        </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <QBtn
                            icon="key"
                            label="Atur Password"
                            no-caps
                            outline
                            @click="inputPassword = !inputPassword"
                        />
                    </q-item-section>
                </q-item>
                <q-item v-if="inputPassword" class="q-pa-sm">
                    <q-item-section>
                        <q-item-label overline> Password </q-item-label>
                        <q-item-label v-if="user">
                            <q-input dense outlined v-model="password">
                                <template v-slot:after>
                                    <QBtn
                                        icon="save"
                                        outline
                                        label="Simpan"
                                        no-caps
                                        @click="setPassword"
                                    />
                                </template>
                            </q-input>
                        </q-item-label>
                    </q-item-section>
                </q-item>

                <q-item class="q-pa-sm">
                    <q-item-section>
                        <q-item-label overline> User Group (Role) </q-item-label>
                        <q-item-label v-if="user">
                            <div class="fit row wrap justify-start items-start content-start">
                                <div v-for="(item, index) in user.roles" :key="index" class="col-6">
                                    <q-toggle
                                        :model-value="item.value"
                                        color="orange"
                                        :label="item.label"
                                        @update:model-value="setRole(item, index)"
                                        :true-value="true"
                                        :false-value="false"
                                    />
                                </div>
                            </div>
                        </q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-card-section>
    </q-card>
    <QDialog v-model="dialog">
        <UserForm
            @success-delete="() => $router.go(-1)"
            @success-submit="(res) => Object.assign(user, res)"
            :data="user"
        />
    </QDialog>
    <!-- <pre>
        {{ user }}
    </pre> -->
</template>
<script setup>
import CardHeader from '@/components/cards/CardHeader.vue';
import UserForm from '@/components/forms/UserForm.vue';
import LoadingAbsolute from '@/components/LoadingAbsolute.vue';
import User from '@/models/User';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const user = ref({});
const loading = ref(false);
const { params } = useRoute();
const dialog = ref(false);
const inputPassword = ref(false);
const password = ref('');

async function setRole(role, index) {
    const newRole = !role.value;
    user.value.roles[index].value = newRole;
    const data = { name: role.name, value: newRole };
    try {
        await User.updateRole(user.value.id, data);
    } catch (error) {
        console.log('error update user ', error);

        // rollback
        user.value.roles[index].value = !newRole;
    }
}

const setChangePassword = async () => {
    const set = user.value.must_change_password;
    try {
        await User.update(user.value.id, { must_change_password: set });
    } catch (error) {
        user.value.must_change_password = set ? 0 : 1;
        console.log('error change password', error);
    }
};

const setPassword = async () => {
    if (!password.value) return;
    try {
        loading.value = true;
        const data = await User.update(user.value.id, { password: password.value });
        Object.assign(user.value, data.user);
        password.value = '';
        inputPassword.value = false;
    } catch (error) {
        console.log('error set password', error);
    } finally {
        loading.value = false;
    }
};

async function loadData() {
    try {
        loading.value = true;
        const data = await User.getById(params.id);
        user.value = data.user;
    } catch (error) {
        console.log('error get user by id ', error);
    } finally {
        loading.value = false;
    }
}

onMounted(async () => {
    await loadData();
});
</script>
<style lang=""></style>
