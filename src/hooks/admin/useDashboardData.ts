
import { useState, useEffect } from 'react';
import { getMockData } from '@/services/mockData';
import { Product, InventoryTransaction } from '@/types';

interface DashboardStats {
  totalRestaurants: number;
  totalStorageTeamMembers: number;
  totalProducts: number;
  totalExpiredProducts: number;
  recentTransactions: InventoryTransaction[];
  inventoryValue: number;
  expiringProducts: Product[];
}

interface DashboardData {
  restaurants: {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    manager: string;
    registrationDate: Date;
    isActive: boolean;
  }[];
  storageTeamMembers: {
    id: string;
    name: string;
    role: 'manager' | 'team_member';
    phone: string;
    email: string;
    restaurantId: string;
    restaurantName: string;
    joinDate: Date;
    isActive: boolean;
  }[];
  products: Product[];
  inventoryTransactions: InventoryTransaction[];
  dashboardStats: DashboardStats;
}

interface CategoryData {
  name: string;
  value: number;
}

interface MonthlyData {
  name: string;
  مبيعات: number;
  منتجات: number;
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

  const getCategoryData = (): CategoryData[] => {
    if (!dashboardData?.products) return [];
    
    const categories: Record<string, number> = {};
    
    dashboardData.products.forEach((product) => {
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
    ] as MonthlyData[]
  };
};

