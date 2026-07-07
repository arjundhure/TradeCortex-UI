export default function StatCard({ label, value, sub, badge, badgeType = 'up' }) {
  const badgeColors = {
    up:      { bg: 'rgba(52,211,153,0.12)',  color: 'var(--accent3)', border: 'rgba(52,211,153,0.2)' },
    down:    { bg: 'rgba(248,113,113,0.12)', color: 'var(--danger)',  border: 'rgba(248,113,113,0.2)' },
    neutral: { bg: 'rgba(99,179,237,0.1)',   color: 'var(--accent)',  border: 'rgba(99,179,237,0.2)' },
  }
  const bc = badgeColors[badgeType]

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px' }}>
      <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: 800, lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '5px' }}>{sub}</div>}
      {badge && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '3px 9px', borderRadius: '20px', marginTop: '6px', background: bc.bg, color: bc.color, border: `1px solid ${bc.border}` }}>
          {badge}
        </div>
      )}
    </div>
  )
} 
