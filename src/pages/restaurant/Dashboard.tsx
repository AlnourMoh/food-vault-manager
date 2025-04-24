
import React, { useState, useEffect } from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { supabase } from '@/integrations/supabase/client';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ResetPasswordAlert } from '@/components/auth/components/ResetPasswordAlert';

interface ResetPasswordRequest {
  id: string;
  title: string;
  message: string;
  email: string;
  created_at: string;
}

const RestaurantDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    expiringSoonProducts: 0,
    expiredProducts: 0
  });
  const [passwordResetRequests, setPasswordResetRequests] = useState<ResetPasswordRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const restaurantId = localStorage.getItem('restaurantId');

  useEffect(() => {
    if (restaurantId) {
      fetchDashboardData();
      fetchPasswordResetRequests();
    }
  }, [restaurantId]);

  const fetchDashboardData = async () => {
    try {
      // Fetch total products
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', restaurantId);

      // Fetch low stock products
      const { count: lowStockProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', restaurantId)
        .lt('quantity', 10);

      // Fetch expiring soon products (within 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const { count: expiringSoonProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', restaurantId)
        .gt('expiry_date', new Date().toISOString())
        .lt('expiry_date', thirtyDaysFromNow.toISOString());

      // Fetch expired products
      const { count: expiredProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', restaurantId)
        .lt('expiry_date', new Date().toISOString());

      setStats({
        totalProducts: totalProducts || 0,
        lowStockProducts: lowStockProducts || 0,
        expiringSoonProducts: expiringSoonProducts || 0,
        expiredProducts: expiredProducts || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPasswordResetRequests = async () => {
    try {
      // نستخرج طلبات إعادة تعيين كلمة المرور من جدول الإشعارات
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('type', 'password_reset_request')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // استخراج البريد الإلكتروني من الرسائل
      const requests = data.map(notification => {
        // استخراج البريد الإلكتروني من الرسالة باستخدام تعبير منتظم
        const emailMatch = notification.message.match(/البريد الإلكتروني: ([^\s]+)/);
        const email = emailMatch ? emailMatch[1] : '';

        return {
          id: notification.id,
          title: notification.title,
          message: notification.message,
          email: email,
          created_at: notification.created_at
        };
      });

      setPasswordResetRequests(requests);
    } catch (error) {
      console.error('Error fetching password reset requests:', error);
    }
  };

  const handleClosePasswordResetRequest = async (requestId: string) => {
    try {
      // حذف طلب إعادة تعيين كلمة المرور من قاعدة البيانات
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      // تحديث القائمة
      setPasswordResetRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
    } catch (error) {
      console.error('Error closing password reset request:', error);
    }
  };

  return (
    <RestaurantLayout>
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold">لوحة المعلومات</h1>
        
        {!loading && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="إجمالي المنتجات" value={stats.totalProducts} />
            <StatsCard title="منتجات منخفضة المخزون" value={stats.lowStockProducts} />
            <StatsCard title="منتجات تنتهي قريبًا" value={stats.expiringSoonProducts} />
            <StatsCard title="منتجات منتهية الصلاحية" value={stats.expiredProducts} />
          </div>
        )}

        {/* قسم طلبات إعادة تعيين كلمة المرور */}
        {passwordResetRequests.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">طلبات إعادة تعيين كلمة المرور</h2>
            <div className="space-y-4">
              {passwordResetRequests.map(request => (
                <ResetPasswordAlert 
                  key={request.id} 
                  email={request.email}
                  onClose={() => handleClosePasswordResetRequest(request.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </RestaurantLayout>
  );
};

export default RestaurantDashboard;
