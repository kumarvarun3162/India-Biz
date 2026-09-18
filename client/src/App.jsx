import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar         from './components/common/Navbar'
import ProtectedRoute from './components/common/ProtectedRoute'
import AdminRoute     from './components/common/AdminRoute'
import AdminLayout    from './components/admin/AdminLayout'

import Home           from './pages/Home'
import Browse         from './pages/Browse'
import Login          from './pages/Login'
import Register       from './pages/Register'
import Dashboard      from './pages/Dashboard'
import CreateListing  from './pages/CreateListing'
import EditListing    from './pages/EditListing'
import PublicListing  from './pages/PublicListing'
import Settings       from './pages/Settings'
import NotFound       from './pages/NotFound'
import AdminOverview  from './pages/admin/AdminOverview'
import AdminUsers     from './pages/admin/AdminUsers'
import AdminListings  from './pages/admin/AdminListings'
import AdminAnalytics from './pages/admin/AdminAnalytics'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            {/* Public */}
            <Route path="/"              element={<Home />} />
            <Route path="/browse"        element={<Browse />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/register"      element={<Register />} />
            <Route path="/listing/:slug" element={<PublicListing />} />

            {/* Protected */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/listing/create" element={
              <ProtectedRoute><CreateListing /></ProtectedRoute>} />
            <Route path="/listing/edit/:id" element={
              <ProtectedRoute><EditListing /></ProtectedRoute>} />
            <Route path="/settings" element={
              <ProtectedRoute><Settings /></ProtectedRoute>} />

            {/* Admin — hidden from normal UI, role-protected */}
            <Route path="/admin" element={
              <AdminRoute><AdminLayout /></AdminRoute>
            }>
              <Route index             element={<AdminOverview />} />
              <Route path="users"      element={<AdminUsers />} />
              <Route path="listings"   element={<AdminListings />} />
              <Route path="analytics"  element={<AdminAnalytics />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}