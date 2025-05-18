
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Settings, Info, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { checkCameraPermission, requestCameraPermission, openAppSettings } from '@/utils/cameraPermissions';

export const CameraPermissionTest: React.FC = () => {
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<boolean | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<string>('');
  const [videoCount, setVideoCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // إضافة سجل
  const addLog = (message: string) => {
    console.log(`CameraTest: ${message}`);
    setLogs(prev => [message, ...prev].slice(0, 10)); // الاحتفاظ بآخر 10 سجلات
    
    // عرض رسالة للمستخدم
    try {
      Toast.show({
        text: message,
        duration: 'short'
      });
    } catch (e) {
      console.error('فشل عرض Toast:', e);
    }
  };

  // جمع معلومات الجهاز
  useEffect(() => {
    const collectInfo = async () => {
      try {
        const platform = Capacitor.getPlatform();
        const isNative = Capacitor.isNativePlatform();
        const userAgent = navigator.userAgent;
        
        // فحص التصاريح الحالية
        setIsCheckingPermission(true);
        const hasPermission = await checkCameraPermission();
        setPermissionStatus(hasPermission);
        setIsCheckingPermission(false);
        
        // جمع المعلومات
        const info = [
          `المنصة: ${platform}`,
          `تطبيق أصلي: ${isNative ? 'نعم' : 'لا'}`,
          `إذن الكاميرا: ${hasPermission === null ? 'غير معروف' : hasPermission ? 'ممنوح' : 'غير ممنوح'}`,
          `معلومات المتصفح: ${userAgent.substring(0, 50)}...`
        ].join('\n');
        
        setDeviceInfo(info);
        addLog('تم جمع معلومات الجهاز');
        
        // فحص عناصر الفيديو
        checkVideoElements();
      } catch (error) {
        console.error('خطأ في جمع معلومات الجهاز:', error);
        addLog('فشل في جمع معلومات الجهاز');
      }
    };
    
    collectInfo();
  }, []);

  // التحقق من عناصر الفيديو
  const checkVideoElements = () => {
    const videos = document.querySelectorAll('video');
    setVideoCount(videos.length);
    
    if (videos.length === 0) {
      addLog('لا توجد عناصر فيديو في الصفحة');
    } else {
      addLog(`تم العثور على ${videos.length} عنصر فيديو`);
      
      videos.forEach((video, index) => {
        const hasStream = video.srcObject !== null;
        const dimensions = `${video.videoWidth}x${video.videoHeight}`;
        console.log(`فيديو ${index+1}: المصدر=${hasStream ? 'نعم' : 'لا'}, الأبعاد=${dimensions}`);
      });
    }
  };

  // طلب إذن الكاميرا
  const handleRequestPermission = async () => {
    try {
      setIsCheckingPermission(true);
      addLog('جاري طلب إذن الكاميرا...');
      
      const granted = await requestCameraPermission();
      setPermissionStatus(granted);
      
      if (granted) {
        addLog('تم منح إذن الكاميرا بنجاح');
      } else {
        addLog('تم رفض إذن الكاميرا');
      }
    } catch (error) {
      console.error('خطأ في طلب إذن الكاميرا:', error);
      addLog('فشل في طلب إذن الكاميرا');
    } finally {
      setIsCheckingPermission(false);
    }
  };

  // فتح إعدادات التطبيق
  const handleOpenSettings = async () => {
    try {
      addLog('جاري فتح إعدادات التطبيق...');
      const result = await openAppSettings();
      
      if (!result) {
        addLog('تعذر فتح الإعدادات تلقائياً');
      }
    } catch (error) {
      console.error('خطأ في فتح الإعدادات:', error);
      addLog('فشل في فتح إعدادات التطبيق');
    }
  };

  // تحديث حالة التصاريح والفيديو
  const handleRefresh = async () => {
    try {
      setIsCheckingPermission(true);
      addLog('جاري تحديث المعلومات...');
      
      const hasPermission = await checkCameraPermission();
      setPermissionStatus(hasPermission);
      
      // فحص عناصر الفيديو
      checkVideoElements();
      
      addLog('تم تحديث المعلومات');
    } catch (error) {
      console.error('خطأ في تحديث المعلومات:', error);
      addLog('فشل في تحديث المعلومات');
    } finally {
      setIsCheckingPermission(false);
    }
  };

  // محاولة تشغيل الكاميرا مباشرة
  const handleTestCamera = async () => {
    try {
      addLog('جاري اختبار الكاميرا...');
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        addLog('واجهة mediaDevices غير مدعومة');
        return;
      }
      
      // إنشاء عنصر فيديو مؤقت
      const videoElement = document.createElement('video');
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      videoElement.id = 'test-camera-video';
      videoElement.style.position = 'fixed';
      videoElement.style.top = '0';
      videoElement.style.left = '0';
      videoElement.style.width = '100%';
      videoElement.style.height = '100%';
      videoElement.style.objectFit = 'cover';
      videoElement.style.zIndex = '9999';
      
      // إضافة زر إغلاق
      const closeButton = document.createElement('button');
      closeButton.textContent = 'إغلاق';
      closeButton.style.position = 'fixed';
      closeButton.style.top = '10px';
      closeButton.style.right = '10px';
      closeButton.style.zIndex = '10000';
      closeButton.style.padding = '8px 16px';
      closeButton.style.backgroundColor = 'white';
      closeButton.style.borderRadius = '4px';
      
      // إضافة العناصر للصفحة
      document.body.appendChild(videoElement);
      document.body.appendChild(closeButton);
      
      // تنظيف عند الإغلاق
      closeButton.onclick = () => {
        if (videoElement.srcObject) {
          const stream = videoElement.srcObject as MediaStream;
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }
        
        videoElement.remove();
        closeButton.remove();
        
        addLog('تم إغلاق اختبار الكاميرا');
      };
      
      // طلب الوصول للكاميرا
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      videoElement.srcObject = stream;
      addLog('تم تشغيل الكاميرا بنجاح');
      
      // بدء التشغيل
      await videoElement.play();
      
    } catch (error) {
      console.error('خطأ في اختبار الكاميرا:', error);
      addLog(`فشل في تشغيل الكاميرا: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-bold flex items-center mb-2">
          <Info className="w-5 h-5 mr-2 text-blue-600" />
          معلومات الجهاز
        </h2>
        <pre className="whitespace-pre-wrap text-xs bg-blue-100 p-2 rounded">
          {deviceInfo}
        </pre>
        
        <div className="mt-2 flex items-center gap-2">
          <strong className="text-sm">حالة التصاريح:</strong>
          
          {isCheckingPermission ? (
            <span className="text-yellow-600 flex items-center">
              <RefreshCw className="w-4 h-4 animate-spin mr-1" />
              جاري التحقق...
            </span>
          ) : permissionStatus === true ? (
            <span className="text-green-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              مسموح
            </span>
          ) : permissionStatus === false ? (
            <span className="text-red-600 flex items-center">
              <XCircle className="w-4 h-4 mr-1" />
              غير مسموح
            </span>
          ) : (
            <span className="text-gray-600">غير معروف</span>
          )}
        </div>
        
        <div className="mt-2">
          <strong className="text-sm">عناصر الفيديو: </strong>
          <span className={videoCount > 0 ? "text-green-600" : "text-red-600"}>
            {videoCount}
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Button 
          onClick={handleTestCamera}
          className="w-full"
          variant="default"
        >
          <Camera className="h-4 w-4 ml-2" />
          اختبار الكاميرا مباشرة
        </Button>
        
        <Button 
          onClick={handleRequestPermission}
          className="w-full"
          variant="secondary"
          disabled={isCheckingPermission}
        >
          <Camera className="h-4 w-4 ml-2" />
          طلب إذن الكاميرا
        </Button>
        
        <Button 
          onClick={handleOpenSettings}
          className="w-full"
          variant="secondary"
        >
          <Settings className="h-4 w-4 ml-2" />
          فتح إعدادات التطبيق
        </Button>
        
        <Button 
          onClick={handleRefresh}
          className="w-full"
          variant="outline"
          disabled={isCheckingPermission}
        >
          <RefreshCw className="h-4 w-4 ml-2" />
          تحديث المعلومات
        </Button>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-2">
        <h3 className="font-semibold text-sm mb-1">سجل العمليات:</h3>
        <div className="max-h-40 overflow-y-auto text-xs">
          {logs.length === 0 ? (
            <p className="text-gray-500 italic">لا توجد سجلات حتى الآن</p>
          ) : (
            <ul className="space-y-1">
              {logs.map((log, index) => (
                <li key={index} className="border-b border-gray-100 pb-1">
                  {log}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
