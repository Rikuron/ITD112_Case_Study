import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface NavBarContextType {
  isHovering: boolean
  setIsHovering: (hovering: boolean) => void
  navBarWidth: string
}

const NavBarContext = createContext<NavBarContextType | undefined>(undefined)

export const useNavBar = () => {
  const context = useContext(NavBarContext)
  if (context === undefined) {
    throw new Error('useNavBar must be used within a NavBarProvider')
  }
  return context
}

export const NavBarProvider = ({ children }: { children: ReactNode }) => {
  const [isHovering, setIsHovering] = useState(false)

  const value = {
    isHovering,
    setIsHovering,
    navBarWidth: isHovering ? '20%' : '5%',
  }

  return (
    <NavBarContext.Provider value={value}>
      {children}
    </NavBarContext.Provider>
  )
}