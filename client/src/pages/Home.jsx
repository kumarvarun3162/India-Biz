import { Link } from 'react-router-dom'

const CATEGORIES = [
  { icon: '🍽️', name: 'Restaurants' },
  { icon: '🛒', name: 'Kirana Stores' },
  { icon: '🔧', name: 'Auto Garages' },
  { icon: '✂️', name: 'Salons' },
  { icon: '💊', name: 'Medical Stores' },
  { icon: '📱', name: 'Electronics' },
  { icon: '📚', name: 'Coaching' },
  { icon: '🏗️', name: 'Hardware' },
]

const HOW_IT_WORKS = [
  { step: '1', title: 'Create an account', desc: 'Sign up free in 30 seconds with your email' },
  { step: '2', title: 'Fill your listing', desc: 'Templates auto-fill for your business type' },
  { step: '3', title: 'Go live instantly', desc: 'Your listing is searchable on our platform immediately' },
]

const STATS = [
  { value: '10+', label: 'Business categories' },
  { value: '< 10 min', label: 'Setup time' },
  { value: '₹0', label: 'To get started' },
  { value: '24/7', label: 'Always online' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-saffron-50 border border-saffron-200
                          text-saffron-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            🇮🇳 Built for Indian small businesses
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-5">
            Get your business<br />
            <span className="text-saffron-600">found online</span> today
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
            India has 63 million small businesses. Most are invisible online.
            List your shop in under 10 minutes — no website needed.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/register"
              className="px-8 py-3.5 bg-saffron-600 text-white font-semibold text-base
                         rounded-xl hover:bg-saffron-700 transition-colors shadow-sm">
              List my business — Free
            </Link>
            <Link to="/browse"
              className="px-8 py-3.5 bg-white border border-gray-200 text-gray-700
                         font-semibold text-base rounded-xl hover:bg-gray-50 transition-colors">
              Browse listings →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-saffron-600">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-saffron-100 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          All types of businesses
        </h2>
        <p className="text-gray-400 text-center text-sm mb-8">
          From dhabas to coaching centres — we have a template for your type
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map((c) => (
            <Link key={c.name} to="/browse"
              className="flex flex-col items-center gap-3 bg-white border border-gray-200
                         rounded-2xl py-6 hover:border-saffron-300 hover:shadow-sm
                         transition-all text-center">
              <span className="text-3xl">{c.icon}</span>
              <span className="text-sm font-medium text-gray-700">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Live in 3 steps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((h) => (
              <div key={h.step} className="text-center">
                <div className="w-12 h-12 bg-saffron-600 text-white rounded-2xl
                                flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {h.step}
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{h.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Ready to get found?
        </h2>
        <p className="text-gray-400 text-sm mb-7">
          Join businesses already listed on India Biz Listing
        </p>
        <Link to="/register"
          className="inline-block px-10 py-3.5 bg-saffron-600 text-white font-semibold
                     text-base rounded-xl hover:bg-saffron-700 transition-colors">
          Create your free listing
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row
                        items-center justify-between gap-3">
          <span className="font-semibold text-saffron-600 text-sm">
            India Biz Listing ₹
          </span>
          <span className="text-xs text-gray-400">
            Built by Varun Kumar · Kurukshetra University
          </span>
          <div className="flex gap-4 text-xs text-gray-400">
            <Link to="/browse" className="hover:text-gray-600">Browse</Link>
            <Link to="/register" className="hover:text-gray-600">List your business</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}