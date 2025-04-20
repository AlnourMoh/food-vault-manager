
import { useState, useEffect } from 'react';
import { getMockData } from '@/services/mockData';

interface DashboardData {
  restaurants: any[];
  storageTeamMembers: any[];
  products: any[];
  inventoryTransactions: any[];
  dashboardStats: {
    totalRestaurants: number;
    totalStorageTeamMembers: number;
    totalProducts: number;
    totalExpiredProducts: number;
    recentTransactions: any[];
    inventoryValue: number;
    expiringProducts: any[];
  };
}

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = getMockData();
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryData = () => {
    if (!dashboardData?.products) return [];
    
    const categories: Record<string, number> = {};
    
    dashboardData.products.forEach((product: any) => {
      if (categories[product.category]) {
        categories[product.category] += 1;
      } else {
        categories[product.category] = 1;
      }
    });
    
    return Object.keys(categories).map(name => ({
      name,
      value: categories[name]
    }));
  };

  return {
    dashboardData,
    isLoading,
    error,
    categoryData: getCategoryData(),
    monthlyData: [
      { name: 'يناير', مبيعات: 4000, منتجات: 2400 },
      { name: 'فبراير', مبيعات: 3000, منتجات: 1398 },
      { name: 'مارس', مبيعات: 2000, منتجات: 9800 },
      { name: 'أبريل', مبيعات: 2780, منتجات: 3908 },
      { name: 'مايو', مبيعات: 1890, منتجات: 4800 },
      { name: 'يونيو', مبيعات: 2390, منتجات: 3800 },
      { name: 'يوليو', مبيعات: 3490, منتجات: 4300 },
    ]
  };
};

