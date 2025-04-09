
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { generateBarcodesFromProduct } from '@/utils/barcodeUtils';

interface Barcode {
  id: string;
  product_id: string;
  qr_code: string;
  is_used: boolean;
}

interface Product {
  id: string;
  name: string;
  imageUrl?: string;
}

export const useBarcodes = (productId: string | undefined) => {
  const { toast } = useToast();
  const [barcodes, setBarcodes] = useState<Barcode[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBarcodesAndProduct = async () => {
      setIsLoading(true);
      try {
        if (!productId) {
          throw new Error("No product ID provided");
        }
        
        console.log("Fetching barcodes for product ID:", productId);
        
        // Fetch the product
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (productError) {
          console.error("Error fetching product:", productError);
          throw productError;
        }
        
        console.log("Product data:", productData);
        
        if (productData) {
          setProduct({
            id: productData.id,
            name: productData.name
          });
          
          // Try to fetch barcodes from database first
          const { data: barcodeData, error: barcodeError } = await supabase
            .from('product_codes')
            .select('*')
            .eq('product_id', productId);
          
          if (barcodeError) {
            console.error("Error fetching barcodes:", barcodeError);
            // Instead of throwing error, we'll generate barcodes dynamically
            const generatedBarcodes = generateBarcodesFromProduct(productData);
            setBarcodes(generatedBarcodes);
            return;
          }
          
          console.log("Barcode data:", barcodeData);
          
          if (barcodeData && barcodeData.length > 0) {
            setBarcodes(barcodeData);
          } else {
            console.log("No barcodes found in DB for product ID:", productId);
            // If no barcodes in DB, generate them dynamically
            const generatedBarcodes = generateBarcodesFromProduct(productData);
            setBarcodes(generatedBarcodes);
          }
        }
      } catch (error: any) {
        console.error('Error fetching barcodes:', error);
        toast({
          title: "خطأ في تحميل البيانات",
          description: error.message || "حدث خطأ أثناء تحميل البيانات",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (productId) {
      fetchBarcodesAndProduct();
    }
  }, [productId, toast]);

  const handlePrint = () => {
    window.print();
  };

  return {
    barcodes,
    product,
    isLoading,
    handlePrint
  };
};
