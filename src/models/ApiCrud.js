import Api from './Api';

class ApiCrud extends Api {
    constructor(path) {
        super();
        this.defaultConfig();
        this.path = path;
    }

    async getAll(params = null) {
        this.setNotifyGet();
        const response = await this.fetchAuth(this.path, {
            method: 'GET',
            params,
        });
        return response.data || true;
    }

    async getById(id, params = null) {
        this.setNotifyGet();
        const response = await this.fetchAuth(`${this.path}/${id}`, {
            method: 'GET',
            params,
        });
        return response.data || true;
    }

    async create(data, params = null) {
        this.setNotify(true);
        const response = await this.fetchAuth(this.path, {
            method: 'POST',
            body: JSON.stringify(data),
            params,
        });
        return response.data || true;
    }

    async update(id, data, params = null) {
        this.setNotify(true);
        const response = await this.fetchAuth(`${this.path}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            params,
        });
        return response.data || true;
    }

    async remove(id, params = null) {
        this.setNotify(true);
        const response = await this.fetchAuth(`${this.path}/${id}`, {
            method: 'DELETE',
            params,
        });
        return response.data || true;
    }
}
export default ApiCrud;
