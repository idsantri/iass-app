import Api from './Api';

class AbsenceNks extends Api {
    constructor() {
        super();
        this.setNotifyGet();
        this.path = 'absence-nks';
    }

    async byMember(params) {
        const response = await this.fetchAuth(`${this.path}/by-member`, {
            method: 'GET',
            params,
        });
        return response.data || true;
    }

    async byKomisariat(params) {
        const response = await this.fetchAuth(`${this.path}/by-komisariat`, {
            method: 'GET',
            params,
        });
        return response.data || true;
    }
}

export default new AbsenceNks();
