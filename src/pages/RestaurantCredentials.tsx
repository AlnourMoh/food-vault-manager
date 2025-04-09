
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Copy, KeyRound } from 'lucide-react';

const RestaurantCredentials = () => {
  const { id } = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [setupLink, setSetupLink] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (id) {
        const { data, error } = await supabase
          .from('companies')
          .select('name, email')
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
          setEmail(data.email || '');
        }
      }
    };

    fetchRestaurant();
  }, [id, toast]);

  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        variant: "destructive",
        title: "البريد الإلكتروني مطلوب",
        description: "يرجى إدخال البريد الإلكتروني للمطعم",
      });
      return;
    }

    // Create a setup link with the restaurant ID and email
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/restaurant/setup-password/${id}?email=${encodeURIComponent(email)}`;
    setSetupLink(link);
    setShowDialog(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(setupLink);
    toast({
      title: "تم نسخ الرابط",
      description: "يمكنك مشاركة الرابط مع مدير المطعم",
    });
  };

  const handleOpenAccount = async () => {
    setIsLoading(true);
    
    try {
      // Check if restaurant has credentials set up
      const { data: credentialsData, error: credentialsError } = await supabase
        .from('restaurant_access')
        .select('*')
        .eq('restaurant_id', id)
        .single();
      
      if (credentialsError && credentialsError.code !== 'PGRST116') {
        throw credentialsError;
      }
      
      // If credentials exist, simulate login
      if (credentialsData) {
        localStorage.setItem('restaurantId', id as string);
        localStorage.setItem('isRestaurantLogin', 'true');
        
        toast({
          title: "تم فتح حساب المطعم",
          description: "تم تسجيل الدخول إلى حساب المطعم بنجاح",
        });
        
        navigate('/restaurant/dashboard');
      } else {
        // No credentials, alert user
        toast({
          variant: "destructive",
          title: "لم يتم إعداد الحساب بعد",
          description: "يجب على مدير المطعم إعداد كلمة المرور أولاً",
        });
      }
    } catch (error: any) {
      console.error("Error accessing restaurant account:", error);
      toast({
        variant: "destructive",
        title: "خطأ في الوصول إلى حساب المطعم",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="rtl space-y-6">
        <h1 className="text-3xl font-bold">إرسال رابط إعداد حساب المطعم</h1>
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>رابط إعداد الحساب للمطعم: {restaurantName}</CardTitle>
            <CardDescription>أدخل البريد الإلكتروني الذي سيتم استخدامه لتسجيل دخول المطعم ثم قم بإنشاء رابط الإعداد</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerateLink} className="space-y-4">
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
              <Button 
                type="submit" 
                className="bg-fvm-primary hover:bg-fvm-primary-light w-full"
                disabled={isLoading}
              >
                إنشاء رابط الإعداد
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 text-fvm-primary border-fvm-primary hover:bg-fvm-primary-light hover:text-white"
              onClick={handleOpenAccount}
              disabled={isLoading}
            >
              <KeyRound className="h-4 w-4" />
              <span>فتح حساب المطعم</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/restaurants')}
              className="w-full"
            >
              العودة إلى قائمة المطاعم
            </Button>
          </CardFooter>
        </Card>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="rtl">
            <DialogHeader>
              <DialogTitle>رابط إعداد حساب المطعم</DialogTitle>
              <DialogDescription>
                شارك هذا الرابط مع مدير المطعم ليتمكن من إعداد كلمة المرور الخاصة به
              </DialogDescription>
            </DialogHeader>
            <div className="bg-gray-100 p-3 rounded-md break-all text-sm">
              {setupLink}
            </div>
            <DialogFooter>
              <Button 
                className="bg-fvm-primary hover:bg-fvm-primary-light w-full flex items-center gap-2 justify-center" 
                onClick={handleCopyLink}
              >
                <Copy className="h-4 w-4" />
                <span>نسخ الرابط</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default RestaurantCredentials;
