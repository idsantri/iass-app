/**
 * ArrayCrud Utility - Helper untuk manipulasi array of objects pada State Management.
 * Pola: IIFE Factory Function (Immutable)
 */
const ArrayCrud = (() => {
    // --- PRIVATE UTILITIES ---
    const _validateObject = (obj) => {
        if (!obj || typeof obj !== 'object') {
            console.warn('ArrayCrud: Parameter bukan object yang valid');
            return false;
        }
        return true;
    };

    // --- CORE FUNCTIONS ---

    /**
     * CREATE - Menambahkan object baru ke array
     * @param {Array} currentArray - Array saat ini (ref.value)
     * @param {Object} newObject - Object yang akan ditambahkan
     * @param {string} position - Posisi penambahan ("first" atau "last")
     * @returns {Array} Array baru untuk update state
     */
    const create = (currentArray, newObject, position = 'last') => {
        if (!_validateObject(newObject)) return currentArray;
        const newArray = [...currentArray];
        position === 'first' ? newArray.unshift(newObject) : newArray.push(newObject);
        return newArray;
    };

    /**
     * UPDATE - Mengupdate object berdasarkan id
     * @param {Array} currentArray - Array saat ini (ref.value)
     * @param {number|string} objectId - ID object yang akan diupdate
     * @param {Object} updateData - Data baru untuk update
     * @param {string} key - Key pencarian (default: 'id')
     * @returns {Array} Array baru untuk update state
     */
    const update = (currentArray, objectId, updateData, key = 'id') => {
        if (!_validateObject(updateData)) return currentArray;

        return currentArray.map((item) =>
            item[key] == objectId ? { ...item, ...updateData } : item,
        );
    };

    /**
     * UPDATE OR CREATE (UPSERT) - Update jika ada, create jika tidak ada
     * @param {Array} currentArray - Array saat ini (ref.value)
     * @param {Object} data - Data yang akan dimasukkan/diupdate
     * @param {string} key - Key pencarian (default: 'id')
     * @param {string} position - Posisi jika create ("first" atau "last" default)
     * @returns {Array} Array baru untuk update state
     */
    const updateOrCreate = (currentArray, data, key = 'id', position = 'last') => {
        const objectId = data[key];
        return exists(currentArray, objectId, key)
            ? update(currentArray, objectId, data, key)
            : create(currentArray, data, position);
    };

    /**
     * Toggle - Mengubah nilai boolean dari targetKey berdasarkan objectId
     * @param {Array} currentArray - Array saat ini (ref.value)
     * @param {number|string} objectId - ID object yang akan di-toggle
     * @param {string} targetKey - Key yang akan di-toggle
     * @param {string} key - Key pencarian (default: 'id')
     * @returns {Array} Array baru untuk update state
     */
    const toggle = (currentArray, objectId, targetKey, key = 'id') => {
        return currentArray.map((item) =>
            item[key] == objectId ? { ...item, [targetKey]: !item[targetKey] } : item,
        );
    };

    /**
     * DELETE - Menghapus object berdasarkan id
     * @param {Array} currentArray - Array saat ini (ref.value)
     * @param {number|string} objectId - ID object yang akan dihapus
     * @param {string} key - Key pencarian (default: 'id')
     * @returns {Array} Array baru untuk update state
     */
    const remove = (currentArray, objectId, key = 'id') => {
        return currentArray.filter((item) => item[key] != objectId);
    };

    // --- SEARCH & FILTER ---

    const findById = (currentArray, objectId, key = 'id') => {
        return currentArray.find((item) => item[key] == objectId) || null;
    };

    const exists = (currentArray, objectId, key = 'id') => {
        return currentArray.some((item) => item[key] == objectId);
    };

    const search = (currentArray, query) => {
        if (!query) return currentArray;
        const lowerQuery = query.toLowerCase();
        return currentArray.filter((item) =>
            Object.values(item).some((val) => String(val).toLowerCase().includes(lowerQuery)),
        );
    };

    // --- TRANSFORMATION & GROUPING ---

    const groupBy = (currentArray, iteratee) => {
        return currentArray.reduce((acc, item) => {
            const groupKey = typeof iteratee === 'function' ? iteratee(item) : item[iteratee];
            if (!acc[groupKey]) acc[groupKey] = [];
            acc[groupKey].push(item);
            return acc;
        }, {});
    };

    const paginate = (currentArray, page = 1, perPage = 10) => {
        const offset = (page - 1) * perPage;
        return currentArray.slice(offset, offset + perPage);
    };

    const flattenNestedKey = (arrObj, key, connector = '_') => {
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
    };

    // --- SORTING ---

    const sort = (currentArray, sortBy, order = 'asc') => {
        const newArray = [...currentArray];
        newArray.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];
            const comparison = String(aVal).localeCompare(String(bVal), undefined, {
                numeric: true,
                sensitivity: 'base',
            });
            return order === 'asc' ? comparison : -comparison;
        });
        return newArray;
    };

    const sortPrimitiveArray = (dataArray, order = 'asc') => {
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
    };

    // --- ANALYSIS ---

    const findMax = (arr, key = 'id') => {
        if (!arr.length) return null;
        return arr.reduce((max, obj) => (obj[key] > max[key] ? obj : max), arr[0]);
    };

    const findMin = (arr, key = 'id') => {
        if (!arr.length) return null;
        return arr.reduce((min, obj) => (obj[key] < min[key] ? obj : min), arr[0]);
    };

    return {
        create,
        update,
        updateOrCreate,
        toggle,
        remove,
        findById,
        exists,
        search,
        sort,
        sortPrimitiveArray,
        groupBy,
        paginate,
        flattenNestedKey,
        findMax,
        findMin,
    };
})();

export default ArrayCrud;
