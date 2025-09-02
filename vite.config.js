import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwindcss from '@tailwindcss/vite';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import manifest from './manifest';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    // const _env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)))
    const env = loadEnv(mode, process.cwd());
    // console.log(_env)

    return {
        plugins: [
            vue({
                template: { transformAssetUrls },
            }),
            vueDevTools(),
            // @quasar/plugin-vite options list:
            // https://github.com/quasarframework/quasar/blob/dev/vite-plugin/index.d.ts
            quasar({
                autoImportComponentCase: 'combined',
                sassVariables: fileURLToPath(
                    new URL('./src/quasar-variables.sass', import.meta.url),
                ),
            }),
            tailwindcss(),
            VitePWA({
                devOptions: {
                    enabled: false, // Aktifkan PWA untuk development
                },
                registerType: 'autoUpdate', // Untuk otomatis memperbarui service worker
                includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'], // Tambahkan aset tambahan
                manifest: {
                    ...manifest,
                    name: env.VITE_APP_LONG_NAME,
                    short_name: env.VITE_APP_SHORT_NAME,
                    description: env.VITE_APP_DESCRIPTION,
                },
            }),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
    };
});
