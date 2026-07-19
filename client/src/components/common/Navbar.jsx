import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Don't flash the wrong UI while checking localStorage
  if (isLoading) {
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-semibold text-lg text-saffron-600">
            India Biz Listing <span className="text-gray-400 font-normal">₹</span>
          </span>
          <div className="h-8 w-40 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="font-semibold text-lg text-saffron-600 flex items-center gap-1">
          India Biz Listing
          <span className="text-gray-400 font-normal">₹</span>
        </Link>

        {/* Right side */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900
                         px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Dashboard
            </Link>

            {/* User avatar + name */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
              <div className="w-6 h-6 rounded-full bg-saffron-600 flex items-center justify-center text-white text-xs font-semibold">
                {user?.full_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm text-gray-700 font-medium max-w-[120px] truncate">
                {user?.full_name?.split(' ')[0]}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-500
                         px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-gray-900
                         px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm bg-saffron-600 text-white px-4 py-1.5
                         rounded-lg hover:bg-saffron-700 transition-colors font-medium"
            >
              Get listed
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}