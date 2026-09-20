export default function OffersEditor({ value, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">
          Offers &amp; Schemes
          <span className="ml-1.5 text-xs font-normal text-gray-400">
            (optional)
          </span>
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <textarea
        rows={4}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          `Examples:\n` +
          `• 10% off on orders above ₹500\n` +
          `• Free delivery within 2km\n` +
          `• Buy 2 get 1 free on selected items`
        }
        maxLength={500}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm
                   text-gray-900 placeholder:text-gray-300 outline-none resize-none
                   focus:ring-2 focus:ring-saffron-600 focus:border-saffron-600
                   leading-relaxed"
      />

      <div className="flex justify-between mt-1">
        <p className="text-xs text-gray-400">
          Customers see this on your listing page — great for attracting new buyers
        </p>
        <span className="text-xs text-gray-400 flex-shrink-0 ml-3">
          {(value || '').length}/500
        </span>
      </div>
    </div>
  )
}