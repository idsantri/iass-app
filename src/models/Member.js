import Api from './Api'

class Member extends Api {
  constructor() {
    super()
    this.defaultConfig()
    this.path = 'members'
  }

  async getAll(params) {
    this.setNotify({ showSuccess: false, showError: true })
    const response = await this.fetchAuth(this.path, {
      method: 'GET',
      params,
    })
    return response.data || true
  }

  async getById(id) {
    this.setNotify({ showSuccess: false, showError: true })
    const response = await this.fetchAuth(`${this.path}/${id}`, {
      method: 'GET',
    })
    return response.data || true
  }

  async create(data) {
    const response = await this.fetchAuth(this.path, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.data || true
  }

  async update(id, data) {
    const response = await this.fetchAuth(`${this.path}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response.data || true
  }

  async remove(id) {
    const response = await this.fetchAuth(`${this.path}/${id}`, {
      method: 'DELETE',
    })
    return response.data || true
  }
}
export default new Member()
