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

	return {
		create,
		update,
		remove,
		findById,
		exists,
		filter,
		sort,
		sortPrimitiveArray,
	};
})();
export default ArrayCrud;
