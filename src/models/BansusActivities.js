import ApiCrud from './ApiCrud';

class BansusActivities extends ApiCrud {
    constructor() {
        super('bansus/activities');
    }
}
export default new BansusActivities();
