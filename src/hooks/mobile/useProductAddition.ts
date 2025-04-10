
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { db, doc, getDoc, collection, addDoc, updateDoc, increment, serverTimestamp } from '@/lib/firebase';

export const useProductAddition = () => {
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [productInfo, setProductInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const restaurantId = localStorage.getItem('restaurantId');

  useEffect(() => {
    if (barcode) {
      fetchProductInfo(barcode);
    }
  }, [barcode]);

  const fetchProductInfo = async (code: string) => {
    setLoading(true);
    try {
      // Check if the product exists in the restaurant's inventory
      const productRef = doc(db, `restaurants/${restaurantId}/products`, code);
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        setProductInfo(productSnap.data());
      } else {
        toast({
          title: "المنتج غير موجود",
          description: "هذا المنتج غير مسجل في قاعدة البيانات",
          variant: "destructive"
        });
        setProductInfo(null);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "خطأ في النظام",
        description: "حدث خطأ أثناء البحث عن المنتج",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScanResult = (result: string) => {
    setBarcode(result);
    setScanning(false);
  };

  const handleAddProduct = async () => {
    if (!barcode || !productInfo) {
      toast({
        title: "بيانات غير مكتملة",
        description: "يرجى مسح الباركود أولاً",
        variant: "destructive"
      });
      return;
    }

    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      toast({
        title: "كمية غير صالحة",
        description: "يرجى إدخال كمية صالحة",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Update product quantity in the database
      const productRef = doc(db, `restaurants/${restaurantId}/products`, barcode);
      await updateDoc(productRef, {
        quantity: increment(Number(quantity)),
        updated_at: serverTimestamp()
      });
      
      // Add transaction record
      const transactionsRef = collection(db, `restaurants/${restaurantId}/transactions`);
      await addDoc(transactionsRef, {
        productId: barcode,
        productName: productInfo.name,
        quantity: Number(quantity),
        type: 'add',
        timestamp: serverTimestamp(),
        userId: localStorage.getItem('userId') || 'unknown',
        userName: localStorage.getItem('teamMemberName') || 'مستخدم غير معروف'
      });
      
      toast({
        title: "تمت العملية بنجاح",
        description: `تم إضافة ${quantity} ${productInfo.name} إلى المخزون`,
        variant: "default",
      });

      // Reset form
      setBarcode('');
      setQuantity('1');
      setProductInfo(null);
      
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "خطأ في النظام",
        description: "حدث خطأ أثناء إضافة المنتج",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};
