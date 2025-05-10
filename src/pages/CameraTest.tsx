
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CameraButton from '@/components/mobile/CameraButton';

const CameraTest: React.FC = () => {
  const [imagePath, setImagePath] = useState<string | null>(null);
  
  const handleCaptureSuccess = (path: string) => {
    console.log('تم التقاط صورة بنجاح:', path);
    setImagePath(path);
  };
  
  const handleCaptureError = (error: any) => {
    console.error('خطأ في التقاط الصورة:', error);
  };
  
  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">اختبار الكاميرا</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>تفعيل الكاميرا</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-500">
            اضغط على الزر أدناه لفتح الكاميرا والتقاط صورة. هذا اختبار بسيط 
            للتأكد من عمل الكاميرا بشكل صحيح قبل دمجها مع ماسح الباركود.
          </p>
          
          <CameraButton 
            onSuccess={handleCaptureSuccess}
            onError={handleCaptureError}
          />
          
          {imagePath && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">الصورة الملتقطة:</h3>
              <div className="border rounded-md overflow-hidden">
                <img 
                  src={imagePath} 
                  alt="صورة ملتقطة" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CameraTest;
