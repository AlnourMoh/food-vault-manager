
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
          
          // Handle Firebase Timestamp conversion properly
          let formattedDate: string | undefined;
          if (productData.created_at) {
            // Check if it's a Firebase timestamp (has toDate method)
            if (typeof productData.created_at.toDate === 'function') {
              // Convert Firebase timestamp to JS Date
              const dateObj = productData.created_at.toDate();
              // Format the JS Date
              formattedDate = dateObj.toLocaleDateString('ar-SA');
            } else if (productData.created_at instanceof Date) {
              // Handle if it's already a Date
              formattedDate = productData.created_at.toLocaleDateString('ar-SA');
            } else if (typeof productData.created_at === 'string' || typeof productData.created_at === 'number') {
              // Handle if it's a string or number
              formattedDate = new Date(productData.created_at).toLocaleDateString('ar-SA');
            } else {
              // Fallback for other cases
              console.warn('Unexpected date format:', productData.created_at);
              formattedDate = undefined;
            }
          }
            
          registeredProducts.push({
            id: doc.id,
            name: productData.name,
            category: productData.category,
            unit: productData.unit || 'قطعة',
            quantity: productData.quantity || 0,
            barcode: doc.id, // Use document ID as barcode
            status: productData.status || 'active',
            addedBy: productData.addedBy || 'غير معروف',
            createdAt: formattedDate
          });
        });
        
        // Sort by creation date, newest first
        registeredProducts.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          // Safe way to compare the date strings
          try {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          } catch (error) {
            console.warn('Error sorting dates:', error);
            return 0;
          }
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
