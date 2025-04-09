
import React, { useState, useEffect } from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatsCard from '@/components/dashboard/StatsCard';
import { useNavigate } from 'react-router-dom';
import { Package, Scan, ShoppingBasket, History, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showMobileApp, setShowMobileApp] = useState(false);
  
  useEffect(() => {
    // Check if the user is viewing from a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setShowMobileApp(isMobile);
  }, []);
  
  // Redirect to mobile dashboard if on a mobile device
  const goToMobileApp = () => {
    navigate('/restaurant/mobile');
  };
  
  return (
    <RestaurantLayout>
      <div className="rtl space-y-6">
        {showMobileApp && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4 flex flex-col gap-2">
              <h3 className="font-semibold text-yellow-800">تطبيق فريق المخزن</h3>
              <p className="text-sm text-yellow-600">
                يبدو أنك تتصفح من جهاز محمول. يمكنك استخدام تطبيق فريق المخزن لإدارة المخزون بشكل أسهل.
              </p>
              <Button 
                onClick={goToMobileApp} 
                className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                فتح تطبيق فريق المخزن
              </Button>
            </CardContent>
          </Card>
        )}
        
        <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-4">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="inventory">المخزون</TabsTrigger>
            <TabsTrigger value="reports">التقارير</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard 
                title="إجمالي المنتجات" 
                value="342" 
                icon={<Package className="h-4 w-4" />}
                description="العدد الكلي للمنتجات في المخزون"
                trend={{ value: 5, isPositive: true }}
              />
              
              <StatsCard 
                title="منتجات منخفضة" 
                value="24" 
                icon={<ShoppingBasket className="h-4 w-4" />}
                description="منتجات تحتاج إلى إعادة تعبئة"
                trend={{ value: 2, isPositive: false }}
              />
              
              <StatsCard 
                title="حركات المخزون" 
                value="156" 
                icon={<History className="h-4 w-4" />}
                description="عدد حركات المخزون في آخر 30 يوم"
                trend={{ value: 12, isPositive: true }}
              />
              
              <StatsCard 
                title="منتجات منتهية الصلاحية" 
                value="7" 
                icon={<Clock className="h-4 w-4" />}
                description="منتجات تنتهي صلاحيتها خلال 7 أيام"
                trend={{ value: 3, isPositive: false }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium">المنتجات الأكثر استخدامًا</h3>
                  <p className="text-sm text-muted-foreground">قريبًا...</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium">آخر الحركات</h3>
                  <p className="text-sm text-muted-foreground">قريبًا...</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium">تطبيق فريق المخزن</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    استخدم تطبيق فريق المخزن على جهازك المحمول لإدارة المخزون بسهولة.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      onClick={() => navigate('/restaurant/mobile')} 
                      className="bg-fvm-primary hover:bg-fvm-primary-light flex items-center gap-2"
                    >
                      <Scan className="h-4 w-4" />
                      <span>فتح تطبيق فريق المخزن</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
