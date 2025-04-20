
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import StatsGrid from '@/components/admin/dashboard/StatsGrid';
import MonthlySalesChart from '@/components/admin/dashboard/MonthlySalesChart';
import CategoryDistributionChart from '@/components/admin/dashboard/CategoryDistributionChart';
import CategorySalesChart from '@/components/admin/dashboard/CategorySalesChart';
import { useDashboardData } from '@/hooks/admin/useDashboardData';
import { Skeleton } from '@/components/ui/skeleton';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { dashboardData, isLoading, error, categoryData, monthlyData } = useDashboardData();
  
  useEffect(() => {
    console.log('التحقق من تسجيل دخول المسؤول...');
    const isAdminLoggedIn = localStorage.getItem('isAdminLogin') === 'true';
    console.log('حالة تسجيل دخول المسؤول:', isAdminLoggedIn);
    
    if (!isAdminLoggedIn) {
      console.log('المستخدم غير مسجل دخول، توجيه إلى صفحة تسجيل الدخول');
      navigate('/admin/login');
    } else {
      console.log('المستخدم مسجل دخول بنجاح');
    }
  }, [navigate]);

  console.log('بيانات لوحة التحكم:', { dashboardData, categoryData, monthlyData });

  if (error) {
    return (
      <MainLayout>
        <div className="p-4 text-red-500">
          حدث خطأ أثناء تحميل البيانات: {error.message}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">لوحة تحكم المسؤول</h1>
        
        {isLoading ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Skeleton className="h-[300px]" />
              <Skeleton className="h-[300px]" />
            </div>
            
            <div className="grid grid-cols-1 gap-6 mt-6">
              <Skeleton className="h-[300px]" />
            </div>
          </>
        ) : (
          <>
            <StatsGrid dashboardData={dashboardData} />
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <MonthlySalesChart data={monthlyData} />
              <CategoryDistributionChart data={categoryData} />
            </div>
            
            <div className="grid grid-cols-1 gap-6 mt-6">
              <CategorySalesChart data={categoryData} />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
