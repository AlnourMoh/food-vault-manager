
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { getMockData } from '@/services/mockData';
import StatsGrid from '@/components/admin/dashboard/StatsGrid';
import MonthlySalesChart from '@/components/admin/dashboard/MonthlySalesChart';
import CategoryDistributionChart from '@/components/admin/dashboard/CategoryDistributionChart';
import CategorySalesChart from '@/components/admin/dashboard/CategorySalesChart';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<any>(null);
  
  useEffect(() => {
    console.log('التحقق من تسجيل دخول المسؤول...');
    const isAdminLoggedIn = localStorage.getItem('isAdminLogin') === 'true';
    console.log('حالة تسجيل دخول المسؤول:', isAdminLoggedIn);
    
    if (!isAdminLoggedIn) {
      console.log('المستخدم غير مسجل دخول، توجيه إلى صفحة تسجيل الدخول');
      navigate('/admin/login');
    } else {
      console.log('المستخدم مسجل دخول بنجاح');
      const data = getMockData();
      setDashboardData(data);
    }
  }, [navigate]);

  const monthlyData = [
    { name: 'يناير', مبيعات: 4000, منتجات: 2400 },
    { name: 'فبراير', مبيعات: 3000, منتجات: 1398 },
    { name: 'مارس', مبيعات: 2000, منتجات: 9800 },
    { name: 'أبريل', مبيعات: 2780, منتجات: 3908 },
    { name: 'مايو', مبيعات: 1890, منتجات: 4800 },
    { name: 'يونيو', مبيعات: 2390, منتجات: 3800 },
    { name: 'يوليو', مبيعات: 3490, منتجات: 4300 },
  ];

  const getCategoryData = () => {
    if (!dashboardData || !dashboardData.products) return [];
    
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

  const categoryData = dashboardData ? getCategoryData() : [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">لوحة تحكم المسؤول</h1>
        
        <StatsGrid dashboardData={dashboardData} />
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <MonthlySalesChart data={monthlyData} />
          <CategoryDistributionChart data={categoryData} />
        </div>
        
        <div className="grid grid-cols-1 gap-6 mt-6">
          <CategorySalesChart data={categoryData} />
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
