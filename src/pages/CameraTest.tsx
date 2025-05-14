
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { scannerOperationsService } from '@/services/scanner/ScannerOperationsService';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';

const CameraTest = () => {
  const navigate = useNavigate();
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  
  useEffect(() => {
    const checkCapabilities = async () => {
      try {
        // التحقق من دعم الماسح الضوئي
        const supported = await scannerPermissionService.isSupported();
        setIsSupported(supported);
        
        if (supported) {
          // التحقق من وجود إذن الكاميرا
          const permission = await scannerPermissionService.checkPermission();
          setHasPermission(permission);
          
          // إظهار رسالة مناسبة للمستخدم
          if (!permission) {
            Toast.show({
              text: 'يتطلب المسح الضوئي إذن الكاميرا',
              duration: 'short'
            });
          }
        } else {
          Toast.show({
            text: 'هذا الجهاز لا يدعم ماسح الباركود',
            duration: 'long'
          });
        }
      } catch (error) {
        console.error('خطأ في فحص دعم الماسح:', error);
      }
    };
    
    checkCapabilities();
  }, []);

  const handleRequestPermission = async () => {
    try {
      const granted = await scannerPermissionService.requestPermission();
      setHasPermission(granted);
      
      if (granted) {
        Toast.show({
          text: 'تم منح إذن الكاميرا بنجاح',
          duration: 'short'
        });
      } else {
        Toast.show({
          text: 'تم رفض إذن الكاميرا، يرجى تمكينه في الإعدادات',
          duration: 'long'
        });
      }
    } catch (error) {
      console.error('خطأ في طلب الإذن:', error);
    }
  };

  const handleOpenSettings = async () => {
    try {
      await scannerPermissionService.openAppSettings();
    } catch (error) {
      console.error('خطأ في فتح الإعدادات:', error);
    }
  };

  const handleScan = async () => {
    try {
      setIsScanning(true);
      setScanResult(null);
      
      await scannerOperationsService.startScan((code) => {
        console.log('تم مسح الرمز:', code);
        setScanResult(code);
        setIsScanning(false);
        
        Toast.show({
          text: `تم مسح الرمز: ${code}`,
          duration: 'long'
        });
      });
    } catch (error) {
      console.error('خطأ في بدء المسح:', error);
      setIsScanning(false);
      
      Toast.show({
        text: 'حدث خطأ أثناء محاولة بدء المسح',
        duration: 'long'
      });
    }
  };

  const handleStopScan = async () => {
    try {
      // إصلاح: إزالة المعامل من استدعاء stopScan()
      await scannerOperationsService.stopScan();
      setIsScanning(false);
      
      Toast.show({
        text: 'تم إيقاف المسح',
        duration: 'short'
      });
    } catch (error) {
      console.error('خطأ في إيقاف المسح:', error);
    }
  };

  const renderPlatformInfo = () => {
    const platform = Capacitor.getPlatform();
    const isNative = Capacitor.isNativePlatform();
    
    return (
      <div className="mb-4 p-3 bg-blue-50 rounded-md text-blue-700 text-sm">
        <p>المنصة: {platform}</p>
        <p>بيئة جهاز جوال: {isNative ? 'نعم' : 'لا'}</p>
        <p>المسح الضوئي مدعوم: {isSupported === null ? 'جاري التحقق...' : isSupported ? 'نعم' : 'لا'}</p>
        <p>إذن الكاميرا: {hasPermission === null ? 'لم يتم التحقق' : hasPermission ? 'ممنوح' : 'غير ممنوح'}</p>
      </div>
    );
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">اختبار كاميرا المسح الضوئي</h1>
      
      {renderPlatformInfo()}
      
      {scanResult && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg w-full max-w-md">
          <h2 className="font-bold text-green-700 mb-2">نتيجة المسح:</h2>
          <p className="text-green-800 break-all">{scanResult}</p>
        </div>
      )}
      
      <div className="space-y-4 w-full max-w-md">
        {hasPermission === false && (
          <>
            <Button onClick={handleRequestPermission} className="w-full bg-blue-500 hover:bg-blue-600">
              طلب إذن الكاميرا
            </Button>
            
            <Button onClick={handleOpenSettings} variant="outline" className="w-full">
              فتح إعدادات التطبيق
            </Button>
          </>
        )}
        
        {isSupported && hasPermission && (
          <>
            <Button 
              onClick={handleScan} 
              className="w-full" 
              disabled={isScanning || !isSupported || !hasPermission}
            >
              {isScanning ? 'جاري المسح...' : 'بدء المسح الضوئي'}
            </Button>
            
            {isScanning && (
              <Button onClick={handleStopScan} variant="secondary" className="w-full">
                إيقاف المسح الضوئي
              </Button>
            )}
          </>
        )}
        
        <Button onClick={() => navigate('/mobile/scan')} variant="outline" className="w-full">
          الانتقال إلى صفحة المسح
        </Button>
        
        <Button onClick={() => navigate(-1)} variant="ghost" className="w-full">
          رجوع
        </Button>
      </div>
    </div>
  );
};

export default CameraTest;
