import ApiCrud from './ApiCrud';

class Activity extends ApiCrud {
    constructor() {
        super('activities');
    }
}

export default new Activity();
