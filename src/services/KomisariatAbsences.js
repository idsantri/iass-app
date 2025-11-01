import ApiCrud from './ApiCrud';

class KomisariatAbsences extends ApiCrud {
    constructor() {
        super('komisariat/absences');
    }

    async asyncSetHadir(payload) {
        return this.createAsyncFetch(this.getUrl('hadir'), {
            method: 'POST',
            body: payload,
        });
    }

    async asyncCreateByActivity(activityId) {
        return this.createAsyncFetch(this.getUrl('create'), {
            method: 'POST',
            body: { activity_id: activityId },
        });
    }

    async asyncRemoveByActivity(activityId) {
        return this.createAsyncFetch(this.getUrl(`activities/${activityId}`), {
            method: 'DELETE',
        });
    }

    async asyncGetByActivity(activityId, fetchOptions = {}) {
        return this.createAsyncFetch(this.getUrl(`activities/${activityId}`), {
            method: 'GET',
            ...fetchOptions,
        });
    }

    async asyncGetSummaryByActivity(activityId, fetchOptions = {}) {
        return this.createAsyncFetch(this.getUrl(`activities/${activityId}/summaries`), {
            method: 'GET',
            immediate: true,
            ...fetchOptions,
        });
    }
}

// export default new KomisariatAbsences();
