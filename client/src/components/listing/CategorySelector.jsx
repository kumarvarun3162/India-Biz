const CATEGORIES = [
  { slug: 'restaurant',   name: 'Restaurant / Dhaba',         icon: '🍽️' },
  { slug: 'grocery',      name: 'Grocery / Kirana',           icon: '🛒' },
  { slug: 'mechanic',     name: 'Auto Garage',                icon: '🔧' },
  { slug: 'salon',        name: 'Salon / Parlour',            icon: '✂️' },
  { slug: 'medical',      name: 'Medical Store',              icon: '💊' },
  { slug: 'tailor',       name: 'Tailor / Boutique',          icon: '🧵' },
  { slug: 'electronics',  name: 'Electronics / Mobile',       icon: '📱' },
  { slug: 'tutor',        name: 'Tutor / Coaching',           icon: '📚' },
  { slug: 'hardware',     name: 'Hardware Store',             icon: '🏗️' },
  { slug: 'other',        name: 'Other Business',             icon: '🏪' },
]

export default function CategorySelector({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat.slug
        return (
          <button
            key={cat.slug}
            type="button"
            onClick={() => onSelect(cat.slug)}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-xl border-2
              text-center transition-all cursor-pointer
              ${isActive
                ? 'border-saffron-600 bg-saffron-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <span className="text-2xl">{cat.icon}</span>
            <span className={`text-xs font-medium leading-tight ${
              isActive ? 'text-saffron-700' : 'text-gray-600'
            }`}>
              {cat.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}