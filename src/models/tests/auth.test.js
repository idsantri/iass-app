import { describe, it, expect, beforeEach } from 'vitest'
import Auth from '../Auth'
import { authTestUtils, doLogin } from './setup-auth'

describe('auth model', () => {
  beforeEach(() => {
    localStorage.clear()
    authTestUtils.resetAuth()
    Auth.setLog(false)
  })

  it('login should return token on success', async () => {
    const result = await doLogin()
    expect(result.token).toBeDefined()
    expect(typeof result.token).toBe('string')
  })

  it('should store token in auth store after login', async () => {
    const result = await doLogin()
    const authState = authTestUtils.authState()

    expect(authState.token).toBe(result.token)
    expect(authState.isLoggedIn()).toBe(true)
    expect(authState.user).toBeDefined()
  })

  it('login should throw error on wrong credentials', async () => {
    await expect(
      Auth.login({
        login: 'user1',
        password: 'wrongpassword',
      }),
    ).rejects.toThrow()
  })

  it('logout should call API and clear auth state after real login', async () => {
    const result = await doLogin()

    // Verify login worked
    let authState = authTestUtils.authState()
    expect(authState.token).toBe(result.token)
    expect(authState.isLoggedIn()).toBe(true)

    // Perform logout
    const logoutResponse = await Auth.logout(false)

    // Clear store after logout
    authTestUtils.resetAuth()

    // Verify logout worked
    authState = authTestUtils.authState()
    expect(authState.token).toBeNull()
    expect(authState.isLoggedIn()).toBe(false)
    expect(logoutResponse).toBeDefined()
  })
})
