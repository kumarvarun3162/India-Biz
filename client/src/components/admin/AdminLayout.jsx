import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const NAV = [
  { to: '/admin',            label: 'Overview',  icon: '📊', end: true },
  { to: '/admin/users',      label: 'Users',     icon: '👥' },
  { to: '/admin/listings',   label: 'Listings',  icon: '🏪' },
  { to: '/admin/analytics',  label: 'Analytics', icon: '📈' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="min-h-screen bg-gray-950 flex">

      {/* ── Sidebar ── */}
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex
                        flex-col fixed h-full z-40">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-800">
          <div className="text-saffron-500 font-bold text-base">
            India Biz Listing
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-xs text-gray-400">Admin Panel</span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                transition-all font-medium
                ${isActive
                  ? 'bg-saffron-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }
              `}
            >
              <span className="text-base">{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* Admin info + logout */}
        <div className="px-4 py-4 border-t border-gray-800">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-saffron-600 flex items-center
                            justify-center text-white text-sm font-bold">
              {user?.full_name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="text-xs font-medium text-white">
                {user?.full_name?.split(' ')[0]}
              </div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-xs text-gray-400 hover:text-red-400
                       py-1.5 rounded-lg hover:bg-gray-800 transition-colors text-left px-2"
          >
            ← Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="ml-56 flex-1 min-h-screen bg-gray-950">
        <Outlet />
      </main>
    </div>
  )
}