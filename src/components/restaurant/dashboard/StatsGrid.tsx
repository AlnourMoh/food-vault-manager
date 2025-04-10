
import React from 'react';
import StatsCard from '@/components/dashboard/StatsCard';
import { Package, ShoppingBasket, History, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsGridProps {
  stats: {
    totalProducts: number;
    lowStockProducts: number;
    inventoryMovements: number;
    expiringProducts: number;
  };
  loading: boolean;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="p-6 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard 
        title="إجمالي المنتجات" 
        value={stats.totalProducts.toString()} 
        icon={<Package className="h-4 w-4" />}
        description="العدد الكلي للمنتجات في المخزون"
        trend={{ value: 5, isPositive: true }}
      />
      
      <StatsCard 
        title="منتجات منخفضة" 
        value={stats.lowStockProducts.toString()} 
        icon={<ShoppingBasket className="h-4 w-4" />}
        description="منتجات تحتاج إلى إعادة تعبئة"
        trend={{ value: 2, isPositive: false }}
      />
      
      <StatsCard 
        title="حركات المخزون" 
        value={stats.inventoryMovements.toString()} 
        icon={<History className="h-4 w-4" />}
        description="عدد حركات المخزون في آخر 30 يوم"
        trend={{ value: 12, isPositive: true }}
      />
      
      <StatsCard 
        title="منتجات منتهية الصلاحية" 
        value={stats.expiringProducts.toString()} 
        icon={<Clock className="h-4 w-4" />}
        description="منتجات تنتهي صلاحيتها خلال 7 أيام"
        trend={{ value: 3, isPositive: false }}
      />
    </div>
  );
};

export default StatsGrid;
