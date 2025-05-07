
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Keyboard, Settings, AlertCircle, RefreshCw } from 'lucide-react';
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
  const [showAdvancedHelp, setShowAdvancedHelp] = useState(false);
  
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
        } else if (permissionResult.camera === 'denied') {
          console.log('تم رفض طلب الإذن، محاولة مرة أخرى بطريقة مختلفة');
          // محاولة أخرى بإعطاء المستخدم مزيداً من المعلومات
          await Toast.show({
            text: 'لاستخدام الماسح الضوئي، يرجى منح إذن الكاميرا',
            duration: 'long'
          });
          
          // انتظار لحظة قبل المحاولة التالية
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          try {
            // محاولة أخرى
            const secondAttempt = await BarcodeScanner.requestPermissions();
            if (secondAttempt.camera === 'granted') {
              if (onRequestPermission) {
                await onRequestPermission();
              }
              return;
            }
          } catch (e) {
            console.error('فشلت المحاولة الثانية:', e);
          }
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
      
      // محاولة فتح الإعدادات
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
      
      // إظهار مزيد من المعلومات
      setShowAdvancedHelp(true);
    }
  };
  
  // مساعدة متقدمة للمستخدمين - تظهر حلاً لمشكلة عدم ظهور التطبيق
  const showFixForMissingApp = async () => {
    const platform = Capacitor.getPlatform();
    
    if (platform === 'android') {
      alert(
        'حل مشكلة عدم ظهور التطبيق في قائمة الكاميرا:\n\n' +
        '1. اذهب إلى الإعدادات > التطبيقات\n' +
        '2. اضغط على ثلاث نقاط أو "إدارة التطبيقات" (تختلف حسب الجهاز)\n' +
        '3. اختر "إظهار تطبيقات النظام" أو "عرض جميع التطبيقات"\n' +
        '4. ابحث عن "Google Play Services"\n' +
        '5. اختر "التخزين" ثم "محو ذاكرة التخزين المؤقت"\n' +
        '6. عد للخلف واختر "الأذونات"\n' +
        '7. تأكد من منح أذونات الكاميرا\n' +
        '8. أعد تشغيل الجهاز\n\n' +
        'إذا استمرت المشكلة، جرب إعادة تثبيت التطبيق بعد إلغاء تثبيته'
      );
    } else {
      alert(
        'حل مشكلة عدم ظهور التطبيق في قائمة الكاميرا:\n\n' +
        '1. توجه إلى إعدادات iOS > عام > إعادة ضبط\n' +
        '2. اختر "إعادة ضبط إعدادات الخصوصية"\n' +
        '3. أعد تشغيل الجهاز\n' +
        '4. افتح التطبيق مرة أخرى وسيطلب إذن الكاميرا مجدداً\n\n' +
        'لاحظ: هذا سيعيد ضبط جميع أذونات التطبيقات، وليس فقط هذا التطبيق'
      );
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
              يحتاج التطبيق لإذن الكاميرا لمسح الباركود. نواجه مشكلة في الحصول على الإذن.
              <br />
              <strong>التطبيق يستخدم الكاميرا فقط لمسح الرموز الشريطية</strong>
            </AlertDescription>
          </Alert>
          
          {showAdvancedHelp && (
            <Alert className="border-amber-200 bg-amber-50 mt-2">
              <AlertTitle className="text-amber-900">مشكلة شائعة: التطبيق غير ظاهر في قائمة الكاميرا</AlertTitle>
              <AlertDescription className="text-amber-800">
                قد لا يظهر التطبيق في قائمة التطبيقات المطلوب منحها إذن الكاميرا. 
                لحل هذه المشكلة:
                <ul className="mt-2 list-disc list-inside">
                  <li>قم بإعادة تثبيت التطبيق</li>
                  <li>أعد تشغيل الجهاز</li>
                  <li>امسح ذاكرة التخزين المؤقت لـ Google Play Services</li>
                </ul>
                <Button 
                  onClick={showFixForMissingApp} 
                  variant="outline" 
                  className="w-full mt-2 bg-amber-100"
                >
                  عرض حل مفصل للمشكلة
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
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
            
            <Button
              onClick={() => setShowAdvancedHelp(!showAdvancedHelp)}
              className="w-full"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 ml-2" />
              {showAdvancedHelp ? 'إخفاء المساعدة المتقدمة' : 'مشكلة عدم ظهور التطبيق؟'}
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
              variant="ghost" 
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
