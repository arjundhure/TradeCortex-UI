export default function EVSGauge({ evsScore, evsLevel, evsDescription }) {
  const score = evsScore ?? 0
  const pct = Math.min(100, Math.max(0, score))

  const color = evsLevel === 'Low' ? 'var(--accent3)'
    : evsLevel === 'Medium' ? 'var(--accent4)'
    : 'var(--danger)'

  const radius = 70
  const circumference = Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <div style={{ position: 'relative', width: '160px', height: '90px', overflow: 'hidden' }}>
        <svg width="160" height="160" style={{ position: 'absolute', top: 0, left: 0 }}>
          <path d="M 10 80 A 70 70 0 0 1 150 80" fill="none" stroke="var(--surface3)" strokeWidth="12" strokeLinecap="round" />
          <path d="M 10 80 A 70 70 0 0 1 150 80" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.3s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, color }}>
            {score.toFixed(1)}
          </div>
        </div>
      </div>
      <div style={{ fontSize: '12px', fontWeight: 600, color, marginTop: '8px' }}>{evsLevel} EVS</div>
      <div style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'center', marginTop: '6px', lineHeight: 1.5, maxWidth: '200px' }}>
        {evsDescription}
      </div>
    </div>
  )
} 
