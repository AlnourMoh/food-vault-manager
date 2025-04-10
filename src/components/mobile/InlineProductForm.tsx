
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useProductAddition } from '@/hooks/mobile/useProductAddition';
import { useProductRemoval } from '@/hooks/mobile/useProductRemoval';
import { useProductRegistration } from '@/hooks/mobile/useProductRegistration';
import { useInventoryProducts } from '@/hooks/mobile/useInventoryProducts';
import BarcodeScanner from './BarcodeScanner';
import ProductInfo from './ProductInfo';
import ProductSubmitButton from './ProductSubmitButton';
import EmptyProductState from './EmptyProductState';
import RegisterProductForm from './RegisterProductForm';

interface InlineProductFormProps {
  formType: 'add' | 'remove' | 'register';
  onClose: () => void;
}

const InlineProductForm: React.FC<InlineProductFormProps> = ({ formType, onClose }) => {
  const [userRole, setUserRole] = useState<string>('');
  
  useEffect(() => {
    // Get the user role from localStorage
    const role = localStorage.getItem('teamMemberRole') || '';
    setUserRole(role);
  }, []);

  // تحقق مما إذا كان المستخدم مسؤول نظام
  const isSystemAdmin = userRole === 'إدارة النظام';
  
  // إذا كان المستخدم يحاول الوصول إلى نموذج تسجيل المنتج وليس مسؤول نظام، أغلق النموذج
  useEffect(() => {
    if (formType === 'register' && !isSystemAdmin) {
      onClose();
    }
  }, [formType, isSystemAdmin, onClose]);

  // For Add Product Form
  const {
    scanning: addScanning,
    setScanning: setAddScanning,
    barcode: addBarcode,
    setBarcode: setAddBarcode,
    quantity: addQuantity,
    setQuantity: setAddQuantity,
    productInfo: addProductInfo,
    loading: addLoading,
    handleScanResult: handleAddScanResult,
    handleAddProduct
  } = useProductAddition();

  // For Remove Product Form
  const {
    barcode: removeBarcode,
    setBarcode: setRemoveBarcode,
    quantity: removeQuantity,
    setQuantity: setRemoveQuantity,
    loading: removeLoading,
    scanning: removeScanning,
    setScanning: setRemoveScanning,
    productInfo: removeProductInfo,
    handleScanResult: handleRemoveScanResult,
    handleRemoveProduct
  } = useProductRemoval();

  // For Register Product Form (System Admin)
  const {
    loading: registerLoading,
    handleRegisterProduct
  } = useProductRegistration();

  // Get inventory products
  const { products: inventoryProducts, loading: inventoryLoading } = useInventoryProducts();

  const handleAddQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddQuantity(e.target.value);
  };

  const handleRemoveQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemoveQuantity(e.target.value);
  };

  // تابع لاختيار منتج من القائمة
  const handleSelectProduct = (productBarcode: string) => {
    if (formType === 'add') {
      handleAddScanResult(productBarcode);
    } else if (formType === 'remove') {
      handleRemoveScanResult(productBarcode);
    }
  };

  // Determine which form to show
  const isAddForm = formType === 'add';
  const isRemoveForm = formType === 'remove';
  const isRegisterForm = formType === 'register';
  
  // فحص إذا كان يجب السماح بالوصول إلى نموذج تسجيل المنتج
  if (isRegisterForm && !isSystemAdmin) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg text-red-600">غير مصرح</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-center">لا تملك صلاحية تسجيل منتجات جديدة. هذه الوظيفة متاحة فقط لفريق إدارة النظام.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Only for add and remove forms
  if (!isRegisterForm) {
    const isScanning = isAddForm ? addScanning : removeScanning;
    const setScanning = isAddForm ? setAddScanning : setRemoveScanning;
    const productInfo = isAddForm ? addProductInfo : removeProductInfo;
    const quantity = isAddForm ? addQuantity : removeQuantity;
    const handleQuantityChange = isAddForm ? handleAddQuantityChange : handleRemoveQuantityChange;
    const loading = isAddForm ? addLoading : removeLoading;
    const handleScanResult = isAddForm ? handleAddScanResult : handleRemoveScanResult;
    const handleSubmit = isAddForm ? handleAddProduct : handleRemoveProduct;
    const products = isAddForm ? [] : inventoryProducts; // فقط عرض المنتجات المخزنة في حالة الإخراج
    const productsLoading = isAddForm ? false : inventoryLoading;

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">
            {isAddForm ? 'إدخال منتج' : 'إخراج منتج'}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isScanning ? (
              <BarcodeScanner 
                onScanResult={handleScanResult}
                onCancel={() => setScanning(false)}
              />
            ) : (
              <>
                <Button 
                  className="w-full bg-fvm-primary hover:bg-fvm-primary-light text-white py-3 flex items-center justify-center gap-2"
                  onClick={() => setScanning(true)}
                >
                  <span>مسح باركود منتج</span>
                </Button>
                
                {productInfo ? (
                  <>
                    <ProductInfo 
                      productInfo={productInfo}
                      quantity={quantity}
                      onQuantityChange={handleQuantityChange}
                      action={isAddForm ? "إضافة" : "إخراج"}
                      showMaxQuantity={!isAddForm}
                    />
                    
                    <ProductSubmitButton 
                      onClick={handleSubmit}
                      disabled={loading || (!isAddForm && (removeProductInfo?.quantity === 0))}
                      label={isAddForm ? "تأكيد إدخال المنتج" : "تأكيد إخراج المنتج"}
                    />
                  </>
                ) : (
                  <>
                    {isRemoveForm && products.length > 0 ? (
                      <div className="mt-4">
                        <h3 className="font-medium mb-2">اختر من المنتجات المخزنة:</h3>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {productsLoading ? (
                            <div className="flex justify-center py-4">
                              <div className="animate-spin w-6 h-6 border-2 border-fvm-primary border-t-transparent rounded-full"></div>
                            </div>
                          ) : (
                            products.map((product) => (
                              <div 
                                key={product.id}
                                className="p-3 border rounded-md cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                                onClick={() => handleSelectProduct(product.barcode || product.id)}
                              >
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-xs text-gray-500">{product.category} • {product.unit}</p>
                                </div>
                                <span className="text-sm font-semibold text-green-600">
                                  {product.quantity} {product.unit}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ) : (
                      <EmptyProductState />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // For register form
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">تسجيل منتج جديد</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <RegisterProductForm 
          onSubmit={handleRegisterProduct}
          loading={registerLoading}
        />
      </CardContent>
    </Card>
  );
};

export default InlineProductForm;
