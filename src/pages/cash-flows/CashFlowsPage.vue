<template lang="">
    <CardPage>
        <CardHeader
            :title="titlePage"
            @on-reload="reload"
            :show-add="true"
            @on-add="dialog = true"
        />
        <QCardActions class="q-pa-sm flex items-center justify-between q-gutter-y-sm">
            <q-select
                v-model="accountName"
                :options="optionsList"
                label="Pilih Nama Rekening"
                dense
                outlined
                clearable
                behavior="menu"
                class="full-width"
                style="max-width: 400px"
                :loading="false"
            >
                <template v-slot:after>
                    <q-btn no-caps outline icon="sync" @click="() => {}" class="q-pa-sm" />
                    <q-btn
                        no-caps
                        outline
                        icon="settings"
                        :to="{
                            path: '/accounts',
                            query: {
                                scope: query.scope,
                            },
                        }"
                        class="q-pa-sm"
                    />
                </template>
            </q-select>
            <QInput
                v-model="accountSearch"
                dense
                outlined
                class="full-width"
                style="max-width: 400px"
                type="search"
                clearable
                label="Cari Arus Kas"
            />
        </QCardActions>
        <q-card-section class="q-pa-sm" style="max-width: 1024px"> adf </q-card-section>
    </CardPage>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { toProperCase } from '@/utils/string';
const { query } = useRoute();
const titlePage = 'Data Keuangan ' + toProperCase(query.scope);
const accountSearch = ref('');
const accountName = ref('');
const optionsList = ref([]);

function reload() {}
</script>
<style lang=""></style>
