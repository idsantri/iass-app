import { defineStore } from 'pinia';
// const alamat = {
// 	provinsi: [
// 		{
// 			id: '11',
// 			provinsi: 'Bali',
// 			kabupaten:[
// 				{
// 					id:'1122',
// 					kabupaten:'Denpasar',
// 					kecamatan:[
// 						{
// 							id:'112233',
// 							kecamatan:'Balebale',
// 							desa:[
// 								{
// 									id:'1122330000',
// 									desa:'Angsokah'
// 								}
// 							]

// 						}
// 					]
// 				}
// 			]
// 		},
// 	],
// };

export default defineStore('address', {
    state: () => {
        return {
            provinsi: [],
        };
    },

    getters: {},

    actions: {
        _findProvinsi(alamat) {
            const { provinsi_id, provinsi_name } = alamat;
            if (provinsi_id) {
                return this.provinsi.find((obj) => obj?.id == provinsi_id);
            } else if (provinsi_name) {
                return this.provinsi.find(
                    (obj) => obj?.provinsi.toLowerCase() === provinsi_name.toLowerCase(),
                );
            } else {
                // throw new Error('Find Provinsi: Parameter tidak sesuai!');
                console.error('Find Provinsi: Parameter tidak sesuai!');
                return;
            }
        },

        _findKabupaten(alamat) {
            const { kabupaten_id, kabupaten_name } = alamat;
            const prov = this._findProvinsi(alamat);

            if (!prov || !prov.kabupaten?.length) {
                // throw new Error('Find Kabupaten: Provinsi 0 or Kabupaten 0!');
                console.error('Find Kabupaten: Provinsi 0 or Kabupaten 0!');
                return;
            }

            if (kabupaten_id) {
                return prov.kabupaten.find((obj) => obj?.id == kabupaten_id);
            }
            if (kabupaten_name) {
                return prov.kabupaten.find(
                    (obj) => obj.kabupaten.toLowerCase() === kabupaten_name.toLowerCase(),
                );
            }

            throw new Error('Find Kabupaten: Parameter tidak sesuai!');
        },

        _findKecamatan(alamat) {
            const { kecamatan_id, kecamatan_name } = alamat;
            const kab = this._findKabupaten(alamat);

            if (!kab || !kab.kecamatan?.length) {
                console.error('Find Kecamatan: Provinsi 0 or Kabupaten 0 or Kecamatan 0!');
                return;
                // throw new Error(
                // 	'Find Kecamatan: Provinsi 0 or Kabupaten 0 or Kecamatan 0!',
                // );
            }

            if (kecamatan_id) {
                return kab.kecamatan.find((obj) => obj?.id == kecamatan_id);
            }
            if (kecamatan_name) {
                return kab.kecamatan.find(
                    (obj) => obj.kecamatan.toLowerCase() === kecamatan_name.toLowerCase(),
                );
            }

            throw new Error('Find Kecamatan: Parameter tidak sesuai!');
        },

        setProvinsi(arrProvinsi) {
            this.provinsi = [];
            this.provinsi = arrProvinsi;
        },

        setKabupaten(arrKabupaten, dataProvinsi) {
            const pro = this._findProvinsi(dataProvinsi);
            if (pro) {
                pro.kabupaten = arrKabupaten;
            }
        },

        setKecamatan(arrKecamatan, dataKabupaten) {
            const kab = this._findKabupaten(dataKabupaten);
            if (kab) {
                kab.kecamatan = arrKecamatan;
            }
        },

        setDesa(arrDesa, DataKecamatan) {
            const kec = this._findKecamatan(DataKecamatan);
            if (kec) {
                kec.desa = arrDesa;
            }
        },

        getProvinsi() {
            return this.provinsi;
        },

        getKabupaten(dataProvinsi) {
            const pro = this._findProvinsi(dataProvinsi);
            return pro?.kabupaten;
        },

        getKecamatan(dataKabupaten) {
            const kab = this._findKabupaten(dataKabupaten);
            return kab?.kecamatan;
        },

        getDesa(dataKecamatan) {
            const kec = this._findKecamatan(dataKecamatan);
            return kec?.desa;
        },
    },

    persist: {
        storage: localStorage,
    },
});
