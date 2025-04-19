
import { useState, useEffect } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Set the initial value
    checkIfMobile()
    
    // Add event listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Modern approach using addEventListener
    mql.addEventListener("change", checkIfMobile)
    
    // Return a cleanup function
    return () => {
      mql.removeEventListener("change", checkIfMobile)
    }
  }, []) // Empty dependency array means this effect runs once on mount

  return isMobile
}
