import { Link } from 'react-router-dom'

const CATEGORIES = [
  { icon: '🍽️', name: 'Restaurants',  slug: 'restaurant' },
  { icon: '🛒', name: 'Kirana',       slug: 'grocery'    },
  { icon: '🔧', name: 'Garages',      slug: 'mechanic'   },
  { icon: '✂️', name: 'Salons',       slug: 'salon'      },
  { icon: '💊', name: 'Medical',      slug: 'medical'    },
  { icon: '📱', name: 'Electronics',  slug: 'electronics'},
  { icon: '📚', name: 'Coaching',     slug: 'tutor'      },
  { icon: '🏗️', name: 'Hardware',     slug: 'hardware'   },
]

const STEPS = [
  { n: '1', title: 'Create an account',  desc: 'Sign up free in 30 seconds with your email or phone' },
  { n: '2', title: 'Fill your listing',  desc: 'Templates auto-fill for your business type'          },
  { n: '3', title: 'Go live instantly',  desc: 'Searchable on India-Biz and Google immediately'       },
]

const STATS = [
  { v: '10+',   l: 'Categories'  },
  { v: '<10m',  l: 'Setup time'  },
  { v: '₹0',   l: 'To start'    },
  { v: '24/7',  l: 'Online'      },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <section className="bg-navy-600 px-4 py-12 sm:py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/15 border
                          border-white/20 text-white/90 text-xs font-medium
                          px-3 py-1.5 rounded-full mb-5">
            🇮🇳 Built for Indian small businesses
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-4">
            Get your business<br />
            <span className="text-brand-500">found online</span> today
          </h1>
          <p className="text-base sm:text-lg text-white/75 mb-7 leading-relaxed
                        max-w-xl mx-auto">
            63 million shops. Most invisible. List yours in under
            10 minutes — no website needed.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/register"
              className="bg-brand-500 hover:bg-brand-600 text-white font-semibold
                         text-sm sm:text-base px-6 sm:px-8 py-3 rounded-full
                         transition-colors shadow-lg shadow-brand-500/30
                         min-h-0">
              List my business — Free
            </Link>
            <Link to="/browse"
              className="bg-white/15 hover:bg-white/25 border border-white/30
                         text-white font-semibold text-sm sm:text-base
                         px-6 sm:px-8 py-3 rounded-full transition-colors min-h-0">
              Browse listings →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-brand-500">
        <div className="max-w-4xl mx-auto px-4 py-4 grid grid-cols-4 gap-2">
          {STATS.map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-white">{s.v}</div>
              <div className="text-xs text-white/75 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        <div className="text-center mb-7">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            All types of businesses
          </h2>
          <p className="text-sm text-gray-400">
            Templates auto-fill for your type — no blank forms
          </p>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={`/browse?category=${c.slug}`}
              className="flex flex-col items-center gap-2 bg-white border
                         border-gray-100 rounded-2xl py-4 sm:py-5
                         hover:border-navy-200 hover:shadow-sm active:bg-gray-50
                         transition-all text-center min-h-0"
            >
              <span className="text-2xl sm:text-3xl">{c.icon}</span>
              <span className="text-xs font-medium text-gray-600 leading-tight px-1">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              Live in 3 steps
            </h2>
            <p className="text-sm text-gray-400">Faster than making chai ☕</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {STEPS.map((s, i) => (
              <div key={s.n}
                className="flex sm:flex-col items-start sm:items-center gap-4
                           sm:gap-3 bg-gray-50 rounded-2xl p-5 flex-1
                           sm:text-center">
                <div className="w-10 h-10 rounded-full bg-navy-600 text-white
                                flex items-center justify-center font-bold
                                text-base flex-shrink-0 min-h-0">
                  {s.n}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm mb-1">
                    {s.title}
                  </div>
                  <div className="text-xs text-gray-400 leading-relaxed">
                    {s.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="max-w-5xl mx-auto px-4 py-10 sm:py-16">
        <div className="bg-navy-600 rounded-3xl px-6 py-10 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Ready to get found?
          </h2>
          <p className="text-white/70 text-sm mb-6">
            Join businesses already listed on India-Biz
          </p>
          <Link to="/register"
            className="inline-block bg-brand-500 hover:bg-brand-600 text-white
                       font-semibold px-8 py-3 rounded-full transition-colors
                       shadow-lg shadow-black/20 min-h-0">
            Create your free listing
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center
                          justify-between gap-4">
            <img src="/logo.png" alt="India-Biz" className="h-14 w-auto" />
            <p className="text-xs text-gray-400 text-center">
              Built by Varun Kumar · Kurukshetra University · 2026
            </p>
            <div className="flex gap-4 text-xs text-gray-400">
              <Link to="/browse"   className="hover:text-gray-600 min-h-0">Browse</Link>
              <Link to="/register" className="hover:text-gray-600 min-h-0">List your business</Link>
              <Link to="/login"    className="hover:text-gray-600 min-h-0">Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}