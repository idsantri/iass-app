import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import setupAuth from './setupAuth';
import Member from '../Member';

describe('member model', () => {
    // Login sekali saja
    beforeAll(async () => {
        await setupAuth.setupTestSuite();
    });

    // Restore auth state sebelum setiap test
    beforeEach(() => {
        const store = setupAuth.setupTestCase();
        expect(store.token).toBeDefined();
    });

    const data = {
        id: 112234,
        nama: 'Test member',
        address: 'Test Address',
        district: 'Socah',
        alumni: true,
        wilayah: 'Bangkalan',
        komisariat: 'Socah',
        kelompok: 'Kesamben',
    };

    it('should create a member', async () => {
        try {
            const response = await Member.create(data);
            console.log('Create response:', response);
            expect(response).toBeDefined();
            expect(response.member).toHaveProperty('id');
            data.id = response.member.id;
        } catch (error) {
            console.error('Create failed:', error);
            throw error;
        }
    });

    it('should get all member', async () => {
        const response = await Member.getAll();
        expect(response).toBeDefined();
        expect(Array.isArray(response.members)).toBe(true);
    });

    it('should get member by id', async () => {
        const response = await Member.getById(data.id);
        expect(response).toBeDefined();
        expect(response.member).toHaveProperty('id', data.id);
    });

    it('should update member', async () => {
        const update = { ...data, nama: 'Updated member' };
        const response = await Member.update(data.id, update);
        expect(response.member).toBeDefined();
    });

    it('should remove member', async () => {
        const response = await Member.remove(data.id);
        expect(response).toBeDefined();
    });
});
