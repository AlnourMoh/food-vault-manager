
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, updateDoc, increment, Timestamp, collection, addDoc } from '@/lib/firebase';

interface Product {
  id: string;
  name: string;
  quantity: number;
  [key: string]: any;
}

export const useProductRemoval = () => {
  const { toast } = useToast();
  const [barcode, setBarcode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const restaurantId = localStorage.getItem('restaurantId');

  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(e.target.value);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleScanBarcode = async () => {
    if (!barcode) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال الباركود",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // البحث عن المنتج باستخدام الباركود
      const productsRef = collection(doc(collection(doc("dbs"), 'restaurants'), restaurantId || ''), 'products');
      const productSnapshot = await getDoc(doc(productsRef, barcode));
      
      if (productSnapshot.exists()) {
        const productData = productSnapshot.data();
        setProduct({ id: barcode, ...productData } as Product);
      } else {
        toast({
          title: "خطأ",
          description: "لم يتم العثور على المنتج",
          variant: "destructive",
        });
        setProduct(null);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء البحث عن المنتج",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveProduct = async () => {
    if (!product) return;
    
    if (product.quantity < quantity) {
      toast({
        title: "خطأ",
        description: "الكمية المطلوبة أكبر من الكمية المتوفرة",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const productRef = doc(doc(collection(doc("dbs"), 'restaurants'), restaurantId || ''), 'products', barcode);
      
      // تحديث كمية المنتج
      await updateDoc(productRef, {
        quantity: increment(-quantity)
      });
      
      // إضافة سجل للعملية
      const logsRef = collection(doc(collection(doc("dbs"), 'restaurants'), restaurantId || ''), 'logs');
      await addDoc(logsRef, {
        type: 'remove',
        productId: barcode,
        productName: product.name,
        quantity: quantity,
        timestamp: Timestamp.now(),
        userId: localStorage.getItem('userId') || 'unknown',
        userName: localStorage.getItem('userName') || 'unknown'
      });
      
      toast({
        title: "تم بنجاح",
        description: `تم إخراج ${quantity} من ${product.name}`
      });
      
      // إعادة تعيين الحقول
      resetForm();
    } catch (error) {
      console.error("Error removing product:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إخراج المنتج",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setBarcode('');
    setQuantity(1);
    setProduct(null);
  };

  return {
    barcode,
    quantity,
    isLoading,
    product,
    handleBarcodeChange,
    handleQuantityChange,
    handleScanBarcode,
    handleRemoveProduct,
    setBarcode
  };
};
