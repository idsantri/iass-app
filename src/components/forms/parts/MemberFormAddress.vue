<template lang="">
    <q-select
        dense
        hint=""
        class="q-my-sm"
        outlined
        label="Provinsi"
        emit-value
        map-options
        v-model="inputs.provinsi"
        :options="listsProvinsi"
        :loading="loadingProvinsi"
        behavior="menu"
        clearable
        readonly
    >
        <template v-slot:after>
            <q-btn dense flat icon="sync" @click="fetchProvinsi()" disable />
        </template>
    </q-select>

    <q-select
        dense
        hint=""
        class="q-my-sm"
        outlined
        label="Kabupaten/Kota"
        emit-value
        map-options
        v-model="inputs.kabupaten"
        :options="listsKabupaten"
        :loading="loadingKabupaten"
        behavior="menu"
        clearable
        readonly
    >
        <template v-slot:after>
            <q-btn dense flat icon="sync" @click="fetchKabupaten()" disable />
        </template>
    </q-select>

    <q-select
        dense
        hint=""
        class="q-my-sm"
        outlined
        label="Kecamatan"
        emit-value
        map-options
        v-model="inputs.kecamatan"
        :options="listsKecamatan"
        :loading="loadingKecamatan"
        behavior="menu"
        clearable
    >
        <template v-slot:after>
            <q-btn dense flat icon="sync" class="block" @click="fetchKecamatan()" />
        </template>
    </q-select>

    <q-select
        dense
        hint=""
        class="q-my-sm"
        outlined
        label="Desa/Keluarahan"
        emit-value
        map-options
        v-model="inputs.desa"
        :options="listsDesa"
        :loading="loadingDesa"
        use-input=""
        new-value-mode="add"
        behavior="menu"
        clearable
    >
        <template v-slot:after>
            <q-btn dense flat icon="sync" @click="fetchDesa()" />
        </template>
    </q-select>

    <div class="row">
        <q-input
            dense
            hint=""
            class="q-my-sm col q-mr-sm"
            outlined
            label="RT"
            v-model="inputs.rt"
            type="number"
        />

        <q-input
            dense
            hint=""
            class="q-my-sm col q-ml-sm"
            outlined
            label="RW"
            v-model="inputs.rw"
            type="number"
        />
    </div>

    <q-input
        dense
        hint="Dusun, kampung, jalan, gang, nomor rumah ..."
        class="q-my-sm"
        outlined
        label="Dusun"
        v-model="inputs.jl"
        autogrow=""
    />

    <q-input
        dense
        hint=""
        class="q-my-sm"
        outlined
        label="Kode Pos"
        v-model="inputs.kode_pos"
        :rules="[(val) => !val || (val?.length == 5 && !isNaN(val)) || '5 digit angka!']"
        error-color="negative"
    />
</template>
<script setup>
import { onMounted, ref, watch } from 'vue';
import addressStore from '@/stores/addressStore';
import Address from '@/models/Address';

const alamat = addressStore();
const inputs = defineModel();
const listsProvinsi = ref([]);
const listsKabupaten = ref([]);
const listsKecamatan = ref([]);
const listsDesa = ref([]);
const loadingProvinsi = ref(false);
const loadingKabupaten = ref(false);
const loadingKecamatan = ref(false);
const loadingDesa = ref(false);

onMounted(async () => {
    await checkProvinsi();
    if (inputs.value.provinsi) {
        await checkKabupaten(inputs.value.provinsi);
    }
    if (inputs.value.provinsi && inputs.value.kabupaten) {
        await checkKecamatan(inputs.value.provinsi, inputs.value.kabupaten);
    }
    if (inputs.value.provinsi && inputs.value.kabupaten && inputs.value.kecamatan) {
        await checkDesa(inputs.value.provinsi, inputs.value.kabupaten, inputs.value.kecamatan);
    }
});

function arrayAlamat(arr, alamat) {
    if (!Array.isArray(arr) || !alamat) {
        return [];
    }
    const result = arr.map((i) => {
        return i[alamat];
    });
    return result.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
}

async function fetchProvinsi() {
    listsProvinsi.value = [];
    try {
        loadingProvinsi.value = true;
        const data = await Address.searchByParams();
        if (data) {
            alamat.setProvinsi(data.provinsi);
            const provinsi = alamat.getProvinsi();
            listsProvinsi.value = arrayAlamat(provinsi, 'provinsi');
        }
    } catch (error) {
        console.log('error get provinsi ', error);
    } finally {
        loadingProvinsi.value = false;
    }
}

async function checkProvinsi() {
    listsProvinsi.value = [];
    const provinsi = alamat.getProvinsi();
    if (provinsi?.length > 0) {
        listsProvinsi.value = arrayAlamat(provinsi, 'provinsi');
    } else {
        await fetchProvinsi();
    }
}

async function fetchKabupaten() {
    listsKabupaten.value = [];
    const provinsi = inputs.value.provinsi;
    if (!provinsi) return;

    try {
        loadingKabupaten.value = true;
        const data = await Address.searchByParams({ provinsi });
        if (data) {
            alamat.setKabupaten(data.kabupaten, { provinsi_name: provinsi });
            const kabupaten = alamat.getKabupaten({ provinsi_name: provinsi });
            listsKabupaten.value = arrayAlamat(kabupaten, 'kabupaten');
        }
    } catch (error) {
        console.log('error get kabupaten ', error);
    } finally {
        loadingKabupaten.value = false;
    }
}

async function checkKabupaten(provinsi_name) {
    listsKabupaten.value = [];
    if (!provinsi_name) return;

    const kabupaten = alamat.getKabupaten({ provinsi_name });
    if (kabupaten?.length > 0) {
        listsKabupaten.value = arrayAlamat(kabupaten, 'kabupaten');
    } else {
        await fetchKabupaten(provinsi_name);
    }
}

async function fetchKecamatan() {
    listsKecamatan.value = [];
    const provinsi = inputs.value.provinsi;
    const kabupaten = inputs.value.kabupaten;
    if (!provinsi || !kabupaten) return;

    try {
        loadingKecamatan.value = true;
        const data = await Address.searchByParams({ provinsi, kabupaten });
        if (data) {
            alamat.setKecamatan(data.kecamatan, {
                provinsi_name: provinsi,
                kabupaten_name: kabupaten,
            });
            const kecamatan = alamat.getKecamatan({
                provinsi_name: provinsi,
                kabupaten_name: kabupaten,
            });
            listsKecamatan.value = arrayAlamat(kecamatan, 'kecamatan');
        }
    } catch (error) {
        console.log('error get kecamatan ', error);
    } finally {
        loadingKecamatan.value = false;
    }
}

async function checkKecamatan(provinsi_name, kabupaten_name) {
    listsKecamatan.value = [];
    if (!provinsi_name || !kabupaten_name) return;

    const kecamatan = alamat.getKecamatan({ provinsi_name, kabupaten_name });
    if (kecamatan?.length > 0) {
        listsKecamatan.value = arrayAlamat(kecamatan, 'kecamatan');
    } else {
        await fetchKecamatan(provinsi_name, kabupaten_name);
    }
}

async function fetchDesa() {
    listsDesa.value = [];
    const provinsi = inputs.value.provinsi;
    const kabupaten = inputs.value.kabupaten;
    const kecamatan = inputs.value.kecamatan;
    if (!provinsi || !kabupaten || !kecamatan) return;

    try {
        loadingDesa.value = true;
        const data = await Address.searchByParams({ provinsi, kabupaten, kecamatan });
        if (data) {
            alamat.setDesa(data.desa, {
                provinsi_name: provinsi,
                kabupaten_name: kabupaten,
                kecamatan_name: kecamatan,
            });
            const desa = alamat.getDesa({
                provinsi_name: provinsi,
                kabupaten_name: kabupaten,
                kecamatan_name: kecamatan,
            });
            listsDesa.value = arrayAlamat(desa, 'desa');
        }
    } catch (error) {
        console.log('error get desa ', error);
    } finally {
        loadingDesa.value = false;
    }
}

async function checkDesa(provinsi_name, kabupaten_name, kecamatan_name) {
    listsDesa.value = [];
    if (!provinsi_name || !kabupaten_name || !kecamatan_name) return;

    const desa = alamat.getDesa({
        provinsi_name,
        kabupaten_name,
        kecamatan_name,
    });
    if (desa?.length > 0) {
        listsDesa.value = arrayAlamat(desa, 'desa');
    } else {
        await fetchDesa(provinsi_name, kabupaten_name, kecamatan_name);
    }
}

watch(
    () => inputs.value.provinsi,
    async (newProvinsi, oldProvinsi) => {
        if (newProvinsi != oldProvinsi) {
            inputs.value.kabupaten = '';
            inputs.value.kecamatan = '';
            inputs.value.desa = '';
            await checkKabupaten(newProvinsi);
        }
    },
);

watch(
    () => inputs.value.kabupaten,
    async (newValue, oldValue) => {
        console.log('watch kab');
        if (newValue != oldValue) {
            inputs.value.kecamatan = '';
            inputs.value.desa = '';
            await checkKecamatan(inputs.value.provinsi, newValue);
        }
    },
);

watch(
    () => inputs.value.kecamatan,
    async (newValue, oldValue) => {
        if (newValue != oldValue) {
            inputs.value.desa = '';
            await checkDesa(inputs.value.provinsi, inputs.value.kabupaten, newValue);
        }
    },
);
</script>

<style lang=""></style>
