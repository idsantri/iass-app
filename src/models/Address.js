import Api from './Api';

class Address extends Api {
    constructor() {
        super();
        this.defaultConfig();
        this.path = 'address';
    }

    async searchByParams(params) {
        this.setNotify({ showSuccess: false, showError: true });
        const response = await this.fetchGuest(this.path, {
            method: 'GET',
            params,
        });
        return response.data || true;
    }

    async searchKabKota(params) {
        this.setNotify({ showSuccess: false, showError: true });
        const response = await this.fetchGuest(`${this.path}/kabupaten-kota`, {
            method: 'GET',
            params,
        });
        return response.data || true;
    }
}
export default new Address();
