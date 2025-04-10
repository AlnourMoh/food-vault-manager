
import React from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useDashboardData } from '@/hooks/useDashboardData';

// Import the separated components
import MobileAppBanner from '@/components/restaurant/dashboard/MobileAppBanner';
import StatsGrid from '@/components/restaurant/dashboard/StatsGrid';
import InventoryDataTabs from '@/components/restaurant/dashboard/InventoryDataTabs';
import MobileAppCard from '@/components/restaurant/dashboard/MobileAppCard';
import DashboardTabs from '@/components/restaurant/dashboard/DashboardTabs';

const RestaurantDashboard = () => {
  const { activeTab, setActiveTab, showMobileApp } = useDashboardData();
  
  return (
    <RestaurantLayout>
      <div className="rtl space-y-6">
        <MobileAppBanner showMobileApp={showMobileApp} />
        
        <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          <TabsContent value="overview" className="space-y-6">
            <StatsGrid />
            <InventoryDataTabs />
            <div className="grid grid-cols-1 gap-6">
              <MobileAppCard />
            </div>
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-4">
            <p>محتوى المخزون قريبًا...</p>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <p>محتوى التقارير قريبًا...</p>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <p>محتوى الإعدادات قريبًا...</p>
          </TabsContent>
        </Tabs>
      </div>
    </RestaurantLayout>
  );
};

export default RestaurantDashboard;
