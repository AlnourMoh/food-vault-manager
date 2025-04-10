
import React from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import MobileDashboardHeader from '@/components/mobile/dashboard/MobileDashboardHeader';
import ActionCardsContainer from '@/components/mobile/dashboard/ActionCardsContainer';
import { useMobileDashboard } from '@/hooks/useMobileDashboard';

const MobileDashboard = () => {
  const { teamMemberName, handleLogout } = useMobileDashboard();
  
  return (
    <RestaurantLayout hideSidebar={true}>
      <div className="rtl space-y-6 p-2">
        <MobileDashboardHeader 
          teamMemberName={teamMemberName} 
          onLogout={handleLogout} 
        />
        
        <ActionCardsContainer />
      </div>
    </RestaurantLayout>
  );
};

export default MobileDashboard;
