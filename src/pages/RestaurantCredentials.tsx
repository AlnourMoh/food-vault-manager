
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const RestaurantCredentials = () => {
  const { id } = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (id) {
        const { data, error } = await supabase
          .from('companies')
          .select('name')
          .eq('id', id)
          .single();

        if (error) {
          console.error("Error fetching restaurant:", error);
          toast({
            variant: "destructive",
            title: "خطأ في جلب بيانات المطعم",
            description: error.message,
          });
          return;
        }

        if (data) {
          setRestaurantName(data.name);
        }
      }
    };

    fetchRestaurant();
  }, [id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "كلمات المرور غير متطابقة",
        description: "يرجى التأكد من تطابق كلمات المرور",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // In a real app, you would hash the password properly on the server side
      // This is a simplified version for demonstration purposes
      const { error } = await supabase
        .from('restaurant_access')
        .insert([
          { 
            restaurant_id: id, 
            email, 
            password_hash: password // Note: In production, NEVER store plain passwords
          }
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: "تم إنشاء بيانات الاعتماد بنجاح",
        description: "يمكن للمطعم الآن تسجيل الدخول إلى النظام",
      });
      
      navigate('/restaurants');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ في إنشاء بيانات الاعتماد",
        description: error.message,
      });
      console.error("Error creating credentials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="rtl space-y-6">
        <h1 className="text-3xl font-bold">إضافة بيانات اعتماد للمطعم</h1>
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>إنشاء حساب للمطعم: {restaurantName}</CardTitle>
            <CardDescription>أدخل بيانات الاعتماد التي سيتم استخدامها لتسجيل دخول المطعم</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني</label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="أدخل البريد الإلكتروني" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">كلمة المرور</label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="أدخل كلمة المرور" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">تأكيد كلمة المرور</label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="أعد إدخال كلمة المرور" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-fvm-primary hover:bg-fvm-primary-light"
                disabled={isLoading}
              >
                {isLoading ? "جاري الإنشاء..." : "إنشاء حساب للمطعم"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/restaurants')}
            >
              العودة إلى قائمة المطاعم
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default RestaurantCredentials;
