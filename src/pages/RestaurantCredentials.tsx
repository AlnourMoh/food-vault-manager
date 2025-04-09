
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import SetupLinkForm from '@/components/restaurant/SetupLinkForm';
import SetupLinkDialog from '@/components/restaurant/SetupLinkDialog';
import CredentialActionButtons from '@/components/restaurant/CredentialActionButtons';

const RestaurantCredentials = () => {
  const { id } = useParams();
  const [email, setEmail] = useState('');
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
    
    // Create a setup link with the restaurant ID and email
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/restaurant/setup-password/${id}?email=${encodeURIComponent(email)}`;
    setSetupLink(link);
    setShowDialog(true);
  };

  const handleOpenAccount = async () => {
    setIsLoading(true);
    
    try {
      // Check if restaurant has credentials set up
      const { data: credentialsData, error: credentialsError } = await supabase
        .from('restaurant_access')
        .select('*')
        .eq('restaurant_id', id);
      
      if (credentialsError) {
        throw credentialsError;
      }
      
      // If credentials exist (array has items), simulate login
      if (credentialsData && credentialsData.length > 0) {
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
            <SetupLinkForm 
              email={email}
              setEmail={setEmail}
              onGenerateLink={handleGenerateLink}
              isLoading={isLoading}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <CredentialActionButtons 
              onOpenAccount={handleOpenAccount}
              isLoading={isLoading}
            />
          </CardFooter>
        </Card>

        <SetupLinkDialog 
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          setupLink={setupLink}
        />
      </div>
    </MainLayout>
  );
};

export default RestaurantCredentials;
