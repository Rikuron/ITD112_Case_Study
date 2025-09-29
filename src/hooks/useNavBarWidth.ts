import { useState, useEffect } from 'react'
import type { RefObject } from 'react'

export const useNavBarWidth = (elementRef: RefObject<HTMLElement | null>) => {
  const [navBarWidth, setNavBarWidth] = useState(0)

  useEffect(() => {
    const updateNavBarWidth = () => {
      if (elementRef.current) {
        setNavBarWidth(elementRef.current.offsetWidth)
      }
    }

    updateNavBarWidth()
    window.addEventListener('resize', updateNavBarWidth)

    return () => {
      window.removeEventListener('resize', updateNavBarWidth)
    }
  }, [elementRef])

  return navBarWidth
}