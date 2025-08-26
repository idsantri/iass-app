<template lang="">
    <q-select
        dense
        outlined
        emit-value
        map-options
        :options="options"
        :loading="loading"
        behavior="menu"
        clearable
        :hint="textHint()"
    >
        <template v-slot:after>
            <drop-down-after v-if="btnSetting" :route-to="url" @reload="fetchList" />
        </template>
    </q-select>
</template>
<script setup>
import listsStore from '@/stores/listsStore';
import { onMounted, ref } from 'vue';
import DropDownAfter from './DropDownAfter.vue';
import List from '@/models/List';

const props = defineProps({
    url: {
        type: String,
        require: true,
    },
    sort: {
        type: String,
        default: 'asc',
    },
    selected: {
        type: String,
        default: '',
    },
    btnSetting: {
        type: Boolean,
        default: true,
    },
});

const loading = ref(false);
const options = ref([]);
const store = listsStore();

function textHint() {
    let result = '';
    if (props.selected && props.url == 'tahun-ajaran') {
        const data = store.getByStateName(props.url);
        result = data.find((th) => th.val0 === props.selected)?.val1;
    }
    return result;
}

onMounted(async () => {
    const data = store.getByStateName_arr(props.url);
    if (data.length) {
        options.value = data;
    } else {
        await fetchList();
        options.value = store.getByStateName_arr(props.url);
    }
});

async function fetchList() {
    try {
        loading.value = true;
        const data = await List.getByKey(props.url);
        store.$patch({ [props.url]: data[props.url] });
    } catch (error) {
        console.log('error get list input ', error);
    } finally {
        loading.value = false;
    }
}
</script>
<style lang=""></style>
