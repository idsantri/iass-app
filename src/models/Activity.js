import ApiCrud from './ApiCrud';

class BaseActivities extends ApiCrud {
    constructor(instance) {
        super(`${instance}/activities`);
    }
}

export default class Activity {
    static Wilayah = new BaseActivities('wilayah');
    static Bansus = new BaseActivities('bansus');
    static Komisariat = new BaseActivities('komisariat');
}
