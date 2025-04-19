
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Settings2, UserRound } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const MobileAccount = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('restaurantId');
      localStorage.removeItem('isRestaurantLogin');
      toast({
        title: "تم تسجيل الخروج بنجاح",
      });
      navigate('/restaurant/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الخروج",
      });
    }
  };

  return (
    <div className="p-4 space-y-6">
      <Card className="p-6 space-y-6">
        {/* User Info Section */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <UserRound className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h2 className="font-medium">صاحب المطعم</h2>
            <p className="text-sm text-muted-foreground">مدير</p>
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-start rtl:flex-row-reverse" 
            onClick={() => navigate('/mobile/account/settings')}
          >
            <Settings2 className="w-4 h-4 me-2 rtl:ml-2" />
            إعدادات الحساب
          </Button>
          
          <Button 
            variant="destructive" 
            className="w-full justify-start rtl:flex-row-reverse"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 me-2 rtl:ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MobileAccount;
