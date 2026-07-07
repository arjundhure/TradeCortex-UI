import { useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { api } from '../api/client'
import StockChart from '../components/StockChart'

export default function Compare() {
  const [symbols, setSymbols] = useState(['AAPL', 'MSFT'])
  const [inputs, setInputs] = useState(['AAPL', 'MSFT'])

  const results = useQueries({
    queries: symbols.map(sym => ({
      queryKey: ['analyze', sym],
      queryFn: () => api.analyze(sym).then(r => r.data),
      enabled: !!sym,
      staleTime: 60_000,
    }))
  })

  const recColor = { Buy: 'var(--accent3)', Sell: 'var(--danger)', Hold: 'var(--accent4)' }

  return (
    <div style={{ padding: '24px 28px', overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 700 }}>Compare Stocks</h2>
        <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>Side-by-side AI analysis</p>
      </div>

      {/* Symbol inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
        {[0, 1].map(i => (
          <div key={i} style={{ display: 'flex', gap: '10px' }}>
            <input
              value={inputs[i]}
              onChange={e => { const n = [...inputs]; n[i] = e.target.value.toUpperCase(); setInputs(n) }}
              onKeyDown={e => { if (e.key === 'Enter') { const n = [...symbols]; n[i] = inputs[i]; setSymbols(n) } }}
              placeholder={i === 0 ? 'AAPL' : 'MSFT'}
              style={{ flex: 1, padding: '12px 16px', background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: '10px', color: 'var(--text)', fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, letterSpacing: '2px', outline: 'none' }}
            />
            <button
              onClick={() => { const n = [...symbols]; n[i] = inputs[i]; setSymbols(n) }}
              style={{ padding: '12px 20px', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', border: 'none', borderRadius: '10px', color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
            >
              Go
            </button>
          </div>
        ))}
      </div>

      {/* Side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {results.map((result, i) => {
          if (result.isLoading) return (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '40px', textAlign: 'center', color: 'var(--muted)', fontSize: '12px' }}>
              Analyzing {symbols[i]}...
            </div>
          )
          const d = result.data
          if (!d) return null

          return (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 800 }}>{d.symbol}</span>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{d.stock_info?.name}</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, color: d.price?.change_pct >= 0 ? 'var(--accent3)' : 'var(--danger)' }}>
                  ${d.price?.current?.toFixed(2)}
                </span>
              </div>

              {/* Chart */}
              <div style={{ padding: '16px' }}>
                <StockChart
                  dates={d.chart_data?.dates}
                  prices={d.chart_data?.prices}
                  predictionDates={d.chart_data?.prediction_dates}
                  predictionPrices={d.chart_data?.prediction_prices}
                />
              </div>

              {/* Metrics */}
              <div style={{ padding: '0 16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Recommendation', value: d.recommendation, color: recColor[d.recommendation] },
                  { label: 'EVS Score', value: `${d.evs?.evs_score?.toFixed(1)} (${d.evs?.evs_level})` },
                  { label: 'ML Prediction', value: `$${d.ml_prediction?.predicted_price?.toFixed(2)}` },
                  { label: 'Sentiment', value: d.sentiment?.label },
                  { label: 'Risk Level', value: d.volatility?.risk },
                  { label: 'Sector', value: d.stock_info?.sector },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ padding: '10px 12px', background: 'var(--surface2)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: color || 'var(--text)' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 
