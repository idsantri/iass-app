import ApiCrud from './ApiCrud';

class Absence extends ApiCrud {
    constructor() {
        super(`absences`);
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
        const response = await this.fetchAuth(`${this.path}`, {
            method: 'DELETE',
            params: { activity_id: activityId },
        });
        return response.data || true;
    }

    async getSummary(activityId) {
        this.setNotifyGet();
        const response = await this.fetchAuth(`${this.path}/summaries`, {
            method: 'GET',
            params: { activity_id: activityId },
        });
        return response.data || true;
    }
}

export default new Absence();
