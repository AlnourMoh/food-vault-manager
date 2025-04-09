
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';

interface UseRemoveProductsReturn {
  selectedRestaurant: string;
  selectedProduct: string;
  quantity: string;
  reason: string;
  filteredProducts: Product[];
  selectedProductDetails: Product | null;
  handleRestaurantChange: (value: string) => void;
  handleProductChange: (value: string) => void;
  setQuantity: (value: string) => void;
  setReason: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const useRemoveProducts = (
  restaurants: any[],
  products: Product[]
): UseRemoveProductsReturn => {
  const { toast } = useToast();
  
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

  const handleRestaurantChange = (value: string) => {
    setSelectedRestaurant(value);
    const filtered = products.filter(
      p => p.restaurantId === value && p.status === 'active'
    );
    setFilteredProducts(filtered);
    setSelectedProduct('');
    setSelectedProductDetails(null);
  };

  const handleProductChange = (value: string) => {
    setSelectedProduct(value);
    const productDetails = products.find(p => p.id === value) || null;
    setSelectedProductDetails(productDetails);
    
    // Reset quantity
    setQuantity('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !quantity || Number(quantity) <= 0) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى التأكد من اختيار المنتج وإدخال كمية صحيحة",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedProductDetails && Number(quantity) > selectedProductDetails.quantity) {
      toast({
        title: "كمية غير صالحة",
        description: "الكمية المدخلة أكبر من الكمية المتوفرة في المخزون",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Form submitted:', {
      restaurantId: selectedRestaurant,
      productId: selectedProduct,
      quantity,
      reason
    });
    
    // Show success message
    toast({
      title: "تم إخراج المنتج بنجاح",
      description: `تم إخراج ${quantity} وحدة من ${selectedProductDetails?.name}`,
    });
    
    // Reset form
    setSelectedProduct('');
    setQuantity('');
    setReason('');
    setSelectedProductDetails(null);
  };
  
  return {
    selectedRestaurant,
    selectedProduct,
    quantity,
    reason,
    filteredProducts,
    selectedProductDetails,
    handleRestaurantChange,
    handleProductChange,
    setQuantity,
    setReason,
    handleSubmit
  };
};
