import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  if (isLoading) return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 h-14">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="h-7 w-28 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-8 w-20 bg-gray-100 rounded-full animate-pulse" />
      </div>
    </nav>
  )

  return (
    <>
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img
              src="/logo.png"
              alt="India-Biz"
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-2">
            <Link to="/browse"
              className={`text-sm px-3 py-2 rounded-lg transition-colors min-h-0
                ${isActive('/browse')
                  ? 'text-navy-600 font-medium bg-navy-50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}>
              Browse
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard"
                className={`text-sm px-3 py-2 rounded-lg transition-colors min-h-0
                  ${isActive('/dashboard')
                    ? 'text-navy-600 font-medium bg-navy-50'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}>
                Dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 ml-1">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full
                                bg-gray-50 border border-gray-200 min-h-0">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name}
                      className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-navy-600 flex items-center
                                    justify-center text-white text-xs font-semibold">
                      {user?.full_name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-gray-700 font-medium max-w-[100px] truncate">
                    {user?.full_name?.split(' ')[0]}
                  </span>
                </div>
                <button onClick={handleLogout}
                  className="text-sm text-gray-400 hover:text-red-500 px-3
                             hover:bg-red-50 rounded-lg transition-colors min-h-0">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Link to="/login"
                  className="text-sm text-gray-600 hover:text-gray-900 px-3
                             hover:bg-gray-50 rounded-lg transition-colors min-h-0">
                  Login
                </Link>
                <Link to="/register"
                  className="text-sm bg-navy-600 text-white px-4 py-2 rounded-full
                             hover:bg-navy-700 transition-colors font-medium min-h-0">
                  Get listed free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile right side */}
          <div className="flex sm:hidden items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/listing/create"
                  className="text-xs bg-brand-500 text-white px-3 py-1.5
                             rounded-full font-medium min-h-0">
                  + List
                </Link>
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt=""
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="w-8 h-8 rounded-full object-cover cursor-pointer border-2
                               border-navy-100" />
                ) : (
                  <button onClick={() => setMenuOpen(!menuOpen)}
                    className="w-8 h-8 rounded-full bg-navy-600 flex items-center
                               justify-center text-white text-sm font-semibold min-h-0">
                    {user?.full_name?.[0]?.toUpperCase()}
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"
                  className="text-xs text-navy-600 font-medium px-3 py-1.5
                             border border-navy-200 rounded-full min-h-0">
                  Login
                </Link>
                <Link to="/register"
                  className="text-xs bg-navy-600 text-white px-3 py-1.5
                             rounded-full font-medium min-h-0">
                  List free
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && isAuthenticated && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setMenuOpen(false)} />
          <div className="fixed top-14 right-0 left-0 z-50 bg-white border-b
                          border-gray-100 shadow-lg sm:hidden">
            <div className="flex flex-col py-2">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt=""
                    className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-navy-600 flex items-center
                                  justify-center text-white font-semibold">
                    {user?.full_name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium text-gray-900">{user?.full_name}</div>
                  <div className="text-xs text-gray-400">{user?.email || user?.phone}</div>
                </div>
              </div>
              {[
                { to: '/browse',     label: '🔍 Browse listings' },
                { to: '/dashboard',  label: '🏪 My listings'     },
                { to: '/settings',   label: '⚙️ Settings'         },
              ].map((item) => (
                <Link key={item.to} to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50
                             transition-colors text-left min-h-0 justify-start">
                  {item.label}
                </Link>
              ))}
              <button onClick={handleLogout}
                className="px-4 py-3 text-sm text-red-500 hover:bg-red-50
                           transition-colors text-left justify-start min-h-0">
                ← Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}