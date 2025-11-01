import authStore from '@/stores/authStore';
import { useFetch } from '@vueuse/core';
import { computed, watch, ref } from 'vue';
import { notifyError, notifySuccess } from '@/utils/notify';

/**
 * Base API Class
 * Menyediakan dua pendekatan untuk HTTP requests:
 * 1. createUseFetch() - Reactive state dengan useFetch (untuk GET operations)
 * 2. createFetch() - Promise-based dengan fetch JS (untuk Form operations)
 */
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

    // ============================================
    // REACTIVE APPROACH - useFetch (VueUse)
    // ============================================

    /**
     * Create reactive fetch instance dengan useFetch
     *
     * 🎯 GUNAKAN UNTUK:
     * - GET operations yang auto-load (list, detail)
     * - Data yang perlu reactive/real-time updates
     * - Operations dengan loading state yang complex
     *
     * ❌ JANGAN GUNAKAN UNTUK:
     * - Form submissions (create/update)
     * - Delete operations dengan confirmation
     * - Operations yang butuh data fresh saat execute
     *
     * @param {string} url - Full URL atau relative path
     * @param {object} fetchOptions
     * @param {string} fetchOptions.method - HTTP method (default: 'GET')
     * @param {object} fetchOptions.headers - Custom headers
     * @param {boolean} fetchOptions.immediate - Execute immediately (default: true)
     * @param {boolean} fetchOptions.sMessage - Show success message (default: true)
     * @param {boolean} fetchOptions.eMessage - Show error message (default: true)
     * @param {boolean} fetchOptions.resetDataOnRequest - Reset data to null before fetch (default: false)
     * @param {object} fetchOptions.body - Request body
     * @returns {object} Reactive fetch state { data, loading, error, execute, ... }
     *
     * @example
     * // Auto-load data saat component mount
     * const { data, loading } = service.useGetAll();
     *
     * @example
     * // Manual trigger dengan immediate: false
     * const { data, execute, loading } = service.useGetById(id, { immediate: false });
     * await execute();
     */
    createUseFetch(url, fetchOptions = {}) {
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
            isFinished,
            error,
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
                    const responseJson = await response.value.json();
                    errorMessage.value = responseJson.message || 'Terjadi kesalahan pada server';
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
            isFinished,
            error,
            execute,
            response,
        };
    }

    // ============================================
    // IMPERATIVE APPROACH - Native Fetch
    // ============================================

    /**
     * Create promise-based fetch dengan native Fetch API
     *
     * 🎯 GUNAKAN UNTUK:
     * - Form submissions (create/update/delete)
     * - Operations yang butuh confirmation
     * - Operations yang butuh data fresh saat execute
     * - Sequential operations dengan clear flow
     *
     * ❌ JANGAN GUNAKAN UNTUK:
     * - Auto-load data saat component mount
     * - Operations yang butuh reactive state
     *
     * @param {string} url - Full URL atau relative path
     * @param {object} fetchOptions
     * @param {string} fetchOptions.method - HTTP method (default: 'GET')
     * @param {object} fetchOptions.headers - Custom headers
     * @param {object} fetchOptions.body - Request body (akan di-JSON.stringify otomatis)
     * @param {boolean} fetchOptions.sMessage - Show success message (default: true)
     * @param {boolean} fetchOptions.eMessage - Show error message (default: true)
     * @returns {Promise<object>} Response data
     * @throws {Error} Dengan message dari server atau default error message
     *
     * @example
     * // Form submission dengan error handling
     * try {
     *   loading.value = true;
     *   const data = await service.asyncCreate(formData);
     *   console.log(data);
     * } catch (error) {
     *   console.error(error.message); // Error sudah ditampilkan sebagai toast
     * } finally {
     *   loading.value = false;
     * }
     *
     * @example
     * // Silent operation (tanpa notifikasi)
     * const result = await service.asyncCreate(data, {
     *   sMessage: false,
     *   eMessage: false
     * });
     */
    async createAsyncFetch(url, fetchOptions = {}) {
        const options = {
            method: 'GET',
            headers: this.getHeaders(),
            body: null,
            sMessage: true,
            eMessage: true,
            ...fetchOptions,
        };

        // Jika url tidak dimulai dengan http, anggap sebagai relative path
        const fullUrl = url.startsWith('http') ? url : `${this.getBaseUrl()}${url}`;

        try {
            const fetchConfig = {
                method: options.method,
                headers: options.headers,
            };

            // Tambahkan body jika ada (kecuali untuk GET/HEAD)
            if (options.body && !['GET', 'HEAD'].includes(options.method.toUpperCase())) {
                fetchConfig.body = JSON.stringify(options.body);
            }

            const response = await fetch(fullUrl, fetchConfig);
            const result = await response.json();

            // Handle ERROR response (status 4xx, 5xx)
            if (!response.ok) {
                const errorMessage = result.message || `HTTP Error: ${response.status}`;

                if (options.eMessage) {
                    notifyError(errorMessage);
                }

                throw new Error(errorMessage);
            }

            // Handle SUCCESS response (status 2xx)
            if (options.sMessage && result.message) {
                notifySuccess(result.message);
            }

            return result.data || true;
        } catch (error) {
            // Handle network error atau error lainnya
            if (
                error.message.includes('Failed to fetch') ||
                error.message.includes('NetworkError')
            ) {
                const networkError = 'Gagal terhubung ke server';

                if (options.eMessage) {
                    notifyError(networkError);
                }

                throw new Error(networkError);
            }

            // Re-throw error yang sudah dihandle di atas
            throw error;
        }
    }
}
