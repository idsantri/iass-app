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
            throw new Error('Position harus "first" atau "back"');
        }
    };

    /**
     * CREATE - Menambahkan object baru ke array
     * @param {Array} currentArray - Array saat ini (ref.value)
     * @param {Object} newObject - Object yang akan ditambahkan
     * @param {string} position - Posisi penambahan ("first" atau "back")
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
     * @returns {Array} Array baru untuk update state
     */
    function update(currentArray, objectId, updateData) {
        _validateObject(updateData);

        const newArray = currentArray.map((item) => {
            if (item.id === objectId) {
                return { ...item, ...updateData };
            }
            return item;
        });

        return newArray;
    }

    /**
     * DELETE - Menghapus object berdasarkan id
     * @param {Array} currentArray - Array saat ini (ref.value)
     * @param {number|string} objectId - ID object yang akan dihapus
     * @returns {Array} Array baru untuk update state
     */
    function remove(currentArray, objectId) {
        return currentArray.filter((item) => item.id !== objectId);
    }

    /**
     * FIND - Mencari object berdasarkan id
     * @param {Array} currentArray - Array saat ini
     * @param {number|string} objectId - ID object yang dicari
     * @returns {Object|null} Object yang ditemukan atau null
     */
    function findById(currentArray, objectId) {
        return currentArray.find((item) => item.id === objectId) || null;
    }

    /**
     * EXISTS - Mengecek apakah object dengan id tertentu ada
     * @param {Array} currentArray - Array saat ini
     * @param {number|string} objectId - ID object yang dicari
     * @returns {boolean} true jika ada, false jika tidak
     */
    function exists(currentArray, objectId) {
        return currentArray.some((item) => item.id === objectId);
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
            // Sort by key
            newArray.sort((a, b) => {
                const aVal = a[sortBy];
                const bVal = b[sortBy];

                if (order === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });
        } else if (typeof sortBy === 'function') {
            // Sort by function
            newArray.sort(sortBy);
        }

        return newArray;
    }

    return {
        create,
        update,
        remove,
        findById,
        exists,
        filter,
        sort,
    };
})();
export default ArrayCrud;
