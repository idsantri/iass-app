import ApiCrud from './ApiCrud';

class BaseNotes extends ApiCrud {
    constructor(prefix) {
        super(`${prefix}/notes`);
    }
}

class BansusNotes extends BaseNotes {
    constructor() {
        super('bansus');
    }
}

class WilayahNotes extends BaseNotes {
    constructor() {
        super('wilayah');
    }
}

class KomisariatNotes extends BaseNotes {
    constructor() {
        super('komisariat');
    }
}

const Note = {
    Wilayah: new WilayahNotes(),
    Bansus: new BansusNotes(),
    Komisariat: new KomisariatNotes(),
};
export default Note;
