import ApiCrud from './ApiCrud';

class Member extends ApiCrud {
    constructor(path) {
        super(path);
        this.path = 'members';
    }

    getMembersByActivityId(activityId) {
        // url = `${this.path}/activity/${activityId}
    }
}
export default new Member();
