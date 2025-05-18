
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CameraPermissionTest } from '@/components/mobile/scanner/components/CameraPermissionTest';

const CameraTest = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 flex flex-col items-center min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">اختبار كاميرا المسح الضوئي</h1>
        
        {/* مكون اختبار تصاريح الكاميرا */}
        <CameraPermissionTest />
        
        <div className="mt-6">
          <Button onClick={() => navigate('/mobile/scan')} variant="outline" className="w-full">
            الانتقال إلى صفحة المسح
          </Button>
          
          <Button onClick={() => navigate(-1)} variant="ghost" className="w-full mt-2">
            رجوع
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CameraTest;
