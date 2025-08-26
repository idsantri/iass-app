import {
    logErrorDetails,
    logErrorToken,
    logRequestDetails,
    logResponseDetails,
} from './utilities/logger';
import { handleResponseSuccess, handleResponseErrors } from './utilities/handler';
import { notifyError, notifySuccess } from '../utils/notify';
import authStore from '../stores/authStore';

class Api {
    constructor() {
        this.BASE_URL = import.meta.env.VITE_BASE_API + import.meta.env.VITE_END_API;
        this.notifyConfig = {
            showSuccess: true,
            showError: true,
        };
        this.withLog = false;
        this.isTest = import.meta.env.MODE === 'test';
    }

    /**
     * Mengambil token akses dari store.
     * @returns {string|null} Token akses atau null.
     */
    getAccessToken() {
        return authStore().token || null;
    }

    /**
     * Mengatur konfigurasi notifikasi.
     * @param {boolean|object} notify - Nilai boolean atau objek konfigurasi.
     */
    setNotify(notify) {
        if (typeof notify === 'boolean') {
            this.notifyConfig = {
                showSuccess: notify,
                showError: notify,
            };
        } else if (typeof notify === 'object' && notify !== null) {
            // Menggunakan default value jika properti tidak ada atau bukan boolean
            this.notifyConfig = {
                showSuccess: !!notify.showSuccess, // Menggunakan !! untuk konversi ke boolean
                showError: !!notify.showError,
            };
        } else {
            // Default jika input tidak valid
            this.notifyConfig = { showSuccess: true, showError: true };
        }
    }

    setNotifyGet() {
        this.setNotify({ showSuccess: false, showError: true });
    }

    defaultConfig() {
        if (this.isTest) {
            this.setNotify(false);
            this.setLog(true);
        } else {
            this.setNotify(true);
            this.setLog(false);
        }
    }

    /**
     * Mengambil konfigurasi notifikasi.
     * @returns {object} Konfigurasi notifikasi.
     */
    getNotify() {
        return { ...this.notifyConfig };
    }

    /**
     * Mengatur status logging.
     * @param {boolean} value - Status logging.
     */
    setLog(value) {
        this.withLog = !!value;
    }

    /**
     * Mengambil status logging.
     * @returns {boolean} Status logging.
     */
    getLog() {
        return this.withLog;
    }

    /**
     * Membangun query string dari objek params.
     * @param {object} params - Objek parameter.
     * @returns {string} Query string.
     */
    buildQueryString(params) {
        if (!params || typeof params !== 'object') return '';
        const searchParams = new URLSearchParams(
            Object.entries(params).filter(([, value]) => value !== null && value !== undefined),
        );
        const queryString = searchParams.toString();
        return queryString ? `?${queryString}` : '';
    }

    /**
     * Melakukan permintaan fetch.
     * @param {string} fullUrl - URL lengkap.
     * @param {object} options - Opsi fetch.
     * @returns {Promise<Response>} Promise yang menghasilkan objek Response.
     */
    async performFetch(fullUrl, options) {
        const requestStart = Date.now();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const finalOptions = {
            ...options,
            headers: {
                ...options.headers,
                'X-Timezone': timezone,
            },
        };

        if (this.withLog) logRequestDetails(fullUrl, finalOptions);

        try {
            const response = await fetch(fullUrl, finalOptions);
            response.requestStart = requestStart; // Attach requestStart to response
            return response;
        } catch (error) {
            if (this.withLog) logErrorDetails({ error, fullUrl, options: finalOptions });
            if (this.notifyConfig.showError) {
                notifyError('Gagal terhubung ke server');
            }
            throw error;
        }
    }

    /**
     * Mengelola respons API, menangani kesalahan dan parsing data.
     * @param {Response} response - Objek respons fetch.
     * @param {object} options - Opsi fetch yang digunakan.
     * @returns {Promise<object>} Promise yang menghasilkan data JSON.
     */
    async handleApi(response, options) {
        if (!response.ok) {
            await handleResponseErrors(response, this.notifyConfig, this.withLog);
            return; // Menghentikan eksekusi setelah menangani kesalahan
        }

        const responseJson = await handleResponseSuccess(
            response,
            options,
            this.notifyConfig,
            this.withLog,
        );

        if (this.withLog) logResponseDetails(response, responseJson);
        return responseJson;
    }

    /**
     * Mengambil data untuk endpoint tamu (tanpa otentikasi).
     * @param {string} endPoint - Endpoint API.
     * @param {object} options - Opsi fetch.
     * @returns {Promise<object>} Promise yang menghasilkan data JSON.
     */
    async fetchGuest(endPoint, options = {}) {
        const { params, ...fetchOptions } = options;
        fetchOptions.headers = {
            ...options.headers,
            'Content-Type': 'application/json',
        };
        const queryString = this.buildQueryString(params);
        const fullUrl = this.BASE_URL + endPoint + queryString;
        const response = await this.performFetch(fullUrl, fetchOptions);
        return this.handleApi(response, fetchOptions);
    }

    /**
     * Mengambil data untuk endpoint yang memerlukan otentikasi.
     * @param {string} endPoint - Endpoint API.
     * @param {object} options - Opsi fetch.
     * @returns {Promise<object>} Promise yang menghasilkan data JSON.
     */
    async fetchAuth(endPoint, options = {}) {
        const token = this.getAccessToken();
        if (!token) {
            if (this.withLog) logErrorToken(this.BASE_URL + endPoint, options);
            if (this.notifyConfig.showError) {
                notifyError({
                    message: 'Tidak ada token akses yang ditemukan',
                });
            }
            throw new Error('No access token found');
        }

        return this.fetchGuest(endPoint, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            },
        });
    }

    /**
     * Mengambil dan mengunduh file dari endpoint.
     * @param {string} endPoint - Endpoint API.
     * @param {string} fileName - Nama file.
     * @param {object} options - Opsi fetch.
     * @returns {Promise<Blob>} Promise yang menghasilkan objek Blob.
     */
    async fetchFile(endPoint, fileName, options = {}) {
        const { params, ...fetchOptions } = options;
        const queryString = this.buildQueryString(params);
        const fullUrl = this.BASE_URL + endPoint + queryString;

        const token = this.getAccessToken();
        if (token) {
            fetchOptions.headers = {
                ...fetchOptions.headers,
                Authorization: `Bearer ${token}`,
            };
        }

        const response = await this.performFetch(fullUrl, fetchOptions);
        if (!response.ok) {
            await handleResponseErrors(response, this.notifyConfig, this.withLog);
            throw new Error('Failed to fetch file');
        }

        try {
            const responseBlob = await response.blob();
            if (this.withLog) {
                logResponseDetails(response, {
                    message: 'File fetched successfully',
                });
            }
            if (this.notifyConfig.showSuccess) {
                notifySuccess(`File ${fileName} berhasil diunduh`);
            }
            return responseBlob;
        } catch (error) {
            if (this.withLog) {
                logErrorDetails({ error, fullUrl, options: fetchOptions });
            }
            if (this.notifyConfig.showError) {
                notifyError('Gagal memproses file dari server');
            }
            throw error;
        }
    }
}

export default Api;
