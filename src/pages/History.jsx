import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export default function History() {
  const { data, isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: () => api.history(50).then(r => r.data),
  })

  const recColor = { Buy: 'var(--accent3)', Sell: 'var(--danger)', Hold: 'var(--accent4)' }

  return (
    <div style={{ padding: '24px 28px', overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 700 }}>Analysis History</h2>
        <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>Your last 50 stock analyses</p>
      </div>

      {isLoading && (
        <div style={{ color: 'var(--muted)', fontSize: '13px' }}>Loading...</div>
      )}

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Symbol', 'Price', 'Recommendation', 'Sentiment', 'Risk', 'Date'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 500 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.reports?.map((r, i) => (
              <tr key={r.id}
                style={{ borderBottom: i < data.reports.length - 1 ? '1px solid var(--border)' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '14px 16px', fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--accent)' }}>{r.symbol}</td>
                <td style={{ padding: '14px 16px' }}>${r.price?.toFixed(2)}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ color: recColor[r.recommendation], fontWeight: 600 }}>{r.recommendation}</span>
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--muted)' }}>{r.sentiment_label}</td>
                <td style={{ padding: '14px 16px', color: 'var(--muted)' }}>{r.risk_level}</td>
                <td style={{ padding: '14px 16px', color: 'var(--muted)' }}>
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {!data?.reports?.length && !isLoading && (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
                  No analyses yet — go to Analyze to get started
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
} 
