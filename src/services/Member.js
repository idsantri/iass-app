import ApiCrud from './ApiCrud';

class Member extends ApiCrud {
    constructor() {
        super('members');
    }

    /**
     * Get members by activity ID
     * @param {string|number} activityId - Activity ID
     * @param {object} fetchOptions - Fetch options
     * @returns {object} Reactive fetch state
     */
    getMembersByActivityId(activityId, fetchOptions = {}) {
        return this.createFetch(this.getUrl(`activity/${activityId}`), {
            method: 'GET',
            immediate: true,
            ...fetchOptions,
        });
    }
}

export default new Member();
