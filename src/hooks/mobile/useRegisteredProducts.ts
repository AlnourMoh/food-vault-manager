
import { useState, useEffect } from 'react';
import { db, collection, query, where, getDocs } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export interface RegisteredProduct {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  barcode?: string;
  status: string;
  addedBy: string;
  createdAt?: string;
}

export const useRegisteredProducts = () => {
  const [products, setProducts] = useState<RegisteredProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const restaurantId = localStorage.getItem('restaurantId');

  const fetchRegisteredProducts = async () => {
    if (!restaurantId) {
      toast({
        title: "خطأ في النظام",
        description: "لم يتم العثور على معرف المطعم",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const productsRef = collection(db, `restaurants/${restaurantId}/products`);
      // Get products with zero quantity (registered but not added to inventory yet)
      const productsQuery = query(productsRef, where("quantity", "==", 0));
      const querySnapshot = await getDocs(productsQuery);

      if (querySnapshot.empty) {
        setProducts([]);
      } else {
        const registeredProducts: RegisteredProduct[] = [];
        querySnapshot.docs.forEach((doc) => {
          const productData = doc.data();
          const createdAtDate = productData.created_at 
            ? typeof productData.created_at.toDate === 'function' 
              ? productData.created_at.toDate() 
              : new Date(productData.created_at)
            : new Date();
            
          registeredProducts.push({
            id: doc.id,
            name: productData.name,
            category: productData.category,
            unit: productData.unit || 'قطعة',
            quantity: productData.quantity || 0,
            barcode: doc.id, // Use document ID as barcode
            status: productData.status || 'active',
            addedBy: productData.addedBy || 'غير معروف',
            createdAt: createdAtDate.toLocaleDateString('ar-SA')
          });
        });
        
        // Sort by creation date, newest first
        registeredProducts.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        setProducts(registeredProducts);
      }
    } catch (error) {
      console.error("Error fetching registered products:", error);
      toast({
        title: "خطأ في جلب المنتجات",
        description: "حدث خطأ أثناء جلب المنتجات المسجلة",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisteredProducts();
    
    // Refresh every 30 seconds to check for new registered products
    const intervalId = setInterval(fetchRegisteredProducts, 30000);
    
    return () => clearInterval(intervalId);
  }, [restaurantId]);

  return {
    products,
    loading,
    refreshProducts: fetchRegisteredProducts
  };
};
