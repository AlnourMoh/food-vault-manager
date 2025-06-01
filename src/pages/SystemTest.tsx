
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCameraPermissions } from '@/hooks/useCameraPermissions';
import { Capacitor } from '@capacitor/core';
import { Camera, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const SystemTest: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState<any>({});
  const { hasPermission, isLoading, requestPermission, openAppSettings } = useCameraPermissions();

  useEffect(() => {
    const getSystemInfo = () => {
      setSystemInfo({
        platform: Capacitor.getPlatform(),
        isNative: Capacitor.isNativePlatform(),
        userAgent: navigator.userAgent,
        plugins: {
          MLKitBarcodeScanner: Capacitor.isPluginAvailable('MLKitBarcodeScanner'),
          Camera: Capacitor.isPluginAvailable('Camera'),
          Toast: Capacitor.isPluginAvailable('Toast'),
          Browser: Capacitor.isPluginAvailable('Browser'),
          App: Capacitor.isPluginAvailable('App')
        }
      });
    };

    getSystemInfo();
  }, []);

  const getPermissionStatus = () => {
    if (isLoading) return { icon: AlertCircle, text: 'جاري التحقق...', variant: 'secondary' as const };
    if (hasPermission === true) return { icon: CheckCircle, text: 'ممنوح', variant: 'default' as const };
    if (hasPermission === false) return { icon: XCircle, text: 'مرفوض', variant: 'destructive' as const };
    return { icon: AlertCircle, text: 'غير معروف', variant: 'secondary' as const };
  };

  const permissionStatus = getPermissionStatus();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">اختبار النظام</h1>
        <p className="text-gray-600">فحص حالة النظام والأذونات</p>
      </div>

      {/* Platform Information */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات المنصة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>المنصة:</span>
            <Badge variant="outline">{systemInfo.platform}</Badge>
          </div>
          <div className="flex justify-between">
            <span>منصة أصلية:</span>
            <Badge variant={systemInfo.isNative ? "default" : "secondary"}>
              {systemInfo.isNative ? 'نعم' : 'لا'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Plugin Status */}
      <Card>
        <CardHeader>
          <CardTitle>حالة الإضافات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(systemInfo.plugins || {}).map(([plugin, available]) => (
            <div key={plugin} className="flex justify-between items-center">
              <span>{plugin}:</span>
              <Badge variant={available ? "default" : "destructive"}>
                {available ? 'متوفر' : 'غير متوفر'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Camera Permission */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            إذن الكاميرا
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>الحالة:</span>
            <Badge variant={permissionStatus.variant} className="flex items-center gap-1">
              <permissionStatus.icon className="h-4 w-4" />
              {permissionStatus.text}
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={requestPermission}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'جاري الطلب...' : 'طلب الإذن'}
            </Button>
            
            <Button 
              onClick={openAppSettings}
              variant="outline"
              className="flex-1"
            >
              فتح الإعدادات
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Agent */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات المتصفح</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 break-all">
            {systemInfo.userAgent}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemTest;
