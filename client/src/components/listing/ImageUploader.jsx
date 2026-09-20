import { useState, useRef } from 'react'
import axiosInstance from '../../api/axiosInstance'

const MAX_IMAGES = 6

export default function ImageUploader({ images = [], onChange }) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver]   = useState(false)
  const [error, setError]         = useState('')
  const inputRef = useRef()

  const uploadFile = async (file) => {
    // Client-side validation before sending
    if (!['image/jpeg','image/png','image/webp','image/jpg']
        .includes(file.type)) {
      setError('Only JPEG, PNG, or WebP images allowed')
      return null
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Each image must be under 5MB')
      return null
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axiosInstance.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return { url: res.data.url, public_id: res.data.public_id }
    } catch (e) {
      setError(e.response?.data?.detail || 'Upload failed')
      return null
    }
  }

  const handleFiles = async (files) => {
    setError('')
    const remaining = MAX_IMAGES - images.length
    if (remaining <= 0) {
      setError(`Maximum ${MAX_IMAGES} photos allowed`)
      return
    }

    const toUpload = Array.from(files).slice(0, remaining)
    setUploading(true)

    const results = await Promise.all(toUpload.map(uploadFile))
    const successful = results.filter(Boolean)

    if (successful.length > 0) {
      onChange([...images, ...successful])
    }
    setUploading(false)
  }

  const handleRemove = async (index) => {
    const img = images[index]
    // Delete from Cloudinary
    if (img.public_id) {
      try {
        await axiosInstance.delete(
          `/api/upload/${encodeURIComponent(img.public_id)}`
        )
      } catch (e) {
        console.warn('Could not delete from Cloudinary:', e)
      }
    }
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div>
      {/* Drop zone */}
      {images.length < MAX_IMAGES && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            handleFiles(e.dataTransfer.files)
          }}
          className={`
            border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
            transition-all mb-4
            ${dragOver
              ? 'border-saffron-500 bg-saffron-50'
              : 'border-gray-200 hover:border-saffron-400 hover:bg-gray-50'
            }
          `}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-saffron-600 border-t-transparent
                              rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            <>
              <div className="text-3xl mb-2">📸</div>
              <p className="text-sm font-medium text-gray-700">
                Click to upload or drag photos here
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPEG, PNG, WebP · Max 5MB each ·{' '}
                {images.length}/{MAX_IMAGES} photos
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 mb-3">{error}</p>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative group aspect-square">
              <img
                src={img.url}
                alt={`Shop photo ${i + 1}`}
                className="w-full h-full object-cover rounded-xl border border-gray-200"
              />
              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500
                           text-white rounded-full text-xs font-bold
                           opacity-0 group-hover:opacity-100 transition-opacity
                           flex items-center justify-center leading-none"
              >
                ×
              </button>
              {/* Cover badge */}
              {i === 0 && (
                <span className="absolute bottom-1.5 left-1.5 text-xs
                                 bg-black/60 text-white px-1.5 py-0.5
                                 rounded-md font-medium">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}