
import { useState, useEffect } from 'react';
import { getMockData } from '@/services/mockData';
import { 
  Product, 
  InventoryTransaction, 
  DashboardData, 
  DashboardStats, 
  CategoryData, 
  MonthlyData 
} from '@/types';

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = getMockData();
        console.log('تم جلب البيانات:', data);
        setDashboardData(data);
      } catch (err) {
        console.error('خطأ في جلب البيانات:', err);
        setError(err instanceof Error ? err : new Error('فشل في جلب بيانات لوحة التحكم'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryData = (): CategoryData[] => {
    if (!dashboardData?.products || dashboardData.products.length === 0) {
      console.log('استخدام بيانات احتياطية للفئات لأن المنتجات فارغة');
      return [
        { name: 'حبوب', value: 50 },
        { name: 'لحوم', value: 30 },
        { name: 'خضروات', value: 15 },
        { name: 'زيوت', value: 20 }
      ];
    }
    
    const categories: Record<string, number> = {};
    
    dashboardData.products.forEach((product) => {
      if (categories[product.category]) {
        categories[product.category] += product.quantity;
      } else {
        categories[product.category] = product.quantity;
      }
    });
    
    return Object.keys(categories).map(name => ({
      name,
      value: categories[name]
    }));
  };

  const categoryData = getCategoryData();
  
  const getMonthlyData = (): MonthlyData[] => {
    // دائمًا تقوم بإرجاع بيانات، حتى لو كانت البيانات الاحتياطية
    return [
      { name: 'يناير', مبيعات: 4000, منتجات: 2400 },
      { name: 'فبراير', مبيعات: 3000, منتجات: 1398 },
      { name: 'مارس', مبيعات: 2000, منتجات: 9800 },
      { name: 'أبريل', مبيعات: 2780, منتجات: 3908 },
      { name: 'مايو', مبيعات: 1890, منتجات: 4800 },
      { name: 'يونيو', مبيعات: 2390, منتجات: 3800 },
      { name: 'يوليو', مبيعات: 3490, منتجات: 4300 },
    ];
  };

  return {
    dashboardData,
    isLoading,
    error,
    categoryData,
    monthlyData: getMonthlyData()
  };
};
