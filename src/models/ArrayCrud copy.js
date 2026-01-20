// ArrayCrud - IIFE Factory Function Pattern
const ArrayCrud = (() => {
    // Private utility functions
    const _validateObject = (obj) => {
        if (!obj || typeof obj !== 'object') {
            throw new Error('Parameter harus berupa object yang valid');
        }
    };

    const _validatePosition = (position) => {
        if (position !== 'first' && position !== 'last') {
            throw new Error('Position harus "first" atau "last"');
        }
    };

    /**
     * CREATE - Menambahkan object baru ke array
     * @param {Array} currentArray - Array saat ini (ref.value)
     * @param {Object} newObject - Object yang akan ditambahkan
     * @param {string} position - Posisi penambahan ("first" atau "last")
     * @returns {Array} Array baru untuk update state
     */
    function create(currentArray, newObject, position = 'last') {
        _validateObject(newObject);
        _validatePosition(position);

        const newArray = [...currentArray];

        if (position === 'first') {
            newArray.unshift(newObject);
        } else {
            newArray.push(newObject);
        }

        return newArray;
    }

    /**
     * UPDATE - Mengupdate object berdasarkan id
     * @param {Array} currentArray - Array saat ini (ref.value)
     * @param {number|string} objectId - ID object yang akan diupdate
     * @param {Object} updateData - Data baru untuk update
     * @param {string} key - Key pencarian (default: 'id')
     * @returns {Array} Array baru untuk update state
     */
    function update(currentArray, objectId, updateData, key = 'id') {
        _validateObject(updateData);

        const newArray = currentArray.map((item) => {
            if (item[key] == objectId) {
                return { ...item, ...updateData };
            }
            return item;
        });

        return newArray;
    }

    /**
     * UPDATE OR CREATE (UPSERT) - Update jika ada, create jika tidak ada
     * @param {Array} currentArray - Array saat ini
     * @param {Object} data - Data yang akan dimasukkan/diupdate
     * @param {string} key - Key pencarian (default: 'id')
     * @param {string} position - Posisi jika create ("first" atau "last" default)
     * @returns {Array} Array baru untuk update state
     */
    function updateOrCreate(currentArray, data, key = 'id', position = 'last') {
        _validateObject(data);
        const objectId = data[key];

        if (exists(currentArray, objectId)) {
            // Jika data ada, gunakan fungsi update yang sudah ada
            return update(currentArray, objectId, data, key);
        } else {
            // Jika data tidak ada, gunakan fungsi create yang sudah ada
            return create(currentArray, data, position);
        }
    }

    /**
     * DELETE - Menghapus object berdasarkan id
     * @param {Array} currentArray - Array saat ini (ref.value)
     * @param {number|string} objectId - ID object yang akan dihapus
     * @param {string} key - Key pencarian (default: 'id')
     * @returns {Array} Array baru untuk update state
     */
    function remove(currentArray, objectId, key = 'id') {
        return currentArray.filter((item) => item[key] != objectId);
    }

    /**
     * FIND - Mencari object berdasarkan id
     * @param {Array} currentArray - Array saat ini
     * @param {number|string} objectId - ID object yang dicari
     * @returns {Object|null} Object yang ditemukan atau null
     */
    function findById(currentArray, objectId) {
        return currentArray.find((item) => item.id == objectId) || null;
    }

    /**
     * EXISTS - Mengecek apakah object dengan id tertentu ada
     * @param {Array} currentArray - Array saat ini
     * @param {number|string} objectId - ID object yang dicari
     * @returns {boolean} true jika ada, false jika tidak
     */
    function exists(currentArray, objectId) {
        return currentArray.some((item) => item.id == objectId);
    }

    /**
     * FILTER - Filter array berdasarkan callback
     * @param {Array} currentArray - Array saat ini
     * @param {Function} callback - Function untuk filter
     * @returns {Array} Array hasil filter
     */
    function filter(currentArray, callback) {
        if (typeof callback !== 'function') {
            throw new Error('Parameter callback harus berupa function');
        }
        return currentArray.filter(callback);
    }

    /**
     * SORT - Mengurutkan array
     * @param {Array} currentArray - Array saat ini
     * @param {Function|string} sortBy - Function atau key untuk sort
     * @param {string} order - "asc" atau "desc"
     * @returns {Array} Array yang sudah diurutkan
     */
    function sort(currentArray, sortBy, order = 'asc') {
        const newArray = [...currentArray];

        if (typeof sortBy === 'string') {
            newArray.sort((a, b) => {
                let aVal = a[sortBy];
                let bVal = b[sortBy];

                // Tambahkan pengecekan dan konversi untuk string agar case-insensitive
                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = bVal.toLowerCase();
                }

                // Aturan perbandingan
                if (aVal < bVal) {
                    return order === 'asc' ? -1 : 1;
                }
                if (aVal > bVal) {
                    return order === 'asc' ? 1 : -1;
                }
                return 0; // Kedua nilai sama
            });
        } else if (typeof sortBy === 'function') {
            // Sort by function (tetap menggunakan fungsi kustom yang disediakan)
            newArray.sort(sortBy);
        }
        return newArray;
    }
    /**
     * Mengurutkan array string secara case-insensitive (mengabaikan huruf besar/kecil).
     *
     * @param {string[]} dataArray - Array string primitif yang akan diurutkan.
     * @param {string} [order='asc'] - Urutan pengurutan: 'asc' (ascending) atau 'desc' (descending).
     * @returns {string[]} Array yang sudah diurutkan.
     */
    function sortPrimitiveArray(dataArray, order = 'asc') {
        // Buat salinan array agar fungsi tidak memodifikasi array asli (immutable)
        const sortedData = [...dataArray];

        sortedData.sort((a, b) => {
            // Menggunakan localeCompare untuk perbandingan string yang baik.
            // Opsi { sensitivity: 'base' } memastikan perbandingan case-insensitive
            // (mengabaikan huruf besar/kecil dan aksen).
            const comparisonResult = a.localeCompare(b, undefined, {
                sensitivity: 'base',
            });

            // Tentukan hasil pengurutan berdasarkan parameter 'order'
            if (order.toLowerCase() === 'desc') {
                // Untuk descending, balikkan hasil perbandingan
                return -comparisonResult;
            } else {
                // Untuk ascending (default), gunakan hasil perbandingan aslinya
                return comparisonResult;
            }
        });

        return sortedData;
    }

    /**
     * FLATTEN NESTED KEY - Flatten nested object dalam array of objects
     * @param {Array} arrObj - Array of objects
     * @param {string} key - Key dari nested object yang akan di-flatten
     * @param {string} connector - Karakter penyambung antara key utama dan nested key (default: '_')
     * @returns {Array} Array dengan nested object yang sudah di-flatten
     */
    function flattenNestedKey(arrObj, key, connector = '_') {
        return arrObj.map((item) => {
            // Buat salinan object tanpa nested key
            const { [key]: nestedObj, ...rest } = item;

            // Jika nested object tidak ada, kembalikan item asli
            if (!nestedObj) return item;

            // Flatten nested object dengan menambahkan prefix key
            const flattened = {};
            for (const [nestedKey, value] of Object.entries(nestedObj)) {
                flattened[`${key}${connector}${nestedKey}`] = value;
            }

            // Gabungkan dengan rest of properties
            return { ...rest, ...flattened };
        });
    }

    /**
     * Cari objek dengan nilai kunci terbesar pada array objek.
     * @param {Array<object>} arr - Array objek input.
     * @param {string} key - Kunci yang akan dicari nilai maksimalnya. Default "id".
     * @returns {object | null} Objek dengan nilai maksimal pada key, atau null jika array kosong.
     */
    function findMax(arr, key = 'id') {
        if (!Array.isArray(arr) || arr.length === 0) return null;

        return arr.reduce((maxObj, obj) => {
            // Pastikan obj adalah objek dan memiliki key
            if (obj != null && Object.prototype.hasOwnProperty.call(obj, key)) {
                const val = obj[key];

                // Jika nilai bukan angka, abaikan perbandingan lexicografis
                if (typeof val !== 'number') {
                    return maxObj === null || String(val) > String(maxObj?.[key]) ? obj : maxObj;
                }

                // Jika nilai adalah angka, bandingkan secara numerik
                return maxObj === null || val > maxObj?.[key] ? obj : maxObj;
            }

            return maxObj;
        }, null);
    }

    /**
     * Cari objek dengan nilai kunci terkecil di array objek.
     * @param {Array<object>} arr - Array objek input.
     * @param {string} key - Kunci yang akan dicari nilai minimalnya. Default "id".
     * @returns {object | null} Objek dengan nilai minimal pada key, atau null jika array kosong.
     */
    function findMin(arr, key = 'id') {
        if (!Array.isArray(arr) || arr.length === 0) return null;

        return arr.reduce((minObj, obj) => {
            // Pastikan obj adalah objek dan memiliki key
            if (obj != null && Object.prototype.hasOwnProperty.call(obj, key)) {
                const val = obj[key];

                // Jika nilai bukan angka, abaikan perbandingan lexicografis
                if (typeof val !== 'number') {
                    return minObj === null || String(val) < String(minObj?.[key]) ? obj : minObj;
                }

                // Jika nilai adalah angka, bandingkan secara numerik
                return minObj === null || val < minObj?.[key] ? obj : minObj;
            }

            return minObj;
        }, null);
    }

    return {
        create,
        update,
        updateOrCreate,
        //// toggle
        remove,
        findById,
        exists,
        filter, //search
        // group by
        // paginate
        flattenNestedKey,
        sort,
        sortPrimitiveArray,
        findMax,
        findMin,
    };
})();
export default ArrayCrud;
