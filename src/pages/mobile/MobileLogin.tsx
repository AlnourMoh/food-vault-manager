
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { authenticateTeamMember } from '@/services/teamAuthService';

const MobileLogin = () => {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pin.trim()) {
      toast({
        title: "يرجى إدخال رمز الدخول",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate login for demo purposes
      const success = pin.length >= 4; // Mock authentication
      
      if (success) {
        // Store team member info in localStorage
        localStorage.setItem('teamMemberId', '123456');
        localStorage.setItem('teamMemberName', 'فريق المخزن');
        
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في نظام إدارة المخزون"
        });
        navigate('/restaurant/mobile');
      } else {
        toast({
          title: "رمز الدخول غير صحيح",
          description: "يرجى التحقق من الرمز وإعادة المحاولة",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RestaurantLayout hideSidebar={true}>
      <div className="rtl min-h-screen flex items-center justify-center">
        <Card className="w-[320px]">
          <CardHeader>
            <CardTitle className="text-xl text-center">تسجيل الدخول</CardTitle>
            <CardDescription className="text-center">
              أدخل رمز الدخول المخصص لك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="رمز الدخول"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </RestaurantLayout>
  );
};

export default MobileLogin;
