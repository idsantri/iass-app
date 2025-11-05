<template>
    <q-card>
        <CardHeader title="Input Auto Complete" :show-reload="false" />
        <QCardSection class="q-pa-sm" style="max-width: 600px">
            <QCard bordered flat>
                <QCardSection class="q-pa-sm">
                    <q-select
                        class="q-mb-sm"
                        dense
                        outlined
                        label="Pilih List"
                        v-model="listModel"
                        :options="options"
                        emit-value
                        map-options
                        @update:model-value="(v) => routerPush(v)"
                        behavior="menu"
                    />
                    <q-card v-if="listModel" class="" flat bordered>
                        <router-view :key="$route.fullPath" />
                    </q-card>
                    <q-card v-else class="" flat bordered>
                        <q-card-section
                            class="bg-orange-1 text-center text-italic text-subtitle1 q-pa-lg"
                        >
                            Silakan pilih lists yang tersedia!
                        </q-card-section>
                    </q-card>
                </QCardSection>
            </QCard>
        </QCardSection>
    </q-card>
    <!-- <pre>list model:{{ listModel }}</pre> -->
    <!-- <pre>list data:{{ listData }}</pre> -->
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import listsStore from '@/stores/listsStore';
import CardHeader from '@/components/cards/CardHeader.vue';

const router = useRouter();
const { params } = useRoute();
const listKey = params.listKey;

const { listData } = listsStore();
const listModel = ref(listData.find(({ url }) => url == listKey));
const options = ref([]);

/**
 * JANGAN tampilkan tingkat pendidikan
 * filter lists
 **/
onMounted(() => {
    options.value = listData.filter((item) => item.protected == false);
});

function routerPush(list) {
    router.push(`/settings/lists/${list.url}`);
}
</script>
