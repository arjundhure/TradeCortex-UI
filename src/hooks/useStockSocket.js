import { useState, useEffect, useRef } from 'react'

export function useStockSocket(symbol) {
  const [priceData, setPriceData] = useState(null)
  const [connected, setConnected] = useState(false)
  const wsRef = useRef(null)

  useEffect(() => {
    if (!symbol) return

    const connect = () => {
      const ws = new WebSocket(`ws://localhost:8000/ws/price/${symbol}`)
      wsRef.current = ws

      ws.onopen = () => setConnected(true)
      ws.onmessage = (e) => setPriceData(JSON.parse(e.data))
      ws.onclose = () => {
        setConnected(false)
        setTimeout(connect, 5000)
      }
      ws.onerror = () => ws.close()
    }

    connect()
    return () => {
      wsRef.current?.close()
    }
  }, [symbol])

  return { priceData, connected }
} 
