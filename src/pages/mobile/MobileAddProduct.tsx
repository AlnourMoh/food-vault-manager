
import React, { useState, useEffect } from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import PageHeader from '@/components/mobile/PageHeader';
import { useProductAddition } from '@/hooks/mobile/useProductAddition';
import BarcodeScanner from '@/components/mobile/BarcodeScanner';
import ProductInfo from '@/components/mobile/ProductInfo';
import ProductSubmitButton from '@/components/mobile/ProductSubmitButton';
import RegisteredProductsList from '@/components/mobile/RegisteredProductsList';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info, ScanLine } from 'lucide-react';

const MobileAddProduct = () => {
  const {
    scanning,
    setScanning,
    barcode,
    setBarcode,
    quantity,
    setQuantity,
    productInfo,
    loading,
    handleScanResult,
    handleAddProduct
  } = useProductAddition();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value);
  };

  const handleScanRegisteredProduct = (code: string) => {
    console.log("تم اختيار منتج مسجل للمسح:", code);
    setBarcode(code);
  };

  // إعداد البيانات الافتراضية للعرض التجريبي
  useEffect(() => {
    console.log("تهيئة بيانات العرض التجريبي في MobileAddProduct...");
    
    // تعيين معرف المطعم للعرض التجريبي إذا لم يكن موجوداً
    if (!localStorage.getItem('restaurantId')) {
      localStorage.setItem('restaurantId', 'restaurant-demo-123');
    }
    
    // تعيين معرف المستخدم للعرض التجريبي إذا لم يكن موجوداً
    if (!localStorage.getItem('teamMemberId')) {
      localStorage.setItem('teamMemberId', 'user-demo-123');
    }
    
    // تعيين اسم عضو الفريق الافتراضي إذا لم يكن موجوداً
    if (!localStorage.getItem('teamMemberName')) {
      localStorage.setItem('teamMemberName', 'سارة الاحمد');
    }
    
    // تعيين دور عضو الفريق الافتراضي إذا لم يكن موجودًا
    if (!localStorage.getItem('teamMemberRole')) {
      localStorage.setItem('teamMemberRole', 'عضو فريق');
    }
  }, []);

  return (
    <RestaurantLayout hideSidebar={true}>
      <div className="rtl space-y-4 p-3">
        <PageHeader
          title="إدخال منتج"
          backPath="/restaurant/mobile"
        />

        {scanning ? (
          <BarcodeScanner 
            onScanResult={handleScanResult}
            onCancel={() => setScanning(false)}
          />
        ) : (
          <div className="space-y-4">
            {!productInfo && (
              <>
                <Alert className="bg-blue-50 border-blue-200 mt-4">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800 text-sm font-bold">المنتجات المسجلة</AlertTitle>
                  <AlertDescription className="text-blue-700 text-xs">
                    اضغط على المنتج لإدخاله للمخزون أو استخدم زر مسح الباركود أدناه
                  </AlertDescription>
                </Alert>

                {/* عرض المنتجات المسجلة التي تنتظر الإضافة للمخزون */}
                <RegisteredProductsList onScanProduct={handleScanRegisteredProduct} />
                
                {/* زر مسح باركود */}
                <div className="mt-6">
                  <Button 
                    onClick={() => setScanning(true)}
                    className="w-full bg-fvm-primary hover:bg-fvm-primary-light text-white py-3 flex items-center justify-center gap-2"
                  >
                    <ScanLine className="h-5 w-5" />
                    <span>مسح باركود منتج مسجل</span>
                  </Button>
                </div>
              </>
            )}

            {productInfo && (
              <>
                <ProductInfo 
                  productInfo={productInfo}
                  quantity={quantity}
                  onQuantityChange={handleQuantityChange}
                  action="إضافة"
                  showMaxQuantity={false}
                />
                
                <ProductSubmitButton 
                  onClick={handleAddProduct}
                  disabled={loading}
                  label="تأكيد إدخال المنتج"
                />
              </>
            )}
          </div>
        )}
      </div>
    </RestaurantLayout>
  );
};

export default MobileAddProduct;
