import { forwardRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../context/authContext'
// import { FaUser } from 'react-icons/fa'

const Header = forwardRef<HTMLElement>((_props, ref) => {
  const { user, userProfile, signOut } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate({ to: '/login' })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header 
      ref={ref}
      className="flex justify-between items-center px-6 py-4 sticky top-0 z-40 bg-primary border-b-2 border-highlights transition-all duration-300 ease-in-out"
    >
      <div>
        <h1 className="text-xl md:text-3xl font-inter text-white text-stroke">Emigration Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        {user && userProfile ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary border border-highlights hover:bg-highlights/20 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-highlights flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {userProfile.displayName?.[0]?.toUpperCase() || userProfile.email[0].toUpperCase()}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">
                    {userProfile.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {userProfile.role}
                  </p>
                </div>
              </div>
            </button>

            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-secondary border border-highlights shadow-lg z-20">
                  <div className="p-4 border-b border-highlights">
                    <p className="text-white font-medium">{userProfile.displayName || 'User'}</p>
                    <p className="text-sm text-gray-400">{userProfile.email}</p>
                    <p className="text-xs text-highlights mt-1 capitalize">Role: {userProfile.role}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-md transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate({ to: '/login' })}
            className="px-4 py-2 bg-highlights text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  )
})

Header.displayName = 'Header'

export default Header
