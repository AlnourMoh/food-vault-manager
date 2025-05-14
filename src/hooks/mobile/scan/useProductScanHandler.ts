
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types';
import { useScanProduct } from './useScanProduct';
import { useToast } from '@/hooks/use-toast';

interface UseProductScanHandlerProps {
  onSuccess?: (product: Product) => void;
}

export const useProductScanHandler = ({ onSuccess }: UseProductScanHandlerProps = {}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { fetchProductByCode, logProductScan, isLoading } = useScanProduct();
  
  // تسجيل حالة المسح للتشخيص
  useEffect(() => {
    console.log('ProductScanHandler: حالة المسح -', {
      isScanning,
      isLoading,
      hasProduct: !!scannedProduct,
      error
    });
  }, [isScanning, isLoading, scannedProduct, error]);
  
  // معالجة نتيجة مسح الباركود
  const handleScan = async (code: string) => {
    try {
      console.log('ProductScanHandler: تم مسح الباركود:', code);
      setIsScanning(true);
      setError(null);
      
      // عرض إشعار بالمسح الناجح
      toast({
        title: "تم مسح الباركود",
        description: `تم مسح الرمز: ${code}`
      });
      
      // جلب معلومات المنتج
      const product = await fetchProductByCode(code);
      
      if (product) {
        // تخزين المنتج وتسجيل عملية المسح
        setScannedProduct(product);
        await logProductScan(code, product.id, "check");
        
        // عرض إشعار بنجاح العثور على المنتج
        toast({
          title: "تم العثور على المنتج",
          description: `${product.name} - ${product.category}`
        });
        
        // استدعاء دالة النجاح إن وجدت
        if (onSuccess) {
          onSuccess(product);
        }
      }
    } catch (error) {
      console.error('ProductScanHandler: خطأ في معالجة نتيجة المسح:', error);
      setError(typeof error === 'string' ? error : "حدث خطأ أثناء معالجة نتيجة المسح");
      
      toast({
        title: "خطأ في المسح",
        description: typeof error === 'string' ? error : "حدث خطأ أثناء معالجة نتيجة المسح",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };
  
  // إعادة تعيين حالة المسح للبدء من جديد
  const resetScan = () => {
    setScannedProduct(null);
    setError(null);
    setIsScanning(false);
  };
  
  // الانتقال إلى صفحة تفاصيل المنتج
  const viewProductDetails = () => {
    if (scannedProduct) {
      navigate(`/restaurant/products/${scannedProduct.id}`);
    }
  };
  
  return {
    isScanning,
    isLoading,
    scannedProduct,
    error,
    handleScan,
    resetScan,
    viewProductDetails
  };
};
