
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { Button } from '@/components/ui/button';
import { BarcodeIcon } from 'lucide-react';
import ZXingBarcodeScanner from '@/components/mobile/ZXingBarcodeScanner';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

const AddProducts = () => {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [autoLaunchAttempted, setAutoLaunchAttempted] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const isRestaurantRoute = window.location.pathname.startsWith('/restaurant/');
  const Layout = isRestaurantRoute ? RestaurantLayout : MainLayout;

  // فتح الماسح الضوئي تلقائياً عند تحميل الصفحة
  useEffect(() => {
    // تنفيذ فقط مرة واحدة
    if (!autoLaunchAttempted && Capacitor.isNativePlatform()) {
      setAutoLaunchAttempted(true);
      
      const checkPermissionAndOpenScanner = async () => {
        try {
          if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
            const { camera } = await BarcodeScanner.checkPermissions();
            
            if (camera === 'granted') {
              // لدينا إذن، يمكننا فتح الماسح
              console.log('AddProducts: لدينا إذن، فتح الماسح الضوئي تلقائياً');
              setTimeout(() => setScannerOpen(true), 500);
            } else {
              // لا يوجد إذن بعد، نعرض الزر للمستخدم
              console.log('AddProducts: لا يوجد إذن، انتظار ضغط المستخدم على الزر');
              toast({
                title: "استخدام الماسح الضوئي",
                description: "اضغط على زر مسح الباركود لفتح الماسح الضوئي"
              });
            }
          } else {
            // الماسح غير متاح، نعرض الزر
            console.log('AddProducts: الماسح غير متاح، انتظار ضغط المستخدم على الزر');
          }
        } catch (error) {
          console.error('AddProducts: خطأ في التحقق من إذن الكاميرا:', error);
        }
      };
      
      checkPermissionAndOpenScanner();
    }
  }, [autoLaunchAttempted, toast]);

  const handleProductAdded = () => {
    console.log('Product added successfully');
    toast({
      title: "تم إضافة المنتج",
      description: "تم إضافة المنتج بنجاح وإضافته إلى المخزون"
    });
    
    // Redirect to inventory after successful scan
    const inventoryPath = isRestaurantRoute ? '/restaurant/inventory' : '/inventory';
    console.log('Redirecting to:', inventoryPath);
    navigate(inventoryPath);
  };

  // استجابة للمسح
  const handleScanResult = async (code: string) => {
    try {
      console.log('تم مسح الرمز:', code);
      
      // إغلاق الماسح
      setScannerOpen(false);
      
      // هنا نضع المنطق الخاص بمعالجة الرمز الممسوح
      toast({
        title: "تم مسح الباركود",
        description: `تم مسح الرمز: ${code}`
      });
      
      // يمكن استكمال المنطق الحالي للتعامل مع المنتج
      handleProductAdded();
    } catch (error) {
      console.error('خطأ في معالجة نتيجة المسح:', error);
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء معالجة نتيجة المسح",
        variant: "destructive"
      });
    }
  };

  const handleScanButtonClick = () => {
    console.log('فتح الماسح الضوئي');
    setScannerOpen(true);
  };

  return (
    <Layout>
      <div className="container py-6">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h1 className="text-2xl font-bold">إضافة منتج جديد</h1>
          <p className="text-muted-foreground">
            قم بمسح الباركود الموجود على المنتج لإضافته إلى المخزون
          </p>
          
          <Button 
            size="lg" 
            onClick={handleScanButtonClick}
            className="w-full gap-2"
          >
            <BarcodeIcon className="w-5 h-5" />
            مسح باركود المنتج
          </Button>
        </div>

        {scannerOpen && (
          <ZXingBarcodeScanner
            onScan={handleScanResult}
            onClose={() => setScannerOpen(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default AddProducts;
