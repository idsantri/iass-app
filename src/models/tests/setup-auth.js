import authStore from '../../stores/authStore'
import Auth from '../Auth'

// Test utilities
export const authTestUtils = {
  authState: () => authStore().$state,
  resetAuth: () => {
    authStore().$reset
  },
  loginToStore: (authData) => {
    const store = authStore()
    store.login(authData)
  },
}

export async function doLogin() {
  localStorage.clear()
  const result = await Auth.login({
    login: 'admin',
    password: '112233',
  })

  // Update store with login result
  authTestUtils.loginToStore(result)

  return result
}
