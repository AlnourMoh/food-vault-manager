
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const RestaurantSetupPassword = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  
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
      if (!email) {
        throw new Error("البريد الإلكتروني غير متوفر");
      }

      // Use a stored procedure to handle the insertion with proper types
      const { data, error } = await supabase.rpc('create_restaurant_access', {
        p_restaurant_id: id,
        p_email: email,
        p_password: password
      });

      if (error) {
        throw error;
      }

      toast({
        title: "تم إنشاء كلمة المرور بنجاح",
        description: "يمكنك الآن تسجيل الدخول إلى النظام",
      });
      
      navigate('/restaurant/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ في إنشاء كلمة المرور",
        description: error.message,
      });
      console.error("Error creating credentials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rtl min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>إنشاء كلمة مرور للمطعم: {restaurantName}</CardTitle>
          <CardDescription>مرحباً بك في نظام إدارة المطاعم. يرجى إنشاء كلمة مرور للدخول إلى حسابك.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني</label>
              <Input 
                id="email" 
                type="email" 
                value={email || ''} 
                readOnly
                className="bg-gray-100"
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
              {isLoading ? "جاري الإنشاء..." : "إنشاء كلمة المرور"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantSetupPassword;
