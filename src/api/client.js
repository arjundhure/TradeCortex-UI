import axios from 'axios'

const client = axios.create({
  baseURL: '/',
  timeout: 30000,
})

// Attach JWT token to every request automatically
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle expired tokens
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken && !error.config._retry) {
        error.config._retry = true
        try {
          const res = await axios.post('/api/auth/refresh', { refresh_token: refreshToken })
          const newToken = res.data.access_token
          localStorage.setItem('access_token', newToken)
          error.config.headers.Authorization = `Bearer ${newToken}`
          return client(error.config)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      } else {
        localStorage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const api = {
  // Auth
  signup: (data) => client.post('/api/auth/signup', data),
  login: (data) => client.post('/api/auth/login', data),
  me: () => client.get('/api/auth/me'),
  logout: () => client.post('/api/auth/logout'),

  // Analysis
  analyze: (symbol, investorType = 'moderate') =>
    client.get(`/api/analyze?symbol=${symbol}&investor_type=${investorType}`),
  history: (limit = 20) => client.get(`/api/history?limit=${limit}`),
}

export default client 
