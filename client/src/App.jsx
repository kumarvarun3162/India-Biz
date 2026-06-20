import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'

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
            <Route path="/"                element={<Home />} />
            <Route path="/login"           element={<Login />} />
            <Route path="/register"        element={<Register />} />
            <Route path="/dashboard"       element={<Dashboard />} />
            <Route path="/listing/create"  element={<CreateListing />} />
            <Route path="/listing/edit/:id" element={<EditListing />} />
            <Route path="/listing/:slug"   element={<Analytics />} />
            <Route path="/analytics/:id"   element={<Analytics />} />
            <Route path="/subscription"    element={<Subscription />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/settings"        element={<Settings />} />
            <Route path="/admin"           element={<Admin />} />
            <Route path="*"                element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}