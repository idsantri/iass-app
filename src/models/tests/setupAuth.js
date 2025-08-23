import authStore from '../../stores/authStore'
import Auth from '../Auth'

const setupAuth = (() => {
  function authState() {
    const store = authStore()
    return store.$state
  }

  function resetAuth() {
    const store = authStore()
    store.$reset()
  }

  function loginToStore(authData) {
    const store = authStore()
    store.login(authData)
  }

  async function doLogin() {
    localStorage.clear()
    resetAuth()

    const result = await Auth.login({
      login: 'admin',
      password: '112233',
    })

    // Update store with login result
    loginToStore(result)

    return result
  }
  return {
    authState,
    resetAuth,
    loginToStore,
    doLogin,
  }
})()
export default setupAuth
