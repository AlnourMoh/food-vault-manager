
import { useState } from 'react';
import { ToastAPI } from '@/hooks/use-toast';

export const useProductSubmission = (
  barcode: string,
  quantity: string,
  productInfo: any,
  toast: ToastAPI,
  onSuccess: () => void
) => {
  const [loading, setLoading] = useState(false);
  const restaurantId = localStorage.getItem('restaurantId') || 'restaurant-demo-123';

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

      // Call the success callback to reset the form
      onSuccess();
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

  return { handleAddProduct, loading };
};
