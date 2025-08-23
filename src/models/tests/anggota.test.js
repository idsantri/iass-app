import { describe, it, expect, beforeAll } from 'vitest'
import setupAuth from './setupAuth'
import Member from '../Member'

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
    const response = await Member.create(data)
    expect(response).toBeDefined()
    expect(response.customer).toHaveProperty('id')
    createdId = response.customer.id
  })

  it('should get all customers', async () => {
    const response = await Member.getAll()
    expect(response).toBeDefined()
    expect(Array.isArray(response.customers)).toBe(true)
  })

  it('should get customer by id', async () => {
    const response = await Member.getById(createdId)
    expect(response).toBeDefined()
    expect(response.customer).toHaveProperty('id', createdId)
  })

  it('should update customer', async () => {
    const update = { name: 'Updated Customer' }
    const response = await Member.update(createdId, update)
    expect(response).toBeDefined()
  })

  it('should remove customer', async () => {
    const response = await Member.remove(createdId)
    expect(response).toBeDefined()
  })
})
