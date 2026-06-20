import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2 font-semibold text-lg text-saffron-600">
          India Biz Listing
          <span className="text-gray-400 font-normal">₹</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-sm bg-saffron-600 text-white px-4 py-1.5 rounded-lg hover:bg-saffron-700 transition-colors font-medium"
          >
            Get listed
          </Link>
        </div>
      </div>
    </nav>
  )
}