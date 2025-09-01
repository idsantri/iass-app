import ApiCrud from './ApiCrud';

class NksAbsence extends ApiCrud {
    constructor(path) {
        super(path);
        this.path = 'nks-absences';
    }

    async createByNks(data) {
        this.setNotify(true);
        const response = await this.fetchAuth(`${this.path}/create`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.data || true;
    }

    async hadir(data) {
        this.setNotify(true);
        const response = await this.fetchAuth(`${this.path}/hadir`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.data || true;
    }

    async removeByNks(nksId) {
        this.setNotify(true);
        const response = await this.fetchAuth(`${this.path}/nks/${nksId}`, {
            method: 'DELETE',
        });
        return response.data || true;
    }

    async byNks(nksId) {
        this.setNotifyGet();
        const response = await this.fetchAuth(`${this.path}/nks/${nksId}`, {
            method: 'GET',
        });
        return response.data || true;
    }

    async reportByNks(nksId) {
        this.setNotifyGet();
        const response = await this.fetchAuth(`${this.path}/nks/${nksId}/report`, {
            method: 'GET',
        });
        return response.data || true;
    }
}
export default new NksAbsence();
