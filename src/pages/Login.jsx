import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

export default function Login() {
  const [isSignup, setIsSignup] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '', investor_type: 'moderate' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, signup } = useAuthStore()
  const navigate = useNavigate()

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isSignup) await signup(form)
      else await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { width: '100%', padding: '12px 16px', background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: '9px', color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', outline: 'none' }
  const labelStyle = { display: 'block', fontSize: '10px', color: 'var(--muted)', marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase' }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 16px' }}>
            📈
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800 }}>
            Trade<span style={{ color: 'var(--accent)' }}>Cortex</span>
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>
            AI-powered stock analysis platform
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '32px' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>
            {isSignup ? 'Create account' : 'Sign in'}
          </h2>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {isSignup && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>First name</label>
                  <input style={inputStyle} name="first_name" value={form.first_name} onChange={handle} placeholder="Arjun" />
                </div>
                <div>
                  <label style={labelStyle}>Last name</label>
                  <input style={inputStyle} name="last_name" value={form.last_name} onChange={handle} placeholder="..." />
                </div>
              </div>
            )}

            <div>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} type="email" name="email" value={form.email} onChange={handle} placeholder="you@example.com" required />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input style={inputStyle} type="password" name="password" value={form.password} onChange={handle} placeholder="••••••••" required />
            </div>

            {isSignup && (
              <div>
                <label style={labelStyle}>Investor type</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} name="investor_type" value={form.investor_type} onChange={handle}>
                  <option value="conservative">🛡️ Conservative</option>
                  <option value="moderate">⚖️ Moderate</option>
                  <option value="aggressive">🚀 Aggressive</option>
                </select>
              </div>
            )}

            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '8px', fontSize: '12px', color: 'var(--danger)' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{ padding: '13px', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', border: 'none', borderRadius: '9px', color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--muted)', marginTop: '20px' }}>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span style={{ color: 'var(--accent)', cursor: 'pointer' }} onClick={() => { setIsSignup(!isSignup); setError('') }}>
              {isSignup ? 'Sign in' : 'Sign up'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
} 
