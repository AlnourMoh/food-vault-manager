
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Keyboard, Settings } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { App } from '@capacitor/app';

interface NoPermissionViewProps {
  onClose: () => void;
  onRequestPermission?: () => void;
  onManualEntry?: () => void;
}

export const NoPermissionView = ({ onClose, onRequestPermission, onManualEntry }: NoPermissionViewProps) => {
  const handleRequestPermission = () => {
    console.log('Request permission button clicked in NoPermissionView - triggering permission request');
    if (onRequestPermission) {
      onRequestPermission();
    }
  };

  const openAppSettings = async () => {
    console.log('Opening app settings if available');
    try {
      if (window.Capacitor) {
        const platform = window.Capacitor.getPlatform();
        
        // For iOS, exiting the app will prompt to open settings on restart
        if (platform === 'ios') {
          console.log('iOS detected - exiting app to prompt settings');
          const confirmed = window.confirm('هل تريد فتح إعدادات التطبيق لتمكين الكاميرا؟ سيتم إغلاق التطبيق وعند إعادة فتحه ستظهر رسالة لفتح الإعدادات.');
          if (confirmed) {
            await App.exitApp();
          }
        } 
        // For Android, show detailed instructions
        else if (platform === 'android') {
          console.log('Android detected - showing instructions');
          alert('لتمكين إذن الكاميرا، يرجى اتباع الخطوات التالية:\n\n1. افتح إعدادات جهازك\n2. انتقل إلى "التطبيقات" أو "مدير التطبيقات"\n3. ابحث عن تطبيق "مخزن الطعام"\n4. اضغط على "الأذونات"\n5. اضغط على "الكاميرا"\n6. اختر "السماح"');
        } else {
          console.log('Platform not supported for direct settings access');
          alert('يرجى فتح إعدادات جهازك يدويًا وتمكين إذن الكاميرا للتطبيق');
        }
      } else {
        console.log('Capacitor not available');
        alert('يرجى فتح إعدادات متصفحك لتمكين إذن الكاميرا');
      }
    } catch (error) {
      console.error('Error while trying to open settings:', error);
      alert('حدث خطأ أثناء محاولة فتح الإعدادات. يرجى فتح إعدادات جهازك يدويًا وتمكين إذن الكاميرا للتطبيق');
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
            يرجى منح تصريح الوصول إلى الكاميرا في إعدادات جهازك لاستخدام الماسح الضوئي. قد تحتاج إلى فتح إعدادات التطبيق يدويًا إذا كنت قد رفضت الإذن سابقًا.
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
