import Api from './Api';

class ReportAbsence extends Api {
    constructor() {
        super();
        this.setNotifyGet();
        this.path = 'reports/absences';
    }

    async NksByMember(th_ajaran_h) {
        const response = await this.fetchAuth(`${this.path}/by-member`, {
            method: 'GET',
            params: { th_ajaran_h, nama: 'Ngaji Kitab Sidogiri', lingkup: 'Wilayah' },
        });
        return response.data || true;
    }

    async NksByKomisariat(th_ajaran_h) {
        const response = await this.fetchAuth(`${this.path}/by-komisariat`, {
            method: 'GET',
            params: { th_ajaran_h, nama: 'Ngaji Kitab Sidogiri', lingkup: 'Wilayah' },
        });
        return response.data || true;
    }
}

export default new ReportAbsence();
