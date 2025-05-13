
import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Button } from '@/components/ui/button';
import { Camera, CameraResultType } from '@capacitor/camera';
import { useToast } from '@/hooks/use-toast';

const CapacitorTester = () => {
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState('');
  const [pluginsAvailable, setPluginsAvailable] = useState<Record<string, boolean>>({});
  const [testResult, setTestResult] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // اختبار بيئة التشغيل
    const nativePlatform = Capacitor.isNativePlatform();
    setIsNative(nativePlatform);
    setPlatform(Capacitor.getPlatform());
    
    // التحقق من الملحقات المتاحة
    const plugins: Record<string, boolean> = {
      'Camera': Capacitor.isPluginAvailable('Camera'),
      'MLKitBarcodeScanner': Capacitor.isPluginAvailable('MLKitBarcodeScanner'),
      'BarcodeScanner': Capacitor.isPluginAvailable('BarcodeScanner'),
      'App': Capacitor.isPluginAvailable('App'),
      'Toast': Capacitor.isPluginAvailable('Toast')
    };
    
    setPluginsAvailable(plugins);
    
    console.log('CapacitorTester: Initialized');
    console.log('CapacitorTester: Is Native Platform?', nativePlatform);
    console.log('CapacitorTester: Platform', Capacitor.getPlatform());
    console.log('CapacitorTester: Available Plugins', plugins);
  }, []);

  const testCamera = async () => {
    try {
      setTestResult('جاري اختبار الكاميرا...');
      
      if (Capacitor.isPluginAvailable('Camera')) {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri
        });
        
        setTestResult(`تم اختبار الكاميرا بنجاح! مسار الصورة: ${image.path || image.webPath}`);
        
        toast({
          title: "نجاح",
          description: "تم التقاط الصورة بنجاح",
          variant: "default"
        });
      } else {
        setTestResult('ملحق الكاميرا غير متاح على هذا الجهاز');
        
        toast({
          title: "خطأ",
          description: "ملحق الكاميرا غير متاح",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error testing camera:', error);
      setTestResult(`فشل اختبار الكاميرا: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
      
      toast({
        title: "خطأ",
        description: "فشل اختبار الكاميرا",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">اختبار Capacitor</h2>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="font-medium">بيئة تطبيق أصلية:</span>
          <span className={isNative ? "text-green-600" : "text-red-600"}>
            {isNative ? "نعم" : "لا"}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">المنصة:</span>
          <span>{platform}</span>
        </div>
      </div>
      
      <h3 className="font-bold mt-4 mb-2">الملحقات المتاحة:</h3>
      <div className="space-y-1 mb-4">
        {Object.entries(pluginsAvailable).map(([plugin, available]) => (
          <div key={plugin} className="flex justify-between">
            <span>{plugin}:</span>
            <span className={available ? "text-green-600" : "text-red-600"}>
              {available ? "متاح" : "غير متاح"}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 space-y-4">
        <Button onClick={testCamera} className="w-full">
          اختبار الكاميرا
        </Button>
        
        {testResult && (
          <div className={`p-3 rounded-lg text-sm ${testResult.includes('نجاح') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {testResult}
          </div>
        )}
      </div>
    </div>
  );
};

export default CapacitorTester;
