
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useMobileAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isRestaurantLoggedIn = localStorage.getItem('isRestaurantLogin') === 'true';
  
  useEffect(() => {
    if (!isRestaurantLoggedIn && !location.pathname.includes('/login')) {
      navigate('/mobile/login', { state: { from: location }, replace: true });
    } else if (isRestaurantLoggedIn && location.pathname === '/mobile') {
      navigate('/mobile/inventory', { replace: true });
    }
  }, [isRestaurantLoggedIn, location, navigate]);

  return { isRestaurantLoggedIn };
};
