import ApiCrud from './ApiCrud';

class List extends ApiCrud {
    constructor(path) {
        super(path);
        this.path = 'lists';
    }

    async getByKey(key) {
        this.setNotifyGet();
        const response = await this.fetchGuest(`${this.path}/${key}`, { method: 'GET' });
        return response.data || true;
    }
}

export default new List();
