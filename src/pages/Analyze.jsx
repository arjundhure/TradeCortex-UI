import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { api } from '../api/client'
import useAuthStore from '../store/useAuthStore'
import StockChart from '../components/StockChart'
import EVSGauge from '../components/EVSGauge'
import RecommendationCard from '../components/RecommendationCard'
import StatCard from '../components/StatCard'
import { useStockSocket } from '../hooks/useStockSocket'

const QUICK_TICKERS = ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN', 'NVDA', 'META']

export default function Analyze() {
  const { user } = useAuthStore()
  const [searchParams] = useSearchParams()
  const [symbol, setSymbol] = useState('')
  const [activeSymbol, setActiveSymbol] = useState(null)
  const [investorType, setInvestorType] = useState(user?.investor_type || 'moderate')
  const { priceData, connected } = useStockSocket(activeSymbol)

  useEffect(() => {
    const sym = searchParams.get('symbol')
    if (sym) { setSymbol(sym); setActiveSymbol(sym) }
  }, [searchParams])

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['analyze', activeSymbol, investorType],
    queryFn: () => api.analyze(activeSymbol, investorType).then(r => r.data),
    enabled: !!activeSymbol,
    staleTime: 60_000,
    retry: 1,
  })

  const handleAnalyze = () => {
    const sym = symbol.trim().toUpperCase()
    if (sym) setActiveSymbol(sym)
  }

  const livePrice = priceData?.price ?? data?.price?.current
  const liveChangePct = priceData?.change_pct ?? data?.price?.change_pct

  return (
    <div style={{ padding: '24px 28px', overflowY: 'auto', height: '100%' }}>

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, maxWidth: '340px' }}>
            <label style={{ display: 'block', fontSize: '10px', color: 'var(--muted)', marginBottom: '7px', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Stock Symbol
            </label>
            <input
              value={symbol}
              onChange={e => setSymbol(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
              placeholder="AAPL"
              style={{ width: '100%', padding: '13px 18px', background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: '10px', color: 'var(--text)', fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 700, letterSpacing: '2px', outline: 'none' }}
            />
          </div>
          <select
            value={investorType}
            onChange={e => setInvestorType(e.target.value)}
            style={{ padding: '13px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', outline: 'none', cursor: 'pointer' }}
          >
            <option value="conservative">🛡️ Conservative</option>
            <option value="moderate">⚖️ Moderate</option>
            <option value="aggressive">🚀 Aggressive</option>
          </select>
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            style={{ padding: '13px 28px', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', border: 'none', borderRadius: '10px', color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Search size={15} />
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {/* Quick tickers */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
          {QUICK_TICKERS.map(t => (
            <button key={t} onClick={() => { setSymbol(t); setActiveSymbol(t) }}
              style={{ padding: '5px 12px', background: activeSymbol === t ? 'rgba(56,189,248,0.1)' : 'var(--surface2)', border: `1px solid ${activeSymbol === t ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '20px', fontSize: '11px', cursor: 'pointer', color: activeSymbol === t ? 'var(--accent)' : 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}
            >
              {t}
            </button>
          ))}
          {connected && (
            <span style={{ padding: '5px 12px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '20px', fontSize: '10px', color: 'var(--accent3)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', background: 'var(--accent3)', borderRadius: '50%', display: 'inline-block' }} />
              LIVE
            </span>
          )}
        </div>
      </div>

      {/* Error */}
      {isError && (
        <div style={{ padding: '16px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '10px', color: 'var(--danger)', fontSize: '13px', marginBottom: '20px' }}>
          {error?.response?.data?.detail || 'Analysis failed. Check the ticker symbol.'}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)', fontSize: '13px' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚡</div>
          Running AI analysis for {activeSymbol}...
        </div>
      )}

      {/* Results */}
      {data && !isLoading && (
        <>
          {/* Stock header */}
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800 }}>{data.symbol}</h2>
            <span style={{ fontSize: '14px', color: 'var(--muted)' }}>{data.stock_info?.name}</span>
            <span style={{ fontSize: '12px', background: 'var(--surface2)', padding: '3px 10px', borderRadius: '20px', color: 'var(--muted)', border: '1px solid var(--border)' }}>{data.stock_info?.sector}</span>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
            <StatCard label="Current Price" value={`$${livePrice?.toFixed(2) || '—'}`} badge={`${liveChangePct >= 0 ? '+' : ''}${liveChangePct?.toFixed(2)}%`} badgeType={liveChangePct >= 0 ? 'up' : 'down'} />
            <StatCard label="ML Prediction" value={`$${data.ml_prediction?.predicted_price?.toFixed(2) || '—'}`} sub={`Accuracy: ${data.ml_prediction?.model_accuracy?.toFixed(1)}%`} badge={data.ml_prediction?.trend} badgeType={data.ml_prediction?.trend === 'UP' ? 'up' : 'down'} />
            <StatCard label="EVS Score" value={data.evs?.evs_score?.toFixed(1) || '—'} sub={`Level: ${data.evs?.evs_level}`} badge={data.evs?.evs_level} badgeType={data.evs?.evs_level === 'Low' ? 'up' : data.evs?.evs_level === 'High' ? 'down' : 'neutral'} />
            <StatCard label="Sentiment" value={data.sentiment?.label || '—'} sub={`Score: ${data.sentiment?.score?.toFixed(3)}`} badge={data.volatility?.risk ? `Risk: ${data.volatility?.risk}` : null} badgeType={data.volatility?.risk === 'Low' ? 'up' : 'down'} />
          </div>

          {/* Chart */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%', display: 'inline-block' }} />
              Price History + ML Prediction
              <span style={{ marginLeft: '16px', fontSize: '11px', color: 'var(--muted)' }}>
                <span style={{ color: 'var(--accent)' }}>—</span> Historical &nbsp;
                <span style={{ color: 'var(--accent2)' }}>- - -</span> Predicted
              </span>
            </div>
            <StockChart
              dates={data.chart_data?.dates}
              prices={data.chart_data?.prices}
              predictionDates={data.chart_data?.prediction_dates}
              predictionPrices={data.chart_data?.prediction_prices}
            />
          </div>

          {/* EVS + Sentiment */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>⚡ Emotional Volatility Score</div>
              <EVSGauge evsScore={data.evs?.evs_score} evsLevel={data.evs?.evs_level} evsDescription={data.evs?.evs_description} />
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>📰 News Sentiment</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data.sentiment?.news?.map((headline, i) => (
                  <div key={i} style={{ fontSize: '11px', color: 'var(--muted)', padding: '8px 12px', background: 'var(--surface2)', borderRadius: '8px', borderLeft: '2px solid var(--border2)', lineHeight: 1.5 }}>
                    {headline}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <RecommendationCard recommendation={data.recommendation} explanation={data.explanation} riskLevel={data.volatility?.risk} />
        </>
      )}

      {/* Empty state */}
      {!activeSymbol && !isLoading && (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--muted)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
            Enter a ticker to begin
          </div>
          <div style={{ fontSize: '12px' }}>Try AAPL, TSLA, GOOGL, MSFT or any stock symbol</div>
        </div>
      )}
    </div>
  )
} 
