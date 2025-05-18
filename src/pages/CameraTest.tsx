
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CameraPermissionTest } from '@/components/mobile/scanner/components/CameraPermissionTest';
import { ActiveCameraView } from '@/components/mobile/scanner/components/ActiveCameraView';
import { cameraService } from '@/services/camera/CameraService';
import { Loader2, CheckCircle, XCircle, Camera } from 'lucide-react';

const CameraTest = () => {
  const navigate = useNavigate();
  const [testState, setTestState] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    // اختبار سريع للكاميرا عند تحميل الصفحة
    const runQuickTest = async () => {
      try {
        setTestState('testing');
        setTestMessage('جاري اختبار الكاميرا...');
        
        // الانتظار لضمان استقرار الصفحة
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // اختبار سريع للكاميرا
        const result = await cameraService.quickCameraTest();
        
        setTestState(result.success ? 'success' : 'error');
        setTestMessage(result.message);
      } catch (error) {
        setTestState('error');
        setTestMessage(error instanceof Error ? error.message : 'حدث خطأ أثناء اختبار الكاميرا');
      }
    };
    
    runQuickTest();
    
    // تنظيف عند الخروج من الصفحة
    return () => {
      cameraService.stopCamera().catch(console.error);
    };
  }, []);

  // تشغيل الكاميرا بشكل مباشر
  const handleStartCamera = async () => {
    try {
      setShowCamera(true);
    } catch (error) {
      setTestMessage(`فشل في تشغيل الكاميرا: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
  };
  
  // عند رفض السماح للكاميرا بالوصول
  const handlePermissionError = () => {
    setTestState('error');
    setTestMessage('تم رفض إذن الكاميرا. يرجى تمكينه من إعدادات جهازك');
  };

  return (
    <div className="p-4 flex flex-col items-center min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">اختبار كاميرا المسح الضوئي</h1>
        
        {/* عرض نتيجة الاختبار السريع */}
        <div className={`mb-6 p-4 rounded-lg border ${
          testState === 'idle' ? 'border-gray-200 bg-gray-50' :
          testState === 'testing' ? 'border-blue-200 bg-blue-50' :
          testState === 'success' ? 'border-green-200 bg-green-50' :
          'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            {testState === 'idle' && <Camera className="h-5 w-5 text-gray-500" />}
            {testState === 'testing' && <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />}
            {testState === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
            {testState === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
            
            <h3 className="font-medium">
              {testState === 'idle' && 'اختبار الكاميرا'}
              {testState === 'testing' && 'جاري الاختبار...'}
              {testState === 'success' && 'اختبار ناجح'}
              {testState === 'error' && 'فشل الاختبار'}
            </h3>
          </div>
          
          <p className="text-sm opacity-80">{testMessage}</p>
          
          {testState === 'success' && !showCamera && (
            <Button 
              onClick={handleStartCamera} 
              variant="secondary" 
              className="mt-2 w-full"
            >
              <Camera className="h-4 w-4 mr-2" />
              تشغيل الكاميرا
            </Button>
          )}
          
          {testState === 'error' && (
            <div className="space-y-2 mt-2">
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="w-full"
              >
                إعادة الاختبار
              </Button>
            </div>
          )}
        </div>
        
        {/* عرض الكاميرا النشطة */}
        {showCamera && (
          <div className="relative bg-black rounded-lg overflow-hidden mb-6" style={{ height: '350px' }}>
            <ActiveCameraView forceActivate={true} showControls={true} />
            <Button 
              className="absolute top-2 right-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm" 
              size="sm" 
              onClick={() => setShowCamera(false)}
            >
              إغلاق
            </Button>
          </div>
        )}
        
        {/* مكون اختبار تصاريح الكاميرا */}
        <CameraPermissionTest onPermissionError={handlePermissionError} />
        
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
