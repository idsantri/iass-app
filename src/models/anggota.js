// import Api from './Api'

const anggota = (() => {
  const api = new Api()
  async function getAll(params) {
    // api.setNotify({ showSuccess: false, showError: true })
    api.setNotify(false)
    const response = await api.fetchAuth(`anggota`, {
      method: 'GET',
      params,
    })
    return response.data || true
  }

  async function getById(id) {
    // api.setNotify({ showSuccess: false, showError: true })
    api.setNotify(false)
    const response = await api.fetchAuth(`anggota/${id}`, {
      method: 'GET',
    })
    return response.data || true
  }

  async function create(data) {
    api.setNotify(false)
    // api.setNotify(true)
    const response = await api.fetchAuth(`anggota`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.data || true
  }

  async function update(id, data) {
    api.setNotify(false)
    // api.setNotify(true)
    const response = await api.fetchAuth(`anggota/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response.data || true
  }

  async function remove(id) {
    api.setNotify(false)
    // api.setNotify(true)
    const response = await api.fetchAuth(`anggota/${id}`, {
      method: 'DELETE',
    })
    return response.data || true
  }

  function setNotify(config) {
    api.setNotify(config)
  }

  function setLog(value) {
    api.setLog(value)
  }

  return {
    getAll,
    getById,
    create,
    update,
    remove,
    setNotify,
    setLog,
  }
})()

export default anggota
