
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Keyboard, Settings, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Toast } from '@capacitor/toast';
import { barcodeScannerService } from '@/services/scanner/BarcodeScannerService';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

interface NoPermissionViewProps {
  onClose: () => void;
  onRequestPermission?: () => void;
  onManualEntry?: () => void;
}

export const NoPermissionView = ({ onClose, onRequestPermission, onManualEntry }: NoPermissionViewProps) => {
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  
  const handleRequestPermission = async () => {
    try {
      setIsRequestingPermission(true);
      console.log('طلب إذن الكاميرا - بدء العملية');
      
      // إظهار رسالة للمستخدم
      await Toast.show({
        text: 'جاري طلب إذن الكاميرا...',
        duration: 'short'
      });

      // التحقق من المنصة
      const platform = Capacitor.getPlatform();
      console.log(`المنصة الحالية: ${platform}`);
      
      // طلب الإذن باستخدام BarcodeScanner مباشرةً
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('استخدام MLKitBarcodeScanner لطلب الإذن');
        const permissionResult = await BarcodeScanner.requestPermissions();
        console.log('نتيجة طلب الإذن من MLKit:', permissionResult);
        
        if (permissionResult.camera === 'granted') {
          console.log('تم منح الإذن بنجاح من MLKit');
          await Toast.show({
            text: 'تم منح إذن الكاميرا بنجاح!',
            duration: 'short'
          });
          
          if (onRequestPermission) {
            await onRequestPermission();
          }
          return;
        }
      }
      
      // استخدام الخدمة المخصصة إذا لم ينجح الطلب المباشر
      console.log('استخدام barcodeScannerService كخيار ثانٍ');
      if (onRequestPermission) {
        await onRequestPermission();
      } else {
        const granted = await barcodeScannerService.requestPermission();
        console.log('نتيجة طلب الإذن من الخدمة المخصصة:', granted);
        
        if (granted) {
          await Toast.show({
            text: 'تم منح إذن الكاميرا بنجاح!',
            duration: 'short'
          });
        } else {
          console.log('لم يتم منح الإذن، محاولة فتح الإعدادات');
          await Toast.show({
            text: 'لم يتم منح إذن الكاميرا. يرجى تمكينه من إعدادات جهازك.',
            duration: 'long'
          });
          
          // تأخير قصير قبل فتح الإعدادات
          setTimeout(() => openAppSettings(), 1500);
        }
      }
    } catch (error) {
      console.error('خطأ في عملية طلب الإذن:', error);
      
      // إظهار رسالة خطأ للمستخدم
      await Toast.show({
        text: 'حدث خطأ أثناء طلب الإذن. يرجى المحاولة مرة أخرى أو فتح الإعدادات يدويًا.',
        duration: 'long'
      });
      
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const openAppSettings = async () => {
    console.log('محاولة فتح إعدادات التطبيق');
    try {
      // رسالة توضيحية للمستخدم
      await Toast.show({
        text: 'جاري فتح إعدادات التطبيق...',
        duration: 'short'
      });
      
      // محاولة فتح الإعدادات باستخدام BarcodeScanner إذا كان متاحًا
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('استخدام MLKit لفتح الإعدادات');
        await BarcodeScanner.openSettings();
        return;
      }
      
      // استخدام الخدمة المخصصة كخيار ثانٍ
      await barcodeScannerService.openAppSettings();
      
    } catch (error) {
      console.error('خطأ في فتح إعدادات التطبيق:', error);
      
      // عرض إرشادات يدوية للمستخدم
      const platform = Capacitor.getPlatform();
      const platformText = platform === 'ios'
        ? 'افتح إعدادات جهازك > الخصوصية > الكاميرا وابحث عن تطبيق "مخزن الطعام" وقم بتمكينه'
        : 'افتح إعدادات جهازك > التطبيقات > مخزن الطعام > الأذونات > الكاميرا وقم بتمكينها';
      
      await Toast.show({
        text: 'لتمكين الكاميرا يدويًا: ' + platformText,
        duration: 'long'
      });
      
      // إظهار توجيهات أكثر تفصيلاً حسب نوع المنصة
      if (platform === 'android') {
        alert(
          'لتمكين إذن الكاميرا على أندرويد:\n\n' +
          '1. افتح إعدادات جهازك\n' +
          '2. اختر "التطبيقات" أو "مدير التطبيقات"\n' +
          '3. ابحث عن تطبيق "مخزن الطعام"\n' +
          '4. اختر "الأذونات"\n' +
          '5. قم بتفعيل إذن "الكاميرا"'
        );
      } else if (platform === 'ios') {
        alert(
          'لتمكين إذن الكاميرا على آيفون:\n\n' +
          '1. افتح إعدادات جهازك\n' +
          '2. اختر "الخصوصية والأمان"\n' +
          '3. اختر "الكاميرا"\n' +
          '4. ابحث عن تطبيق "مخزن الطعام" وقم بتفعيله'
        );
      }
    }
  };

  return (
    <div className="scanner-permission-overlay">
      <div className="permission-error-view">
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="bg-red-100 text-red-700 p-3 rounded-full w-16 h-16 flex items-center justify-center">
            <Camera className="h-8 w-8" />
          </div>
          
          <h3 className="text-xl font-bold">لا يوجد إذن للكاميرا</h3>
          
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>تنبيه هام</AlertTitle>
            <AlertDescription>
              يرجى منح تصريح الوصول إلى الكاميرا في إعدادات جهازك لاستخدام الماسح الضوئي.
              <br />
              <strong>هذا التطبيق يستخدم الكاميرا فقط لمسح الباركود</strong>
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col w-full space-y-2 mt-4">
            <Button 
              onClick={handleRequestPermission}
              className="w-full"
              variant="default"
              disabled={isRequestingPermission}
            >
              <Camera className="h-4 w-4 ml-2" />
              {isRequestingPermission ? 'جاري طلب الإذن...' : 'طلب إذن الكاميرا'}
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
      </div>
    </div>
  );
};
