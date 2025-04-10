
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

// Import for the additional tabs
import { Skeleton } from '@/components/ui/skeleton';

const RestaurantDashboard = () => {
  const { activeTab, setActiveTab, showMobileApp, stats, loading } = useDashboardData();
  
  return (
    <RestaurantLayout>
      <div className="rtl space-y-6">
        <MobileAppBanner showMobileApp={showMobileApp} />
        
        <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          <TabsContent value="overview" className="space-y-6">
            <StatsGrid stats={stats} loading={loading} />
            <InventoryDataTabs />
            <div className="grid grid-cols-1 gap-6">
              <MobileAppCard />
            </div>
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-4">إدارة المخزون</h2>
                <p className="text-muted-foreground">
                  يمكنك من هنا عرض كافة المنتجات في المخزون، وإدارة الكميات والتنبيهات.
                  قريباً سيتم إضافة المزيد من الميزات المتقدمة لإدارة المخزون.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-4">تقارير المخزون</h2>
                <p className="text-muted-foreground">
                  قريباً سيتم إضافة تقارير تفصيلية عن حركة المخزون، الاستهلاك، والتكاليف.
                  تابعونا للحصول على تحديثات جديدة.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-4">إعدادات المخزون</h2>
                <p className="text-muted-foreground">
                  قريباً ستتمكن من تخصيص إعدادات المخزون، تنبيهات المنتجات منخفضة الكمية،
                  وإعدادات الطباعة والباركود.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </RestaurantLayout>
  );
};

export default RestaurantDashboard;
