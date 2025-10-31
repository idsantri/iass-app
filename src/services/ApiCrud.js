import Api from './Api';

export default class ApiCrud extends Api {
    constructor(path) {
        super();
        this.path = path;
    }

    /**
     * Helper untuk mendapatkan URL endpoint
     * @param {string} endpoint - Endpoint spesifik (misal: ID)
     * @returns {string} URL lengkap
     */
    getUrl(endpoint = '') {
        const path = endpoint ? `${this.path}/${endpoint}` : this.path;
        return path;
    }

    // ============================================
    // REACTIVE APPROACH - useFetch (VueUse)
    // ============================================

    /**
     * Get all data dengan reactive state
     * @param {object} params - Query parameters
     * @param {object} fetchOptions - Fetch options
     * @returns {object} Reactive fetch state
     */
    useGetAll(params = {}, fetchOptions = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `${this.getUrl()}?${queryString}` : this.getUrl();

        return this.createUseFetch(endpoint, {
            method: 'GET',
            immediate: true,
            ...fetchOptions,
        });
    }

    /**
     * Get data by ID dengan reactive state
     * @param {string|number} id - Resource ID
     * @param {object} fetchOptions - Fetch options
     * @returns {object} Reactive fetch state
     */
    useGetById(id, fetchOptions = {}) {
        return this.createUseFetch(this.getUrl(id.toString()), {
            method: 'GET',
            immediate: true,
            ...fetchOptions,
        });
    }

    /**
     * (Reactive) Create new data.
     * Mengembalikan instance useFetch yang bisa dieksekusi manual.
     * Direkomendasikan menggunakan asyncCreate untuk form.
     * @param {object} payload - Request body
     * @param {object} fetchOptions - Fetch options
     * @returns {object} Reactive fetch state
     */
    useCreate(payload, fetchOptions = {}) {
        return this.createUseFetch(this.getUrl(), {
            method: 'POST',
            body: payload,
            immediate: false,
            ...fetchOptions,
        });
    }

    /**
     * (Reactive) Update existing data.
     * Mengembalikan instance useFetch yang bisa dieksekusi manual.
     * Direkomendasikan menggunakan asyncUpdate untuk form.
     * @param {string|number} id - Resource ID
     * @param {object} payload - Request body
     * @param {object} fetchOptions - Fetch options
     * @returns {object} Reactive fetch state
     */
    useUpdate(id, payload, fetchOptions = {}) {
        return this.createUseFetch(this.getUrl(id.toString()), {
            method: 'PUT',
            body: payload,
            immediate: false,
            ...fetchOptions,
        });
    }

    /**
     * (Reactive) Delete data.
     * Mengembalikan instance useFetch yang bisa dieksekusi manual.
     * Direkomendasikan menggunakan asyncRemove untuk form.
     * @param {string|number} id - Resource ID
     * @param {object} fetchOptions - Fetch options
     * @returns {object} Reactive fetch state
     */
    useRemove(id, fetchOptions = {}) {
        return this.createUseFetch(this.getUrl(id.toString()), {
            method: 'DELETE',
            immediate: false,
            ...fetchOptions,
        });
    }

    // ============================================
    // IMPERATIVE APPROACH - Native Fetch (Async/Await)
    // ============================================

    /**
     * (Async) Get all data
     * @param {object} params - Query parameters
     * @param {object} fetchOptions - Fetch options
     * @returns {Promise<object>} Response data
     */
    async asyncGetAll(params = {}, fetchOptions = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `${this.getUrl()}?${queryString}` : this.getUrl();

        return this.createFetch(endpoint, {
            method: 'GET',
            ...fetchOptions,
        });
    }

    /**
     * (Async) Get data by ID
     * @param {string|number} id - Resource ID
     * @param {object} fetchOptions - Fetch options
     * @returns {Promise<object>} Response data
     */
    async asyncGetById(id, fetchOptions = {}) {
        return this.createFetch(this.getUrl(id.toString()), {
            method: 'GET',
            ...fetchOptions,
        });
    }

    /**
     * (Async) Create new data
     * @param {object} payload - Request body
     * @param {object} fetchOptions - Fetch options
     * @returns {Promise<object>} Response data
     */
    async asyncCreate(payload, fetchOptions = {}) {
        // Validasi payload
        if (!payload || typeof payload !== 'object') {
            throw new Error('Payload harus berupa object');
        }

        return this.createFetch(this.getUrl(), {
            method: 'POST',
            body: payload,
            ...fetchOptions,
        });
    }

    /**
     * (Async) Update existing data
     * @param {string|number} id - Resource ID
     * @param {object} payload - Request body
     * @param {object} fetchOptions - Fetch options
     * @returns {Promise<object>} Response data
     */
    async asyncUpdate(id, payload, fetchOptions = {}) {
        if (!id && id !== 0) {
            throw new Error('ID diperlukan untuk update');
        }
        if (!payload || typeof payload !== 'object') {
            throw new Error('Payload harus berupa object');
        }

        return this.createFetch(this.getUrl(id.toString()), {
            method: 'PUT',
            body: payload,
            ...fetchOptions,
        });
    }

    /**
     * (Async) Delete data
     * @param {string|number} id - Resource ID
     * @param {object} fetchOptions - Fetch options
     * @returns {Promise<object>} Response data
     */
    async asyncRemove(id, fetchOptions = {}) {
        if (!id && id !== 0) {
            throw new Error('ID diperlukan untuk delete');
        }
        return this.createFetch(this.getUrl(id.toString()), {
            method: 'DELETE',
            ...fetchOptions,
        });
    }
}
