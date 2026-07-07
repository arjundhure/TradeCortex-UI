import { create } from 'zustand'
import { api } from '../api/client'

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  init: async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      set({ isLoading: false })
      return
    }
    try {
      const res = await api.me()
      set({ user: res.data, isAuthenticated: true, isLoading: false })
    } catch {
      localStorage.clear()
      set({ isLoading: false })
    }
  },

  login: async (email, password) => {
    const res = await api.login({ email, password })
    const { access_token, refresh_token, user } = res.data
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
    set({ user, isAuthenticated: true })
    return user
  },

  signup: async (data) => {
    const res = await api.signup(data)
    const { access_token, refresh_token, user } = res.data
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
    set({ user, isAuthenticated: true })
    return user
  },

  logout: async () => {
    await api.logout().catch(() => {})
    localStorage.clear()
    set({ user: null, isAuthenticated: false })
  },
}))

export default useAuthStore 
