import ApiCrud from './ApiCrud';

class BaseActivities extends ApiCrud {
    constructor(prefix) {
        super(`${prefix}/activities`);
    }
}

class BansusActivities extends BaseActivities {
    constructor() {
        super('bansus');
    }
}

class WilayahActivities extends BaseActivities {
    constructor() {
        super('wilayah');
    }
}
class KomisariatActivities extends BaseActivities {
    constructor() {
        super('komisariat');
    }
}

const Activity = {
    Wilayah: new WilayahActivities(),
    Bansus: new BansusActivities(),
    Komisariat: new KomisariatActivities(),
};
export default Activity;
