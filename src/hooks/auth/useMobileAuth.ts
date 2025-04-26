
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useMobileAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isRestaurantLoggedIn = localStorage.getItem('isRestaurantLogin') === 'true';
  
  useEffect(() => {
    // Skip redirection if we are in the process of logging out
    if (location.pathname.includes('/logout')) {
      return;
    }
    
    // Always prioritize sending logged-in users to /mobile/inventory
    if (isRestaurantLoggedIn) {
      // If already on a valid page, don't redirect
      if (
        location.pathname.includes('/mobile/inventory') ||
        location.pathname.includes('/mobile/scan') ||
        location.pathname.includes('/mobile/products') ||
        location.pathname.includes('/mobile/account')
      ) {
        return;
      }
      
      // Immediately redirect to inventory without any delay or checks
      navigate('/mobile/inventory', { replace: true });
    } else if (!location.pathname.includes('/login')) {
      // If not logged in and not on login page, redirect to login immediately
      navigate('/mobile/login', { state: { from: location }, replace: true });
    }
  }, [isRestaurantLoggedIn, location, navigate]);

  return { isRestaurantLoggedIn };
};
