import Api from './Api';

export default class ApiCrud extends Api {
    constructor(path) {
        super();
        this.path = path;
    }

    getUrl(endpoint = '') {
        const path = endpoint ? `${this.path}/${endpoint}` : this.path;
        return path;
    }

    /**
     * Get all data dengan reactive state
     * @param {object} params - Query parameters
     * @param {object} fetchOptions - Fetch options
     * @returns {object} Reactive fetch state
     */
    getAll(params = {}, fetchOptions = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `${this.getUrl()}?${queryString}` : this.getUrl();

        return this.createFetch(endpoint, {
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
    getById(id, fetchOptions = {}) {
        return this.createFetch(this.getUrl(id.toString()), {
            method: 'GET',
            immediate: true,
            ...fetchOptions,
        });
    }

    /**
     * Create new data
     * @param {object} payload - Request body
     * @param {object} fetchOptions - Fetch options
     * @returns {object} Reactive fetch state
     */
    create(payload, fetchOptions = {}) {
        return this.createFetch(this.getUrl(), {
            method: 'POST',
            body: payload,
            immediate: false,
            ...fetchOptions,
        });
    }

    /**
     * Update existing data
     * @param {string|number} id - Resource ID
     * @param {object} payload - Request body
     * @param {object} fetchOptions - Fetch options
     * @returns {object} Reactive fetch state
     */
    update(id, payload, fetchOptions = {}) {
        return this.createFetch(this.getUrl(id.toString()), {
            method: 'PUT',
            body: payload,
            immediate: false,
            ...fetchOptions,
        });
    }

    /**
     * Delete data
     * @param {string|number} id - Resource ID
     * @param {object} fetchOptions - Fetch options
     * @returns {object} Reactive fetch state
     */
    remove(id, fetchOptions = {}) {
        return this.createFetch(this.getUrl(id.toString()), {
            method: 'DELETE',
            immediate: false,
            ...fetchOptions,
        });
    }
}
