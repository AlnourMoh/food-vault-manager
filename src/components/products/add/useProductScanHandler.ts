
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface UseProductScanHandlerProps {
  isRestaurantRoute: boolean;
}

export const useProductScanHandler = ({ isRestaurantRoute }: UseProductScanHandlerProps) => {
  const [scannerOpen, setScannerOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleProductAdded = () => {
    console.log('Product added successfully');
    toast({
      title: "تم إضافة المنتج",
      description: "تم إضافة المنتج بنجاح وإضافته إلى المخزون"
    });
    
    // Redirect to inventory after successful scan
    const inventoryPath = isRestaurantRoute ? '/restaurant/inventory' : '/inventory';
    console.log('Redirecting to:', inventoryPath);
    navigate(inventoryPath);
  };

  const handleScanResult = async (code: string) => {
    try {
      console.log('تم مسح الرمز:', code);
      
      // إغلاق الماسح
      setScannerOpen(false);
      
      // هنا نضع المنطق الخاص بمعالجة الرمز الممسوح
      toast({
        title: "تم مسح الباركود",
        description: `تم مسح الرمز: ${code}`
      });
      
      handleProductAdded();
    } catch (error) {
      console.error('خطأ في معالجة نتيجة المسح:', error);
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء معالجة نتيجة المسح",
        variant: "destructive"
      });
      setScannerOpen(false);
    }
  };

  return {
    scannerOpen,
    setScannerOpen,
    handleScanResult,
    handleProductAdded
  };
};
