
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
  const restaurantId = localStorage.getItem('restaurantId') || 'restaurant-demo-123';

  // Setting default localStorage values if they don't exist
  useEffect(() => {
    if (!localStorage.getItem('restaurantId')) {
      localStorage.setItem('restaurantId', 'restaurant-demo-123');
    }
    
    if (!localStorage.getItem('teamMemberId')) {
      localStorage.setItem('teamMemberId', 'user-demo-123');
    }
    
    if (!localStorage.getItem('teamMemberName')) {
      localStorage.setItem('teamMemberName', 'سارة الاحمد');
    }
  }, []);

  useEffect(() => {
    if (barcode) {
      fetchProductInfo(barcode);
    }
  }, [barcode]);

  const fetchProductInfo = async (code: string) => {
    console.log("Fetching product info for barcode:", code);
    setLoading(true);
    try {
      // في الوضع التجريبي، نبحث عن المنتج في البيانات المحلية
      const mockProducts = [
        {
          id: '67890',
          name: 'دقيق',
          category: 'بقالة',
          unit: 'كيلوغرام',
          quantity: 0,
          barcode: '67890',
          description: 'دقيق متعدد الاستخدامات للخبز والطبخ',
          expiryDate: { toDate: () => new Date(2025, 11, 31) },
          status: 'active',
          addedBy: 'سارة الاحمد'
        },
        {
          id: '54321',
          name: 'طماطم',
          category: 'خضروات',
          unit: 'كيلوغرام',
          quantity: 0,
          barcode: '54321',
          description: 'طماطم طازجة',
          expiryDate: { toDate: () => new Date(2025, 4, 30) },
          status: 'active',
          addedBy: 'سارة الاحمد'
        },
        {
          id: '12345',
          name: 'زيت زيتون',
          category: 'بقالة',
          unit: 'لتر',
          quantity: 0,
          barcode: '12345',
          description: 'زيت زيتون عالي الجودة',
          expiryDate: { toDate: () => new Date(2026, 5, 15) },
          status: 'active',
          addedBy: 'سارة الاحمد'
        }
      ];
      
      const product = mockProducts.find(p => p.id === code || p.barcode === code);
      
      if (product) {
        console.log("Product found:", product);
        setProductInfo(product);
      } else {
        console.log("Product not found in mock data");
        toast({
          title: "المنتج غير موجود",
          description: "هذا المنتج غير مسجل في قاعدة البيانات",
          variant: "destructive"
        });
        setProductInfo(null);
      }
      
      /* 
      // الكود الأصلي للاستخدام مع Firebase
      const productRef = doc(db, `restaurants/${restaurantId}/products`, code);
      const productSnap = await getDoc(productRef);
      
      if (productSnap.exists()) {
        console.log("Product found:", productSnap.data());
        setProductInfo({
          ...productSnap.data(),
          id: code
        });
      } else {
        console.log("Product not found in database");
        toast({
          title: "المنتج غير موجود",
          description: "هذا المنتج غير مسجل في قاعدة البيانات",
          variant: "destructive"
        });
        setProductInfo(null);
      }
      */
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
    console.log("Scan result:", result);
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
      
      // Simulate API request delay and success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "تمت العملية بنجاح",
        description: `تم إضافة ${quantity} ${productInfo.unit} من ${productInfo.name} إلى المخزون`,
        variant: "default",
      });

      // Reset form
      setBarcode('');
      setQuantity('1');
      setProductInfo(null);
      
      /* 
      // الكود الأصلي للاستخدام مع Firebase
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
        userId: localStorage.getItem('teamMemberId') || 'unknown',
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
      */
      
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
