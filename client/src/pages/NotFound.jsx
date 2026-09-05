import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-7xl mb-4">🏚️</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-gray-400 mb-8">
          This page doesn't exist or was moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/"
            className="px-5 py-2.5 bg-saffron-600 text-white text-sm font-medium
                       rounded-xl hover:bg-saffron-700 transition-colors">
            Go home
          </Link>
          <Link to="/browse"
            className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm
                       font-medium rounded-xl hover:bg-gray-50 transition-colors">
            Browse listings
          </Link>
        </div>
      </div>
    </div>
  )
}