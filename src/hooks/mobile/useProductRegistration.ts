
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { db, doc, updateDoc, addDoc, collection, serverTimestamp } from '@/lib/firebase';
import { ProductRegistrationData } from '@/components/mobile/RegisterProductForm';

export const useProductRegistration = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const restaurantId = localStorage.getItem('restaurantId');

  const handleRegisterProduct = async (productData: ProductRegistrationData) => {
    if (!restaurantId) {
      toast({
        title: "خطأ في النظام",
        description: "لم يتم العثور على معرف المطعم",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Create a new product in the system
      // Since setDoc is not available, we'll use either updateDoc with an existing doc reference
      // or addDoc to add to a collection
      const productRef = doc(db, `restaurants/${restaurantId}/products`, productData.barcode);
      
      await updateDoc(productRef, {
        name: productData.name,
        category: productData.category,
        unit: productData.unit,
        quantity: 0,  // Initial quantity is 0 until inventory adds it
        status: 'active',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        addedBy: localStorage.getItem('teamMemberName') || 'مستخدم غير معروف'
      });
      
      toast({
        title: "تم تسجيل المنتج",
        description: `تم تسجيل منتج ${productData.name} بنجاح في النظام`,
        variant: "default",
      });
      
      // Add a transaction record for the registration
      const transactionsCollection = collection(db, `restaurants/${restaurantId}/transactions`);
      await addDoc(transactionsCollection, {
        productId: productData.barcode,
        productName: productData.name,
        type: 'register',
        timestamp: serverTimestamp(),
        userId: localStorage.getItem('userId') || 'unknown',
        userName: localStorage.getItem('teamMemberName') || 'مستخدم غير معروف'
      });
      
    } catch (error) {
      console.error("Error registering product:", error);
      toast({
        title: "خطأ في النظام",
        description: "حدث خطأ أثناء تسجيل المنتج",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleRegisterProduct
  };
};
