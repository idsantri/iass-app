import ApiCrud from './ApiCrud';

class WilayahActivities extends ApiCrud {
    constructor() {
        super('wilayah/activities');
    }
}
export default new WilayahActivities();
