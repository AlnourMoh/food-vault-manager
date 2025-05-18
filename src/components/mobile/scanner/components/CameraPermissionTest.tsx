
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { checkCameraPermission, requestCameraPermission, testCameraDirectly } from '@/utils/cameraPermissions';
import { ActiveCameraView } from './ActiveCameraView';
import { CameraOff, Check, X, Smartphone, AlertCircle } from 'lucide-react';

export const CameraPermissionTest: React.FC = () => {
  const [permissionState, setPermissionState] = useState<'checking' | 'granted' | 'denied'>('checking');
  const [deviceInfo, setDeviceInfo] = useState<string>('');
  const [cameraStatus, setCameraStatus] = useState<string>('');
  const [isTesting, setIsTesting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  // جمع معلومات الجهاز
  useEffect(() => {
    try {
      const info = [
        `المتصفح: ${navigator.userAgent}`,
        `النافذة: ${window.innerWidth}x${window.innerHeight}`,
        `الشاشة: ${window.screen.width}x${window.screen.height}`,
        `بكسل النسبة: ${window.devicePixelRatio}`
      ].join(' | ');
      setDeviceInfo(info);
    } catch (e) {
      setDeviceInfo('تعذر الحصول على معلومات الجهاز');
    }
  }, []);

  // التحقق من حالة إذن الكاميرا
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const hasPermission = await checkCameraPermission();
        setPermissionState(hasPermission ? 'granted' : 'denied');
        setCameraStatus(hasPermission ? 'تم منح إذن الكاميرا' : 'لم يتم منح إذن الكاميرا');
      } catch (error) {
        console.error('خطأ في التحقق من الإذن:', error);
        setPermissionState('denied');
        setCameraStatus(`خطأ في التحقق من الإذن: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
      }
    };
    
    checkPermission();
  }, []);

  // طلب إذن الكاميرا
  const handleRequestPermission = async () => {
    try {
      setCameraStatus('جاري طلب الإذن...');
      const granted = await requestCameraPermission();
      setPermissionState(granted ? 'granted' : 'denied');
      setCameraStatus(granted ? 'تم منح إذن الكاميرا' : 'تم رفض إذن الكاميرا');
    } catch (error) {
      console.error('خطأ في طلب الإذن:', error);
      setCameraStatus(`خطأ في طلب الإذن: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
  };

  // اختبار الكاميرا مباشرة
  const handleTestCamera = async () => {
    setIsTesting(true);
    setCameraStatus('جاري اختبار الكاميرا...');
    
    try {
      const result = await testCameraDirectly();
      setCameraStatus(result.message);
      
      if (result.success) {
        // عرض عنصر الكاميرا لاختباره بصرياً
        setShowCamera(true);
      }
    } catch (error) {
      console.error('خطأ في اختبار الكاميرا:', error);
      setCameraStatus(`خطأ في اختبار الكاميرا: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* عرض معلومات الجهاز */}
      <div className="bg-slate-100 p-3 rounded-lg text-xs overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <Smartphone className="h-4 w-4" />
          <span className="font-medium">معلومات الجهاز</span>
        </div>
        <div className="overflow-x-auto whitespace-normal break-words">
          {deviceInfo}
        </div>
      </div>
      
      {/* عرض حالة إذن الكاميرا */}
      <div className={`p-4 rounded-lg flex items-center ${
        permissionState === 'checking' ? 'bg-yellow-50 border border-yellow-200' :
        permissionState === 'granted' ? 'bg-green-50 border border-green-200' :
        'bg-red-50 border border-red-200'
      }`}>
        <div className="mr-2">
          {permissionState === 'checking' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
          {permissionState === 'granted' && <Check className="h-5 w-5 text-green-500" />}
          {permissionState === 'denied' && <X className="h-5 w-5 text-red-500" />}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">حالة إذن الكاميرا</h3>
          <p className="text-sm opacity-75">{cameraStatus}</p>
        </div>
        {permissionState === 'denied' && (
          <Button size="sm" onClick={handleRequestPermission} variant="outline">
            طلب الإذن
          </Button>
        )}
      </div>
      
      {/* اختبار الكاميرا */}
      <div className="bg-slate-50 p-4 rounded-lg border">
        <h3 className="font-medium mb-2">اختبار الكاميرا</h3>
        <p className="text-sm mb-3 opacity-75">اختبر ما إذا كان بإمكانك الوصول إلى الكاميرا</p>
        
        <Button 
          onClick={handleTestCamera} 
          disabled={isTesting}
          className="w-full"
        >
          {isTesting ? 'جاري الاختبار...' : 'اختبار الكاميرا'}
        </Button>
      </div>
      
      {/* عرض الكاميرا للاختبار */}
      {showCamera && (
        <div className="mt-4">
          <div className="bg-black relative rounded-lg overflow-hidden" style={{ height: '300px' }}>
            <ActiveCameraView forceActivate={true} />
            <Button 
              className="absolute top-2 right-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm" 
              size="sm" 
              onClick={() => setShowCamera(false)}
            >
              إغلاق
            </Button>
          </div>
          <p className="text-xs text-center mt-2 text-gray-500">
            إذا كانت الكاميرا تعمل، يجب أن ترى الصورة أعلاه
          </p>
        </div>
      )}
    </div>
  );
};
