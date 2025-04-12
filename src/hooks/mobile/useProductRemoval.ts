
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
  const [quantity, setQuantity] = useState('1');
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productInfo, setProductInfo] = useState<Product | null>(null);
  const restaurantId = localStorage.getItem('restaurantId');

  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(e.target.value);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value);
  };

  const handleScanResult = (result: string) => {
    setBarcode(result);
    setScanning(false);
    fetchProductInfo(result);
  };

  const fetchProductInfo = async (code: string) => {
    if (!code) return;
    
    setLoading(true);
    try {
      // Check if the product exists in the restaurant's inventory
      const productRef = doc(collection(doc(collection(doc("dbs"), 'restaurants'), restaurantId || ''), 'products'), code);
      const productSnapshot = await getDoc(productRef);
      
      if (productSnapshot.exists()) {
        const productData = productSnapshot.data();
        setProductInfo({ id: code, ...productData } as Product);
      } else {
        toast({
          title: "خطأ",
          description: "لم يتم العثور على المنتج",
          variant: "destructive",
        });
        setProductInfo(null);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء البحث عن المنتج",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async () => {
    if (!productInfo) return;
    
    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال كمية صالحة",
        variant: "destructive",
      });
      return;
    }
    
    if (productInfo.quantity < quantityNum) {
      toast({
        title: "خطأ",
        description: "الكمية المطلوبة أكبر من الكمية المتوفرة",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const productRef = doc(collection(doc(collection(doc("dbs"), 'restaurants'), restaurantId || ''), 'products'), barcode);
      
      // تحديث كمية المنتج
      await updateDoc(productRef, {
        quantity: increment(-quantityNum)
      });
      
      // إضافة سجل للعملية
      const logsRef = collection(doc(collection(doc("dbs"), 'restaurants'), restaurantId || ''), 'logs');
      await addDoc(logsRef, {
        type: 'remove',
        productId: barcode,
        productName: productInfo.name,
        quantity: quantityNum,
        timestamp: Timestamp.now(),
        userId: localStorage.getItem('userId') || 'unknown',
        userName: localStorage.getItem('userName') || 'unknown'
      });
      
      toast({
        title: "تم بنجاح",
        description: `تم إخراج ${quantityNum} من ${productInfo.name}`
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
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBarcode('');
    setQuantity('1');
    setProductInfo(null);
  };

  return {
    barcode,
    quantity,
    loading,
    scanning,
    setScanning,
    productInfo,
    handleBarcodeChange,
    handleQuantityChange,
    handleScanResult,
    handleRemoveProduct,
    setBarcode,
    setQuantity
  };
};
