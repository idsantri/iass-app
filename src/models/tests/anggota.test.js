import { describe, it, expect, beforeAll, vi } from 'vitest'
import anggota from '../anggota'
import { doLogin } from './setup-auth'
import api from '../api' // Import api to mock its methods

beforeAll(async () => {
  await doLogin()

  // Mock api.setNotify
  vi.spyOn(api, 'setNotify').mockImplementation(() => {
    // No operation
  })

  api.setLog(false)
})

describe('customers model', () => {
  let createdId

  it('should create a customer', async () => {
    const data = {
      name: 'Test Customer',
      address: 'Test Address',
      district: 'Socah',
    }
    const response = await anggota.create(data)
    expect(response).toBeDefined()
    expect(response.customer).toHaveProperty('id')
    createdId = response.customer.id
    // Verify that setNotify was called by the customer model, but it was mocked to do nothing
    expect(api.setNotify).toHaveBeenCalledWith(true)
  })

  it('should get all customers', async () => {
    const response = await anggota.getAll()
    expect(response).toBeDefined()
    expect(Array.isArray(response.customers)).toBe(true)
    expect(api.setNotify).toHaveBeenCalledWith({
      showSuccess: false,
      showError: true,
    })
  })

  it('should get customer by id', async () => {
    const response = await anggota.getById(createdId)
    expect(response).toBeDefined()
    expect(response.customer).toHaveProperty('id', createdId)
    expect(api.setNotify).toHaveBeenCalledWith({
      showSuccess: false,
      showError: true,
    })
  })

  it('should update customer', async () => {
    const update = { name: 'Updated Customer' }
    const response = await anggota.update(createdId, update)
    expect(response).toBeDefined()
    expect(api.setNotify).toHaveBeenCalledWith(true)
  })

  it('should remove customer', async () => {
    const response = await anggota.remove(createdId)
    expect(response).toBeDefined()
    expect(api.setNotify).toHaveBeenCalledWith(true)
  })
})
