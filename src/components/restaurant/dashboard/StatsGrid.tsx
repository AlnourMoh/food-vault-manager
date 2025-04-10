
import React from 'react';
import StatsCard from '@/components/dashboard/StatsCard';
import { Package, ShoppingBasket, History, Clock } from 'lucide-react';

const StatsGrid: React.FC = () => {
  return (
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
  );
};

export default StatsGrid;
