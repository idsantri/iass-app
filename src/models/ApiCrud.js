import Api from './Api';

class ApiCrud extends Api {
    constructor(path) {
        super();
        this.defaultConfig();
        this.path = path;
    }

    async getAll(params) {
        this.setNotifyGet();
        const response = await this.fetchAuth(this.path, {
            method: 'GET',
            params,
        });
        return response.data || true;
    }

    async getById(id) {
        this.setNotifyGet();
        const response = await this.fetchAuth(`${this.path}/${id}`, {
            method: 'GET',
        });
        return response.data || true;
    }

    async create(data) {
        this.setNotify(true);
        const response = await this.fetchAuth(this.path, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.data || true;
    }

    async update(id, data) {
        this.setNotify(true);
        const response = await this.fetchAuth(`${this.path}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response.data || true;
    }

    async remove(id) {
        this.setNotify(true);
        const response = await this.fetchAuth(`${this.path}/${id}`, {
            method: 'DELETE',
        });
        return response.data || true;
    }
}
export default ApiCrud;
