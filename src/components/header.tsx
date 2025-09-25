import React from 'react'
import { FaUser } from 'react-icons/fa'

const Header = () => {
  // State variables


  // Event handlers


  // Rendered UI
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary px-8">
      <div className="px-4 py-3 flex items-center justify-between">
        <h1 className="text-3xl text-white font-inter text-stroke">Emigration Dashboard</h1>
        {/* User Icon */}
        <div className="relative">
          <div className="border-2 border-highlights rounded-full w-10 h-10 overflow-clip">
            <FaUser className="text-highlights mx-auto mt-2 text-3xl" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
