import { forwardRef } from 'react'
import { AiFillDashboard } from 'react-icons/ai'
import { HiUserAdd } from 'react-icons/hi'
import { IoMenu, IoSettingsOutline } from 'react-icons/io5'
import { useNavBar } from '../context/navBarContext'
import { Link } from '@tanstack/react-router'

const navigationItems = [
  {
    name: 'Dashboard',
    icon: <AiFillDashboard className="text-white text-2xl" />,
    path: '/',
  },
  {
    name: 'Add Data',
    icon: <HiUserAdd className="text-white text-2xl" />,
    path: '/uploadData',
  }
]

const NavBar = forwardRef<HTMLElement>((_props, ref) => {
  // State Variables
  const { isHovering, setIsHovering, navBarWidth } = useNavBar()

  // Event Handlers
  const handleMouseEnter = () => {
    setIsHovering(true)
  }
  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  // Rendered UI
  return (
    <nav 
      ref={ref}
      className={`fixed top-0 left-0 z-100 bg-secondary h-screen transition-all duration-300 ease-in-out`}
      style={{ width: navBarWidth }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col h-full py-6">
        <div className="main-nav flex flex-col items-center gap-16">
          <button onClick={handleMouseEnter} className="flex items-center gap-3 p-3 w-full">
            <IoMenu className={`text-highlights flex-shrink-0 text-3xl ${isHovering ? 'ml-3' : 'mx-auto'}`} />
            {isHovering && <span className="text-white text-sm whitespace-nowrap overflow-hidden">Menu</span>}
          </button>
          
          <div className="flex flex-col items-start gap-6 w-full p-3">
            {navigationItems.map((item) => (
              <Link 
              key={item.name} 
              to={item.path}
              className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors w-full hover:cursor-pointer duration-300 ease-in-out"
              >
                <span className={`flex-shrink-0 ${isHovering ? 'ml-3' : 'mx-auto'}`}>{item.icon}</span>
                {isHovering && <span className="text-white text-sm whitespace-nowrap overflow-hidden">{item.name}</span>}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex justify-center w-full">
          <button className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition-colors w-full hover:cursor-pointer duration-300 ease-in-out" onClick={handleMouseEnter}>
            <IoSettingsOutline className={`text-white text-2xl flex-shrink-0 ${isHovering ? 'ml-3' : 'mx-auto'}`} />
            {isHovering && <span className="text-white text-sm whitespace-nowrap overflow-hidden">Settings</span>}
          </button>
        </div>
      </div>
    </nav>
  )
})

NavBar.displayName = "NavBar"

export default NavBar