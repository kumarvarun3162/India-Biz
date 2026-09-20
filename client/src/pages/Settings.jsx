import { useState } from 'react'
import ImageUploader from '../components/listing/ImageUploader'
import { updateProfile } from '../api/auth'
import { useAuth } from '../hooks/useAuth'

export default function Settings() {
  const { user, login } = useAuth()
  const [avatar, setAvatar] = useState(
    user?.avatar_url ? [{ url: user.avatar_url }] : []
  )

  const handleAvatarChange = async (imgs) => {
    setAvatar(imgs)
    if (imgs.length > 0) {
      const res = await updateProfile({ avatar_url: imgs[0].url })
      login(localStorage.getItem('ibl_token'), res.data.data)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5">
        <h2 className="font-medium text-gray-800 mb-4">Profile picture</h2>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-saffron-50
                          flex items-center justify-center flex-shrink-0">
            {avatar.length > 0 ? (
              <img src={avatar[0].url} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-saffron-600">
                {user?.full_name?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <ImageUploader
              images={avatar.slice(0, 1)}
              onChange={handleAvatarChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}