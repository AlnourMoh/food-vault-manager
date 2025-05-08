
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { Button } from '@/components/ui/button';
import { BarcodeIcon, Settings, Camera } from 'lucide-react';
import ZXingBarcodeScanner from '@/components/mobile/ZXingBarcodeScanner';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { Toast } from '@capacitor/toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

const AddProducts = () => {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [hasPermissionError, setHasPermissionError] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const isRestaurantRoute = window.location.pathname.startsWith('/restaurant/');
  const Layout = isRestaurantRoute ? RestaurantLayout : MainLayout;

  // تحقق من أذونات الكاميرا عند التحميل
  useEffect(() => {
    const checkCameraPermissions = async () => {
      try {
        console.log("التحقق من أذونات الكاميرا عند تحميل الصفحة...");
        
        if (Capacitor.isNativePlatform()) {
          // التحقق من وجود الأذونات وإظهار حالتها
          let hasPermission = false;
          
          if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
            const result = await BarcodeScanner.checkPermissions();
            hasPermission = result.camera === 'granted';
            console.log("حالة إذن الكاميرا:", result.camera);
          } else if (Capacitor.isPluginAvailable('Camera')) {
            // استخدم خدمة للتحقق من الأذونات
            const permissionResult = await scannerPermissionService.checkPermission();
            hasPermission = permissionResult;
            console.log("حالة إذن الكاميرا من خدمة المسح:", hasPermission);
          }
          
          // تسجيل حالة التحقق من الأذونات
          setPermissionChecked(true);
          
          // إذا لم يكن هناك إذن، نعرض زر طلبه بدلاً من التنفيذ التلقائي
          if (!hasPermission) {
            console.log("لم يتم العثور على إذن الكاميرا");
            setHasPermissionError(true);
          } else {
            console.log("تم العثور على إذن للكاميرا - جاهز للمسح");
            setHasPermissionError(false);
          }
        }
      } catch (error) {
        console.error("خطأ في التحقق من أذونات الكاميرا:", error);
        setHasPermissionError(true);
        setPermissionChecked(true);
      }
    };
    
    checkCameraPermissions();
  }, []);

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
      setScannerOpen(false);
    }
  };

  const handleScanButtonClick = async () => {
    try {
      console.log('فتح الماسح الضوئي');
      setIsRequestingPermission(true);
      
      // التحقق من وجود الأذونات قبل فتح الماسح
      if (Capacitor.isNativePlatform()) {
        console.log("التحقق من الإذن قبل فتح الماسح...");
        
        // استخدام الخدمة المخصصة للتأكد من وجود الأذونات بكل الطرق
        const hasPermission = await scannerPermissionService.ensureCameraPermissions();
        
        if (hasPermission) {
          console.log("توجد أذونات للكاميرا - جاري فتح الماسح");
          setHasPermissionError(false);
          setScannerOpen(true);
        } else {
          console.log("لم يتم الحصول على أذونات الكاميرا");
          setHasPermissionError(true);
          
          // عرض رسالة إرشاد للمستخدم
          toast({
            title: "مشكلة في أذونات الكاميرا",
            description: "لم نتمكن من الوصول إلى كاميرا هاتفك. يرجى التأكد من منح التطبيق إذن الوصول إلى الكاميرا من إعدادات جهازك.",
            variant: "destructive"
          });
          
          // محاولة فتح إعدادات التطبيق
          setTimeout(async () => {
            try {
              console.log("محاولة فتح إعدادات التطبيق...");
              await scannerPermissionService.openAppSettings();
            } catch (e) {
              console.error("خطأ في فتح الإعدادات:", e);
            }
          }, 1500);
        }
      } else {
        // في حالة عدم وجود منصة أصلية، نفترض أن الأذونات متوفرة
        console.log("تشغيل الماسح في وضع الويب");
        setScannerOpen(true);
      }
    } catch (error) {
      console.error("خطأ في فتح الماسح:", error);
      toast({
        title: "خطأ في تشغيل الماسح",
        description: "حدث خطأ أثناء محاولة تشغيل الماسح الضوئي",
        variant: "destructive"
      });
    } finally {
      setIsRequestingPermission(false);
    }
  };
  
  const handleRequestPermission = async () => {
    try {
      setIsRequestingPermission(true);
      console.log("محاولة طلب إذن الكاميرا مباشرة...");
      
      // استخدام الخدمة المخصصة للتأكد من وجود الأذونات بكل الطرق
      const granted = await scannerPermissionService.requestPermission();
      
      if (granted) {
        console.log("تم منح إذن الكاميرا بنجاح");
        setHasPermissionError(false);
        
        // فتح الماسح فور الحصول على الإذن
        setTimeout(() => {
          setScannerOpen(true);
        }, 500);
      } else {
        console.log("تم رفض طلب إذن الكاميرا");
        setHasPermissionError(true);
        
        // محاولة فتح الإعدادات
        setTimeout(async () => {
          await scannerPermissionService.openAppSettings();
        }, 1000);
      }
    } catch (error) {
      console.error("خطأ في طلب إذن الكاميرا:", error);
      setHasPermissionError(true);
    } finally {
      setIsRequestingPermission(false);
    }
  };
  
  const handleOpenSettings = async () => {
    try {
      console.log("محاولة فتح إعدادات التطبيق...");
      await scannerPermissionService.openAppSettings();
    } catch (error) {
      console.error("خطأ في فتح إعدادات التطبيق:", error);
      
      // إرشادات يدوية
      const platform = Capacitor.getPlatform();
      const message = platform === 'ios' 
        ? 'يرجى فتح إعدادات جهازك > الخصوصية > الكاميرا، وابحث عن التطبيق' 
        : 'يرجى فتح إعدادات جهازك > التطبيقات > مخزن الطعام > الأذونات > الكاميرا';
      
      await Toast.show({
        text: message,
        duration: 'long'
      });
    }
  };

  return (
    <Layout>
      <div className="container py-6">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h1 className="text-2xl font-bold">إضافة منتج جديد</h1>
          <p className="text-muted-foreground">
            قم بمسح الباركود الموجود على المنتج لإضافته إلى المخزون
          </p>
          
          {hasPermissionError ? (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-6">
                <Alert className="bg-transparent border-none">
                  <Camera className="h-5 w-5 text-red-600" />
                  <AlertTitle className="text-red-600">لم يتم منح إذن الكاميرا</AlertTitle>
                  <AlertDescription>
                    يحتاج التطبيق إلى إذن الوصول للكاميرا لمسح الباركود. الرجاء منح التصريح اللازم.
                  </AlertDescription>
                </Alert>
                
                <div className="flex flex-col gap-2 mt-4">
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
                    onClick={handleOpenSettings}
                    className="w-full"
                    variant="secondary"
                  >
                    <Settings className="h-4 w-4 ml-2" />
                    فتح إعدادات التطبيق
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button 
              size="lg" 
              onClick={handleScanButtonClick}
              className="w-full gap-2"
              disabled={isRequestingPermission}
            >
              <BarcodeIcon className="w-5 h-5" />
              {isRequestingPermission ? 'جاري التحقق من الأذونات...' : 'مسح باركود المنتج'}
            </Button>
          )}
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
