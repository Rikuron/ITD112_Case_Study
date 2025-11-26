import { forwardRef } from 'react'
import { AiFillDashboard } from 'react-icons/ai'
import { HiUserAdd } from 'react-icons/hi'
import { IoMenu } from 'react-icons/io5'
import { FaDatabase } from 'react-icons/fa'
import { GiCrystalBall } from 'react-icons/gi'
import { useNavBar } from '../context/navBarContext'
import { Link } from '@tanstack/react-router'
import { useAuth } from '../context/authContext'

const navigationItems = [
  {
    name: 'Dashboard',
    icon: <AiFillDashboard className="text-white text-2xl" />,
    path: '/',
  },
  {
    name: 'Predictions',
    icon: <GiCrystalBall className="text-white text-2xl" />,
    path: '/predictions',
  },
  {
    name: 'Add Data',
    icon: <HiUserAdd className="text-white text-2xl" />,
    path: '/uploadData',
  }
]

const NavBar = forwardRef<HTMLElement>((_props, ref) => {
  // State Variables
  const { isHovering, setIsHovering, navBarWidth, isMobile } = useNavBar()
  const { hasPermission } = useAuth()
  
  // Event Handlers
  const handleMouseEnter = () => {
    if (!isMobile) setIsHovering(true)
  }
  const handleMouseLeave = () => {
    if (!isMobile) setIsHovering(false)
  }

  // Rendered UI

  // Mobile view
  if (isMobile) {
    return (
      <nav 
        ref={ref}
        className="fixed bottom-0 left-0 right-0 z-50 bg-secondary h-16 shadow-lg"
      >
        <div className="flex items-center justify-around h-full px-4">
          {navigationItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-white/10 rounded-lg transition-colors flex-1 hover:cursor-pointer duration-300 ease-in-out"
            >
              {item.icon}
              <span className="text-white text-xs">{item.name}</span>
            </Link>
          ))}
          {hasPermission('write') && (
            <Link 
              to="/manageData"
              className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-white/10 rounded-lg transition-colors flex-1 hover:cursor-pointer duration-300 ease-in-out"
            >
              <FaDatabase className="text-white text-2xl" />
              <span className="text-white text-xs">Manage Data</span>
            </Link>
          )}
        </div>
      </nav>
    )
  }

  // Desktop view
  return (
    <nav 
      ref={ref}
      className={`fixed top-0 left-0 z-100 bg-secondary h-screen transition-all duration-300 ease-in-out ${isHovering ? 'border-r-2 border-highlights' : ''}`}
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
            {hasPermission('write') && (
              <Link 
                to="/manageData"
                className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors w-full hover:cursor-pointer duration-300 ease-in-out"
              >
                <span className={`flex-shrink-0 ${isHovering ? 'ml-3' : 'mx-auto'}`}><FaDatabase className="text-white text-2xl" /></span>
                {isHovering && <span className="text-white text-sm whitespace-nowrap overflow-hidden">Manage Data</span>}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
})

NavBar.displayName = "NavBar"

export default NavBar