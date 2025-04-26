
import React, { useState, useEffect } from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMockData } from '@/services/mockData';
import { StatsCard } from '@/components/dashboard/StatsCard';
import StatsGrid from '@/components/admin/dashboard/StatsGrid';
import { useRestaurantData } from '@/hooks/useRestaurantData';
import { ResetPasswordAlert } from '@/components/auth/components/ResetPasswordAlert';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { dashboardStats } = getMockData();
  const restaurantId = localStorage.getItem('restaurantId') || undefined;
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');
  
  const { restaurantName, isLoading } = useRestaurantData(restaurantId);
  const [passwordResetRequests, setPasswordResetRequests] = useState<{ email: string, id: string }[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    const fetchPasswordResetRequests = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('type', 'password_reset_request')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const requests = data?.map(notification => {
          // استخراج البريد الإلكتروني من رسالة الإشعار
          const emailMatch = notification.message.match(/البريد الإلكتروني: ([^\s]+)/);
          const email = emailMatch ? emailMatch[1] : 'غير معروف';
          
          return {
            id: notification.id,
            email: email
          };
        }) || [];

        setPasswordResetRequests(requests);
      } catch (error) {
        console.error('Error fetching password reset requests:', error);
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchPasswordResetRequests();
  }, []);

  const handleCloseRequest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPasswordResetRequests(prev => prev.filter(request => request.id !== id));
    } catch (error) {
      console.error('Error closing request:', error);
    }
  };

  return (
    <RestaurantLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">لوحة تحكم المطعم</h1>

        {!isLoading && restaurantName && (
          <Card>
            <CardHeader>
              <CardTitle>{restaurantName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>مرحبًا بك في لوحة تحكم مطعمك</p>
              {userName && (
                <p className="mt-2">المستخدم: <strong>{userName}</strong> | الدور: <strong>{userRole === 'admin' ? 'مدير النظام' : userRole === 'staff' ? 'إدارة المخزن' : 'مستخدم'}</strong></p>
              )}
              {userEmail && <p className="text-muted-foreground text-sm">البريد الإلكتروني: {userEmail}</p>}
            </CardContent>
          </Card>
        )}

        {passwordResetRequests.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">طلبات إعادة تعيين كلمة المرور</h2>
            {passwordResetRequests.map(request => (
              <ResetPasswordAlert 
                key={request.id}
                email={request.email}
                onClose={() => handleCloseRequest(request.id)}
              />
            ))}
          </div>
        )}

        <StatsGrid dashboardData={null} />
      </div>
    </RestaurantLayout>
  );
};

export default Dashboard;
