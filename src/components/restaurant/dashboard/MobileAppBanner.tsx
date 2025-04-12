
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface MobileAppBannerProps {
  showMobileApp: boolean;
}

const MobileAppBanner: React.FC<MobileAppBannerProps> = ({ showMobileApp }) => {
  const navigate = useNavigate();
  
  if (!showMobileApp) return null;
  
  const goToMobileApp = () => {
    navigate('/restaurant/mobile');
  };

  return (
    <Card className="bg-yellow-50 border-yellow-200">
      <CardContent className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-yellow-800">تطبيق فريق المخزن</h3>
        <p className="text-sm text-yellow-600">
          يبدو أنك تتصفح من جهاز محمول. يمكنك استخدام تطبيق فريق المخزن لإدارة المخزون بشكل أسهل.
        </p>
        <Button 
          onClick={goToMobileApp} 
          className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          فتح تطبيق فريق المخزن
        </Button>
      </CardContent>
    </Card>
  );
};

export default MobileAppBanner;
