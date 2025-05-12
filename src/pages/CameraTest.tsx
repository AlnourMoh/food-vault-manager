
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { scannerOperationsService } from '@/services/scanner/ScannerOperationsService';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { Toast } from '@capacitor/toast';

const CameraTest = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const isSupported = await scannerPermissionService.isSupported();
        if (!isSupported) {
          Toast.show({
            text: 'هذا الجهاز لا يدعم ماسح الباركود',
            duration: 'long'
          });
        }
      } catch (error) {
        console.error('خطأ في فحص دعم الماسح:', error);
      }
    };
    
    checkPermission();
  }, []);

  const handleScan = async () => {
    try {
      await scannerOperationsService.startScan((code) => {
        console.log('تم مسح الرمز:', code);
        Toast.show({
          text: `تم مسح الرمز: ${code}`,
          duration: 'long'
        });
      });
    } catch (error) {
      console.error('خطأ في بدء المسح:', error);
      Toast.show({
        text: 'حدث خطأ أثناء محاولة بدء المسح',
        duration: 'long'
      });
    }
  };

  const handleStopScan = async () => {
    try {
      await scannerOperationsService.stopScan();
      Toast.show({
        text: 'تم إيقاف المسح',
        duration: 'short'
      });
    } catch (error) {
      console.error('خطأ في إيقاف المسح:', error);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">اختبار كاميرا المسح الضوئي</h1>
      
      <div className="space-y-4 w-full max-w-md">
        <Button onClick={handleScan} className="w-full">
          بدء المسح الضوئي
        </Button>
        
        <Button onClick={handleStopScan} variant="secondary" className="w-full">
          إيقاف المسح الضوئي
        </Button>
        
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
