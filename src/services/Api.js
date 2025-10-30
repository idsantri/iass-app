import authStore from '@/stores/authStore';
import { useFetch } from '@vueuse/core';
import { computed, watch, ref } from 'vue';
import { notifyError, notifySuccess } from '@/utils/notify';

export default class Api {
    constructor() {
        this.baseUrl = import.meta.env.VITE_BASE_API + import.meta.env.VITE_END_API;
        this.token = null;
    }

    setToken(token) {
        this.token = token;
    }

    getToken() {
        return authStore().token || null;
    }

    removeToken() {
        this.token = null;
        authStore().logout();
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    getBaseUrl() {
        return this.baseUrl;
    }

    setBaseUrl(url) {
        this.baseUrl = url;
    }

    /**
     * Create fetch instance dengan reactive state
     * @param {string} url - Full URL atau relative path
     * @param {object} fetchOptions
     * @param {string} fetchOptions.method - HTTP method (default: 'GET')
     * @param {object} fetchOptions.headers - Custom headers
     * @param {boolean} fetchOptions.immediate - Execute immediately (default: true)
     * @param {boolean} fetchOptions.sMessage - Show success message (default: true)
     * @param {boolean} fetchOptions.eMessage - Show error message (default: true)
     * @param {boolean} fetchOptions.resetDataOnRequest - Reset data to null before fetch (default: false)
     * @param {object} fetchOptions.body - Request body
     * @returns {object} Reactive fetch state
     */
    createFetch(url, fetchOptions = {}) {
        const options = {
            immediate: true,
            sMessage: true,
            eMessage: true,
            resetDataOnRequest: false,
            method: 'GET',
            headers: this.getHeaders(),
            ...fetchOptions,
        };

        // Jika url tidak dimulai dengan http, anggap sebagai relative path
        const fullUrl = url.startsWith('http') ? url : `${this.getBaseUrl()}${url}`;

        const errorMessage = ref(null);
        const successMessage = ref(null);

        const {
            data: dataFetch,
            isFetching,
            response,
            execute,
            onFetchResponse,
            onFetchError,
        } = useFetch(
            fullUrl,
            {
                method: options.method,
                headers: options.headers,
                body: options.body ? JSON.stringify(options.body) : undefined,
            },
            { immediate: options.immediate },
        ).json();

        // Reset messages dan data (jika diaktifkan) ketika fetch mulai
        watch(isFetching, (fetching) => {
            if (fetching) {
                errorMessage.value = null;
                successMessage.value = null;

                // Reset data jika resetDataOnRequest aktif
                if (options.resetDataOnRequest) {
                    dataFetch.value = null;
                }
            }
        });

        // Handle SUCCESS response
        onFetchResponse(() => {
            successMessage.value = dataFetch.value?.message;
            if (options.sMessage && successMessage.value) {
                notifySuccess(successMessage.value);
            }
        });

        // Handle ERROR response
        onFetchError(async () => {
            errorMessage.value = 'Gagal terhubung ke server';

            // Ambil message dari server hanya jika response valid
            if (response.value && response.value.status > 0) {
                try {
                    const res = await response.value.json();
                    errorMessage.value = res.message || 'Terjadi kesalahan pada server';
                } catch (_e) {
                    errorMessage.value = 'Terjadi kesalahan pada server';
                }
            }

            if (options.eMessage) {
                notifyError(errorMessage.value);
            }
        });

        const data = computed(() => dataFetch.value?.data || null);

        return {
            successMessage,
            errorMessage,
            data,
            isFetching,
            loading: isFetching,
            execute,
            response,
        };
    }
}
