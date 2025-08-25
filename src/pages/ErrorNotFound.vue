<template>
    <div class="fullscreen bg-orange text-orange-1 text-center q-pa-md flex flex-center">
        <div>
            <div style="font-size: 10vh">404</div>

            <div class="text-h2" style="opacity: 0.4">Oops. Salah alamat …</div>

            <q-btn
                class="q-mt-xl"
                color="orange-1"
                text-color="orange"
                unelevated
                @click="$router.go(-1)"
                label="Kembali"
                no-caps
            />
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ErrorNotFound',
});
</script>
