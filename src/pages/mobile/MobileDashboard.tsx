
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import useDeviceDetection from '@/hooks/useDeviceDetection';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, ArrowDownToLine, LogOut } from 'lucide-react';
import { logoutTeamMember } from '@/services/teamAuthService';
import { useToast } from '@/components/ui/use-toast';

const MobileDashboard = () => {
  const { isMobile } = useDeviceDetection();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const teamMemberName = localStorage.getItem('teamMemberName') || 'فريق المخزن';

  const handleLogout = () => {
    logoutTeamMember();
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل الخروج بنجاح"
    });
    navigate('/restaurant/mobile/login');
  };

  return (
    <RestaurantLayout hideSidebar={isMobile}>
      <div className="rtl space-y-6 p-2">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">مرحبًا، {teamMemberName}</h1>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 text-red-500 border-red-200 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>تسجيل الخروج</span>
          </Button>
        </div>
        
        <h2 className="text-lg font-medium mb-3">إدارة المخزون</h2>
        
        <div className="grid grid-cols-1 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <Button 
                variant="ghost" 
                className="w-full h-full flex items-center justify-center gap-2 p-6" 
                onClick={() => navigate('/restaurant/mobile/add')}
              >
                <ArrowDownToLine className="h-6 w-6 text-green-600" />
                <span className="text-lg">إدخال منتج</span>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <Button 
                variant="ghost" 
                className="w-full h-full flex items-center justify-center gap-2 p-6" 
                onClick={() => navigate('/restaurant/mobile/remove')}
              >
                <ArrowRightLeft className="h-6 w-6 text-red-600" />
                <span className="text-lg">إخراج منتج</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </RestaurantLayout>
  );
};

export default MobileDashboard;
