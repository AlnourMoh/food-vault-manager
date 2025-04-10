
import { useEffect } from 'react';

export const useLocalStorageSetup = () => {
  // Set default values for localStorage if they don't exist
  useEffect(() => {
    if (!localStorage.getItem('restaurantId')) {
      localStorage.setItem('restaurantId', 'restaurant-demo-123');
    }
    
    if (!localStorage.getItem('teamMemberId')) {
      localStorage.setItem('teamMemberId', 'user-demo-123');
    }
    
    if (!localStorage.getItem('teamMemberName')) {
      localStorage.setItem('teamMemberName', 'سارة الاحمد');
    }
  }, []);
};
