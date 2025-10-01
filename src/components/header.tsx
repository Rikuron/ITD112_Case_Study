import { forwardRef } from 'react'
import { FaUser } from 'react-icons/fa'

const Header = forwardRef<HTMLElement>((_props, ref) => {
  return (
    <header 
      ref={ref}
      className="sticky top-0 z-40 bg-primary border-b-2 border-highlights transition-all duration-300 ease-in-out"
    >
      <div className="px-8 py-3 flex items-center justify-between">
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
})

Header.displayName = "Header"

export default Header
