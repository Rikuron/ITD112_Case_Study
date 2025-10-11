import { forwardRef } from 'react'
import { FaUser } from 'react-icons/fa'

const Header = forwardRef<HTMLElement>((_props, ref) => {
  return (
    <header 
      ref={ref}
      className="sticky top-0 z-40 bg-primary border-b-2 border-highlights transition-all duration-300 ease-in-out"
    >
      <div className="px-8 py-3 flex items-center justify-between">
        <h1 className="text-xl md:text-3xl text-white font-inter text-stroke">Emigration Dashboard</h1>
        {/* User Icon */}
        <div className="relative">
          <div className="border-2 border-highlights rounded-full md:w-10 md:h-10 w-8 h-8 overflow-clip">
            <FaUser className="text-highlights mx-auto md:mt-2 mt-1.5 md:text-3xl text-2xl" />
          </div>
        </div>
      </div>
    </header>
  )
})

Header.displayName = "Header"

export default Header
