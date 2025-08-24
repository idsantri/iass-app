import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import setupAuth from './setupAuth'
import Anggota from '../Anggota'

describe('anggota model', () => {
  // Login sekali saja
  beforeAll(async () => {
    await setupAuth.setupTestSuite()
  })

  // Restore auth state sebelum setiap test
  beforeEach(() => {
    const store = setupAuth.setupTestCase()
    expect(store.token).toBeDefined()
  })

  const data = {
    id: 112233,
    nama: 'Test anggota',
    address: 'Test Address',
    district: 'Socah',
    iass: true,
    wilayah: 'Bangkalan',
    komisariat: 'Socah',
    kelompok: 'Kesamben',
  }

  it('should create a anggota', async () => {
    try {
      const response = await Anggota.create(data)
      console.log('Create response:', response)
      expect(response).toBeDefined()
      expect(response.anggota).toHaveProperty('id')
      data.id = response.anggota.id
    } catch (error) {
      console.error('Create failed:', error)
      throw error
    }
  })

  it('should get all anggota', async () => {
    const response = await Anggota.getAll()
    expect(response).toBeDefined()
    expect(Array.isArray(response.anggota)).toBe(true)
  })

  it('should get anggota by id', async () => {
    const response = await Anggota.getById(data.id)
    expect(response).toBeDefined()
    expect(response.anggota).toHaveProperty('id', data.id)
  })

  it('should update anggota', async () => {
    const update = { ...data, nama: 'Updated anggota' }
    const response = await Anggota.update(data.id, update)
    expect(response).toBeDefined()
  })

  it('should remove anggota', async () => {
    const response = await Anggota.remove(data.id)
    expect(response).toBeDefined()
  })
})
