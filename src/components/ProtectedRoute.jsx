import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--bg)', color: 'var(--accent)',
        fontFamily: 'JetBrains Mono, monospace', fontSize: '13px'
      }}>
        Loading TradeCortex...
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
} 
