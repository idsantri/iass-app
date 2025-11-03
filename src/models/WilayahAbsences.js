import ApiCrud from './ApiCrud';

class WilayahAbsences extends ApiCrud {
    constructor() {
        super('wilayah/absences');
    }

    async setHadir(data) {
        this.setNotify(true);
        const response = await this.fetchAuth(`${this.path}/hadir`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.data || true;
    }

    async createByActivity(activityId) {
        this.setNotify(true);
        const response = await this.fetchAuth(`${this.path}/create`, {
            method: 'POST',
            body: JSON.stringify({ activity_id: activityId }),
        });
        return response.data || true;
    }

    async removeByActivity(activityId) {
        this.setNotify(true);
        const response = await this.fetchAuth(`${this.path}/activities/${activityId}`, {
            method: 'DELETE',
        });
        return response.data || true;
    }

    async getByActivity(activityId) {
        this.setNotifyGet();
        const response = await this.fetchAuth(`${this.path}/activities/${activityId}`, {
            method: 'GET',
        });
        return response.data || true;
    }

    async getSummaryByActivity(activityId) {
        this.setNotifyGet();
        const response = await this.fetchAuth(`${this.path}/activities/${activityId}/summaries`, {
            method: 'GET',
        });
        return response.data || true;
    }
}
export default new WilayahAbsences();
