import ApiCrud from './ApiCrud';

class KomisariatActivities extends ApiCrud {
    constructor() {
        super('komisariat/activities');
    }
}
export default new KomisariatActivities();
