import { NavLink, useNavigate } from 'react-router-dom'
import { BarChart2, Search, Clock, GitCompare, LogOut } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'

const navItems = [
  { to: '/',        icon: BarChart2,  label: 'Dashboard' },
  { to: '/analyze', icon: Search,     label: 'Analyze' },
  { to: '/history', icon: Clock,      label: 'History' },
  { to: '/compare', icon: GitCompare, label: 'Compare', badge: 'NEW' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside style={{ width: '260px', height: '100vh', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      
      {/* Brand */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
          📈
        </div>
        <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 800 }}>
          Trade<span style={{ color: 'var(--accent)' }}>Cortex</span>
        </span>
      </div>

      {/* User card */}
      {user && (
        <div style={{ margin: '16px 12px', padding: '12px 14px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 }}>
            {user.full_name?.[0] || '?'}
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600 }}>{user.full_name}</div>
            <div style={{ fontSize: '10px', color: 'var(--accent3)', marginTop: '1px' }}>{user.investor_type}</div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px' }}>
        <div style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '12px 12px 4px' }}>
          Navigation
        </div>
        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '11px',
              padding: '10px 16px', margin: '2px 0', borderRadius: '9px',
              textDecoration: 'none', fontSize: '12px', cursor: 'pointer',
              color: isActive ? 'var(--accent)' : 'var(--muted)',
              background: isActive ? 'linear-gradient(135deg, rgba(56,189,248,0.12), rgba(129,140,248,0.08))' : 'transparent',
              border: isActive ? '1px solid rgba(56,189,248,0.15)' : '1px solid transparent',
              transition: 'all 0.2s',
            })}
          >
            <Icon size={16} />
            <span style={{ flex: 1 }}>{label}</span>
            {badge && (
              <span style={{ fontSize: '9px', background: 'rgba(52,211,153,0.15)', color: 'var(--accent3)', padding: '2px 7px', borderRadius: '20px', border: '1px solid rgba(52,211,153,0.2)' }}>
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', width: '100%', background: 'transparent', border: '1px solid rgba(248,113,113,0.15)', borderRadius: '9px', color: 'var(--danger)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', cursor: 'pointer' }}>
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </aside>
  )
} 
