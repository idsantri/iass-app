import { describe, it, expect, beforeAll } from 'vitest'
import setupAuth from './setupAuth'
import Anggota from '../Anggota'

beforeAll(async () => {
  await setupAuth.doLogin()
})

describe('customers model', () => {
  let createdId

  it('should create a customer', async () => {
    const data = {
      name: 'Test Customer',
      address: 'Test Address',
      district: 'Socah',
    }
    const response = await Anggota.create(data)
    expect(response).toBeDefined()
    expect(response.customer).toHaveProperty('id')
    createdId = response.customer.id
  })

  it('should get all customers', async () => {
    const response = await Anggota.getAll()
    expect(response).toBeDefined()
    expect(Array.isArray(response.customers)).toBe(true)
  })

  it('should get customer by id', async () => {
    const response = await Anggota.getById(createdId)
    expect(response).toBeDefined()
    expect(response.customer).toHaveProperty('id', createdId)
  })

  it('should update customer', async () => {
    const update = { name: 'Updated Customer' }
    const response = await Anggota.update(createdId, update)
    expect(response).toBeDefined()
  })

  it('should remove customer', async () => {
    const response = await Anggota.remove(createdId)
    expect(response).toBeDefined()
  })
})
