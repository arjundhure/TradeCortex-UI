export default function RecommendationCard({ recommendation, explanation, riskLevel }) {
  const config = {
    Buy:  { color: 'var(--accent3)', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.2)',  icon: '📈' },
    Sell: { color: 'var(--danger)',  bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)', icon: '📉' },
    Hold: { color: 'var(--accent4)', bg: 'rgba(251,146,60,0.08)',  border: 'rgba(251,146,60,0.2)',  icon: '⏸️' },
  }
  const c = config[recommendation] || config.Hold

  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: '12px', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <span style={{ fontSize: '32px' }}>{c.icon}</span>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
            AI Recommendation
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 800, color: c.color, lineHeight: 1 }}>
            {recommendation}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '11px', background: 'var(--surface2)', padding: '4px 10px', borderRadius: '20px', color: 'var(--muted)', border: '1px solid var(--border)' }}>
          Risk: {riskLevel}
        </div>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.7, opacity: 0.85 }}>
        {explanation}
      </p>
    </div>
  )
} 
