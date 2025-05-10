
import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

/**
 * التحقق من إذن الكاميرا
 */
export async function checkCameraPermission(): Promise<boolean> {
  try {
    // التحقق من بيئة التشغيل
    if (Capacitor.isNativePlatform()) {
      // التحقق من وجود ملحقات الكاميرا
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const status = await BarcodeScanner.checkPermissions();
        return status.camera === 'granted';
      }
      
      if (Capacitor.isPluginAvailable('Camera')) {
        const status = await Camera.checkPermissions();
        return status.camera === 'granted';
      }
    }
    
    // في بيئة الويب، نحاول الوصول للكاميرا
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // إيقاف المسار فوراً بعد التحقق من الإذن
        stream.getTracks().forEach(track => track.stop());
        return true;
      } catch (error) {
        return false;
      }
    }
    
    return false;
  } catch (error) {
    console.error('خطأ في التحقق من إذن الكاميرا:', error);
    return false;
  }
}

/**
 * طلب إذن الكاميرا
 */
export async function requestCameraPermission(): Promise<boolean> {
  try {
    // التحقق من بيئة التشغيل
    if (Capacitor.isNativePlatform()) {
      // التحقق من وجود ملحقات الكاميرا
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        const result = await BarcodeScanner.requestPermissions();
        return result.camera === 'granted';
      }
      
      if (Capacitor.isPluginAvailable('Camera')) {
        const result = await Camera.requestPermissions({ permissions: ['camera'] });
        return result.camera === 'granted';
      }
    }
    
    // في بيئة الويب، نحاول الوصول للكاميرا
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // إيقاف المسار فوراً بعد التحقق من الإذن
        stream.getTracks().forEach(track => track.stop());
        return true;
      } catch (error) {
        return false;
      }
    }
    
    return false;
  } catch (error) {
    console.error('خطأ في طلب إذن الكاميرا:', error);
    return false;
  }
}
