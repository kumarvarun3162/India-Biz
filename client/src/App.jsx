import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar         from './components/common/Navbar'
import ProtectedRoute from './components/common/ProtectedRoute'
import PublicListing from './pages/PublicListing'

import Home           from './pages/Home'
import Login          from './pages/Login'
import Register       from './pages/Register'
import Dashboard      from './pages/Dashboard'
import CreateListing  from './pages/CreateListing'
import EditListing    from './pages/EditListing'
import Analytics      from './pages/Analytics'
import Subscription   from './pages/Subscription'
import PaymentSuccess from './pages/PaymentSuccess'
import Settings       from './pages/Settings'
import Admin          from './pages/Admin'
import NotFound       from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            {/* Public routes */}
            <Route path="/"       element={<Home />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/listing/:slug" element={<PublicListing />} />

            {/* Protected routes — require login */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            }/>
            <Route path="/listing/create" element={
              <ProtectedRoute><CreateListing /></ProtectedRoute>
            }/>
            <Route path="/listing/edit/:id" element={
              <ProtectedRoute><EditListing /></ProtectedRoute>
            }/>
            <Route path="/analytics/:id" element={
              <ProtectedRoute><Analytics /></ProtectedRoute>
            }/>
            <Route path="/subscription" element={
              <ProtectedRoute><Subscription /></ProtectedRoute>
            }/>
            <Route path="/payment/success" element={
              <ProtectedRoute><PaymentSuccess /></ProtectedRoute>
            }/>
            <Route path="/settings" element={
              <ProtectedRoute><Settings /></ProtectedRoute>
            }/>
            <Route path="/admin" element={
              <ProtectedRoute><Admin /></ProtectedRoute>
            }/>

            {/* Public listing pages — no auth needed */}
            <Route path="/listing/:slug" element={<Analytics />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}