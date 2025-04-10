
import React from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import LoginCard from '@/components/mobile/login/LoginCard';
import { useTeamAuth } from '@/hooks/team/auth/useTeamAuth';

const MobileLogin = () => {
  const auth = useTeamAuth();
  
  return (
    <RestaurantLayout hideSidebar={true}>
      <div className="rtl min-h-screen flex items-center justify-center">
        <LoginCard {...auth} />
      </div>
    </RestaurantLayout>
  );
};

export default MobileLogin;
