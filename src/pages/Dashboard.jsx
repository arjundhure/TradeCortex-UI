import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import useAuthStore from '../store/useAuthStore'

export default function Dashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { data } = useQuery({
    queryKey: ['history'],
    queryFn: () => api.history(5).then(r => r.data),
  })

  const recColor = {
    Buy: 'var(--accent3)',
    Sell: 'var(--danger)',
    Hold: 'var(--accent4)'
  }

  const quickActions = [
    { icon: '🔍', title: 'Analyze Stock', desc: 'Run AI analysis on any ticker', action: () => navigate('/analyze'), color: 'var(--accent)' },
    { icon: '⚡', title: 'Compare Stocks', desc: 'Side-by-side comparison', action: () => navigate('/compare'), color: 'var(--accent2)' },
    { icon: '📋', title: 'View History', desc: 'Your past analyses', action: () => navigate('/history'), color: 'var(--accent3)' },
  ]

  return (
    <div style={{ padding: '24px 28px', overflowY: 'auto', height: '100%' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 800 }}>
          Welcome back, {user?.full_name?.split(' ')[0]} 👋
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>
          {user?.investor_type} investor · {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
        {quickActions.map(({ icon, title, desc, action, color }) => (
          <div
            key={title}
            onClick={action}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = color}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>{icon}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
              {title}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* Recent analyses */}
      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '14px' }}>
          Recent Analyses
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {data?.reports?.map(r => (
            <div
              key={r.id}
              onClick={() => navigate(`/analyze?symbol=${r.symbol}`)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '15px', color: 'var(--accent)', minWidth: '60px' }}>
                {r.symbol}
              </span>
              <span style={{ fontSize: '13px' }}>${r.price?.toFixed(2)}</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: recColor[r.recommendation] }}>
                {r.recommendation}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                {r.sentiment_label} · {r.risk_level} risk
              </span>
              <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--muted)' }}>
                {new Date(r.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}

          {!data?.reports?.length && (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: 'var(--muted)',
              fontSize: '12px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
            }}>
              No analyses yet — go to Analyze to get started
            </div>
          )}
        </div>
      </div>
    </div>
  )
}