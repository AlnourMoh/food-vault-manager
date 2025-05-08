
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

  useEffect(() => {
    // التحقق من الأذونات عند التحميل فقط بدون فتح الماسح تلقائياً
    const checkPermissions = async () => {
      try {
        setAutoLaunchAttempted(true);
        
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          const { camera } = await BarcodeScanner.checkPermissions();
          console.log("حالة إذن الكاميرا:", camera);
        }
      } catch (error) {
        console.error('خطأ في التحقق من إذن الكاميرا:', error);
      }
    };
    
    if (!autoLaunchAttempted && Capacitor.isNativePlatform()) {
      checkPermissions();
    }
  }, [autoLaunchAttempted]);

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
    console.log('فتح الماسح الضوئي مباشرة');
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
