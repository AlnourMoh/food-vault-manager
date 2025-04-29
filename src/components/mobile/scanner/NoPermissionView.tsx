
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Keyboard, Settings } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Toast } from '@capacitor/toast';
import { barcodeScannerService } from '@/services/BarcodeScannerService';

interface NoPermissionViewProps {
  onClose: () => void;
  onRequestPermission?: () => void;
  onManualEntry?: () => void;
}

export const NoPermissionView = ({ onClose, onRequestPermission, onManualEntry }: NoPermissionViewProps) => {
  const handleRequestPermission = async () => {
    console.log('Request permission button clicked - triggering permission request');
    try {
      // عرض رسالة توضح للمستخدم أنك تحاول طلب الإذن
      await Toast.show({
        text: 'جاري محاولة طلب إذن الكاميرا...',
        duration: 'short'
      });

      // استدعاء وظيفة طلب الإذن
      if (onRequestPermission) {
        onRequestPermission();
      }
    } catch (error) {
      console.error('Error showing toast or requesting permission:', error);
      
      // رسالة تأكيد بسيطة في حالة فشل Toast
      alert('جاري محاولة طلب إذن الكاميرا...');
    }
  };

  const openAppSettings = async () => {
    console.log('Opening app settings for camera permission');
    try {
      // عرض رسالة توضح للمستخدم أنك تحاول فتح الإعدادات
      await Toast.show({
        text: 'جاري فتح إعدادات التطبيق...',
        duration: 'short'
      });
      
      // محاولة فتح إعدادات التطبيق
      await barcodeScannerService.openAppSettings();
    } catch (error) {
      console.error('Error opening settings:', error);
      
      // إظهار تعليمات يدوية للمستخدم
      const platformText = window.Capacitor?.getPlatform() === 'ios'
        ? 'افتح إعدادات جهازك، ثم الخصوصية > الكاميرا، وابحث عن تطبيق "مخزن الطعام" وقم بتمكينه'
        : 'افتح إعدادات جهازك > التطبيقات > مخزن الطعام > الأذونات > الكاميرا وقم بتمكينها';
      
      alert('لتمكين الكاميرا يدويًا: ' + platformText);
    }
  };

  return (
    <Card className="p-4 fixed inset-x-0 bottom-0 z-50 bg-background border-t shadow-lg">
      <div className="flex flex-col items-center justify-center py-6 space-y-4">
        <div className="bg-red-100 text-red-700 p-3 rounded-full w-16 h-16 flex items-center justify-center">
          <Camera className="h-8 w-8" />
        </div>
        
        <h3 className="text-xl font-bold">لا يوجد إذن للكاميرا</h3>
        
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertDescription>
            يرجى منح تصريح الوصول إلى الكاميرا في إعدادات جهازك لاستخدام الماسح الضوئي.
            <br />
            <strong>هذا التطبيق بحاجة للكاميرا فقط لمسح الباركود</strong>
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col w-full space-y-2 mt-4">
          <Button 
            onClick={handleRequestPermission}
            className="w-full"
            variant="default"
          >
            <Camera className="h-4 w-4 ml-2" />
            طلب الإذن مجددًا
          </Button>
          
          <Button 
            onClick={openAppSettings}
            className="w-full"
            variant="secondary"
          >
            <Settings className="h-4 w-4 ml-2" />
            فتح إعدادات التطبيق
          </Button>
          
          {onManualEntry && (
            <Button 
              onClick={onManualEntry}
              className="w-full"
              variant="secondary"
            >
              <Keyboard className="h-4 w-4 ml-2" />
              إدخال الكود يدويًا
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full"
          >
            إغلاق
          </Button>
        </div>
      </div>
    </Card>
  );
};
