
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import SetupLinkForm from '@/components/restaurant/SetupLinkForm';
import SetupLinkDialog from '@/components/restaurant/SetupLinkDialog';
import CredentialActionButtons from '@/components/restaurant/CredentialActionButtons';
import { useRestaurantData } from '@/hooks/useRestaurantData';
import { useRestaurantAccess } from '@/hooks/useRestaurantAccess';

const RestaurantCredentials = () => {
  const { id } = useParams();
  const [showDialog, setShowDialog] = useState(false);
  const [setupLink, setSetupLink] = useState('');
  
  // Use our custom hooks
  const { restaurantName, email, updateEmail } = useRestaurantData(id);
  const { handleOpenAccount, isLoading } = useRestaurantAccess(id);

  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    
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
            <CardTitle>رابط إعداد الحساب للمطعم: {restaurantName}</CardTitle>
            <CardDescription>أدخل البريد الإلكتروني الذي سيتم استخدامه لتسجيل دخول المطعم ثم قم بإنشاء رابط الإعداد</CardDescription>
          </CardHeader>
          <CardContent>
            <SetupLinkForm 
              email={email}
              setEmail={updateEmail}
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
