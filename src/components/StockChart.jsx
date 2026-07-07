import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function StockChart({ dates, prices, predictionDates, predictionPrices }) {
  if (!dates || !prices) return null

  const historicalData = dates.map((date, i) => ({
    date,
    price: prices[i],
    prediction: null,
  }))

  const recentHistory = historicalData.slice(-30)
  const lastHistoricalPrice = prices[prices.length - 1]

  const predictionData = predictionDates?.slice(-5).map((date, i) => ({
    date,
    price: null,
    prediction: predictionPrices?.[predictionPrices.length - 5 + i] ?? null,
  })) || []

  const bridgePoint = {
    date: recentHistory[recentHistory.length - 1]?.date,
    price: lastHistoricalPrice,
    prediction: lastHistoricalPrice,
  }

  const chartData = [...recentHistory, bridgePoint, ...predictionData]

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: '8px', padding: '10px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
        <div style={{ color: 'var(--muted)', marginBottom: '4px' }}>{label}</div>
        {payload.map(p => p.value !== null && (
          <div key={p.dataKey} style={{ color: p.color }}>
            {p.dataKey === 'price' ? 'Price' : 'Predicted'}: ${Number(p.value).toFixed(2)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.08)" />
        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} tickLine={false} interval="preserveStartEnd" />
        <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v.toFixed(0)}`} width={60} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="price" stroke="#38bdf8" strokeWidth={2} dot={false} connectNulls={false} />
        <Line type="monotone" dataKey="prediction" stroke="#818cf8" strokeWidth={2} strokeDasharray="5 5" dot={false} connectNulls={true} />
      </LineChart>
    </ResponsiveContainer>
  )
} 
