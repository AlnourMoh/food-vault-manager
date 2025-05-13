
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import SetupLinkForm from '@/components/restaurant/SetupLinkForm';
import SetupLinkDialog from '@/components/restaurant/SetupLinkDialog';
import CredentialActionButtons from '@/components/restaurant/CredentialActionButtons';
import { useRestaurantData } from '@/hooks/useRestaurantData';
import { useRestaurantAccess } from '@/hooks/useRestaurantAccess';
import { useToast } from '@/hooks/use-toast';

const RestaurantCredentials = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [setupLink, setSetupLink] = useState('');
  const { toast } = useToast();
  
  // Check if ID is valid
  useEffect(() => {
    if (!id || id === ':id') {
      toast({
        variant: 'destructive',
        title: 'خطأ في الوصول',
        description: 'معرّف المطعم غير صحيح. سيتم توجيهك إلى صفحة المطاعم.',
      });
      navigate('/admin/restaurants');
    }
  }, [id, navigate, toast]);
  
  // Use our custom hooks
  const { restaurantName, email, updateEmail, isLoading: isLoadingData } = useRestaurantData(id);
  const { handleOpenAccount, isLoading: isLoadingAccess } = useRestaurantAccess(id);

  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || id === ':id') {
      toast({
        variant: 'destructive',
        title: 'خطأ في الوصول',
        description: 'معرّف المطعم غير صحيح. سيتم توجيهك إلى صفحة المطاعم.',
      });
      return;
    }
    
    // Create a setup link with the restaurant ID and email
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/restaurant/setup-password/${id}?email=${encodeURIComponent(email)}`;
    setSetupLink(link);
    setShowDialog(true);
  };

  return (
    <MainLayout>
      <div className="rtl space-y-6">
        <h1 className="text-3xl font-bold">إرسال رابط إعداد حساب المطعم</h1>
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">رابط إعداد الحساب للمطعم: {restaurantName}</CardTitle>
            <CardDescription>أدخل البريد الإلكتروني الذي سيتم استخدامه لتسجيل دخول المطعم ثم قم بإنشاء رابط الإعداد</CardDescription>
          </CardHeader>
          <CardContent>
            <SetupLinkForm 
              email={email}
              setEmail={updateEmail}
              onGenerateLink={handleGenerateLink}
              isLoading={isLoadingData || isLoadingAccess}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <CredentialActionButtons 
              onOpenAccount={handleOpenAccount}
              isLoading={isLoadingData || isLoadingAccess}
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
