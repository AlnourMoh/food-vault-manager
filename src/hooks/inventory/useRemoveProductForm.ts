
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';
import { getMockData } from '@/services/mockData';

export const useRemoveProductForm = () => {
  const { restaurants, products } = getMockData();
  const { toast } = useToast();
  
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  const validateForm = (): boolean => {
    if (!selectedProduct || !quantity || Number(quantity) <= 0) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى التأكد من اختيار المنتج وإدخال كمية صحيحة",
        variant: "destructive"
      });
      return false;
    }
    
    if (selectedProductDetails && Number(quantity) > selectedProductDetails.quantity) {
      toast({
        title: "كمية غير صالحة",
        description: "الكمية المدخلة أكبر من الكمية المتوفرة في المخزون",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Open confirmation dialog instead of immediately submitting
    setIsDialogOpen(true);
  };

  const handleConfirmRemoval = () => {
    setIsSubmitting(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      console.log('Product removed:', {
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
      setIsSubmitting(false);
      setIsDialogOpen(false);
    }, 1000);
  };

  return {
    restaurants,
    selectedRestaurant,
    setSelectedRestaurant,
    selectedProduct,
    setSelectedProduct,
    quantity,
    setQuantity,
    reason,
    setReason,
    filteredProducts,
    selectedProductDetails,
    isDialogOpen,
    setIsDialogOpen,
    isSubmitting,
    handleRestaurantChange,
    handleProductChange,
    handleSubmit,
    handleConfirmRemoval
  };
};
