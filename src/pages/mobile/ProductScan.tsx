
import React, { useEffect, useState } from 'react';
import { useProductScanLogic } from '@/hooks/mobile/scan/useProductScanLogic';
import { InitialScanCard } from '@/components/mobile/scanner/product/InitialScanCard';
import { ScannedProductCard } from '@/components/mobile/scanner/product/ScannedProductCard';
import ZXingBarcodeScanner from '@/components/mobile/ZXingBarcodeScanner';
import { ErrorDisplay } from '@/components/mobile/scanner/product/ErrorDisplay';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { BrowserView } from '@/components/mobile/scanner/components/BrowserView';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ScannerErrorBanner, ScannerErrorCard } from '@/components/mobile/scanner/components/ScannerErrorBanner';

const ProductScan = () => {
  const navigate = useNavigate();
  const [showFullScanUI, setShowFullScanUI] = useState(false);
  const {
    isScannerOpen,
    scannedProduct,
    isLoading,
    scanError,
    handleOpenScanner,
    handleCloseScanner,
    handleScanResult,
    handleScanAnother,
    viewProductDetails
  } = useProductScanLogic();
  
  // التحقق من بيئة التشغيل - تعامل مع البيئة دائماً على أنها تطبيق جوال
  const isNativePlatform = Capacitor.isNativePlatform();
  const isWebView = navigator.userAgent.toLowerCase().includes('wv');
  const isMobileApp = isNativePlatform || isWebView;
  
  // نطبع معلومات البيئة للتشخيص
  useEffect(() => {
    console.log('ProductScan: البيئة الحالية:', isNativePlatform ? 'تطبيق جوال' : 'متصفح');
    console.log('ProductScan: المنصة:', Capacitor.getPlatform());
    
    // عرض معلومات بيئة التشغيل في الواجهة للمستخدمين
    try {
      Toast.show({
        text: `تم التشغيل على ${Capacitor.getPlatform() === 'android' ? 'أندرويد' : 'الويب'}`,
        duration: "short"
      });
    } catch (error) {
      console.error('ProductScan: خطأ في عرض المعلومات:', error);
    }
  }, []);
  
  // فتح الماسح تلقائياً عند تحميل الصفحة
  useEffect(() => {
    if (!isScannerOpen && !scannedProduct) {
      console.log('ProductScan: محاولة فتح الماسح فوراً');
      // تأخير قصير لضمان تحميل الواجهة أولاً
      const timer = setTimeout(() => {
        handleOpenScanner();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isScannerOpen, scannedProduct, handleOpenScanner]);

  // إذا تم مسح المنتج، نعرض معلوماته
  if (scannedProduct) {
    return (
      <div className="container py-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">مسح المنتجات</h1>
        <ScannedProductCard
          product={scannedProduct}
          onScanAnother={handleScanAnother}
          onViewDetails={viewProductDetails}
        />
      </div>
    );
  }

  // إذا كان هناك خطأ في المسح أو لسنا في بيئة التطبيق
  if (!isMobileApp) {
    return (
      <div className="container py-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">مسح المنتجات</h1>
        
        {/* رسالة خطأ بالأحمر تظهر في أعلى الصفحة */}
        <ScannerErrorBanner 
          message="المسح غير متاح في المتصفح" 
          subMessage="يرجى استخدام تطبيق الجوال للقيام بعمليات المسح"
        />
        
        {/* رسالة خطأ مع زر إعادة المحاولة */}
        <ScannerErrorCard
          message="المسح غير متاح في المتصفح"
          onRetry={handleOpenScanner}
        />
      </div>
    );
  }

  // إذا كان هناك خطأ في المسح
  if (scanError) {
    return (
      <div className="container py-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">مسح المنتجات</h1>
        
        <ScannerErrorCard 
          message={scanError}
          onRetry={handleOpenScanner}
        />
      </div>
    );
  }

  if (showFullScanUI) {
    // عرض واجهة المسح الكاملة
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="p-4">
          <Button variant="ghost" className="text-white" onClick={() => {
            setShowFullScanUI(false);
            handleCloseScanner();
          }}>
            رجوع
          </Button>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <ZXingBarcodeScanner
            onScan={handleScanResult}
            onClose={() => {
              setShowFullScanUI(false);
              handleCloseScanner();
            }}
            autoStart={true}
          />
        </div>
      </div>
    );
  }

  // إظهار الماسح مباشرة أو بطاقة بدء المسح
  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">مسح المنتجات</h1>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-8">
          <Spinner size="lg" className="mb-4" />
          <p>جاري تهيئة الماسح...</p>
        </div>
      )}
      
      {!isScannerOpen && !isLoading && (
        <div className="p-4 bg-white border rounded-lg">
          <InitialScanCard 
            onOpenScanner={() => {
              setShowFullScanUI(true);
              handleOpenScanner();
            }}
            isLoading={isLoading}
            hasPermission={true}
          />
        </div>
      )}
      
      {isScannerOpen && !showFullScanUI && (
        <div className="p-4 bg-white border rounded-lg">
          <Button 
            className="w-full" 
            onClick={() => setShowFullScanUI(true)}
          >
            فتح الماسح بملء الشاشة
          </Button>
          <div className="w-full flex justify-center mt-4">
            <div className="w-full max-w-md">
              <ZXingBarcodeScanner
                onScan={handleScanResult}
                onClose={handleCloseScanner}
                autoStart={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductScan;
