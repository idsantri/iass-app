import Api from './Api';

class List extends Api {
    constructor() {
        super();
        this.defaultConfig();
        this.path = 'lists';
    }

    async getByKey(key) {
        this.setNotifyGet();
        const response = await this.fetchGuest(`${this.path}/${key}`, { method: 'GET' });
        return response.data || true;
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

export default new List();
