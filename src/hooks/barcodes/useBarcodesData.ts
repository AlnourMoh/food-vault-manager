
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { generateBarcodesFromProduct } from '@/utils/barcodeUtils';
import { Barcode, Product } from './types';

/**
 * Hook for fetching and managing barcode data for a specific product
 * 
 * @param productId - The ID of the product to fetch barcodes for
 * @returns An object containing the barcodes, product information, and loading state
 */
export const useBarcodesData = (productId: string | undefined) => {
  const { toast } = useToast();
  const [barcodes, setBarcodes] = useState<Barcode[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /**
     * Fetches barcode and product data from the database
     * Falls back to generating barcodes if none exist in the database
     */
    const fetchBarcodesAndProduct = async () => {
      setIsLoading(true);
      try {
        if (!productId) {
          throw new Error("No product ID provided");
        }
        
        console.log("Fetching barcodes for product ID:", productId);
        
        // Step 1: Fetch the product information with additional fields
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
          // Step 2: Set product info in state with additional fields
          setProduct({
            id: productData.id,
            name: productData.name,
            category: productData.category,
            productionDate: productData.production_date,
            expiryDate: productData.expiry_date
          });
          
          // Step 3: Try to fetch barcodes from database
          const { data: barcodeData, error: barcodeError } = await supabase
            .from('product_codes')
            .select('*')
            .eq('product_id', productId);
          
          if (barcodeError) {
            console.error("Error fetching barcodes:", barcodeError);
            // Instead of throwing error, generate barcodes dynamically
            const generatedBarcodes = generateBarcodesFromProduct(productData);
            setBarcodes(generatedBarcodes);
            return;
          }
          
          console.log("Barcode data:", barcodeData);
          
          // Step 4: Use existing barcodes or generate new ones if none exist
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
    
    // Only fetch data if we have a product ID
    if (productId) {
      fetchBarcodesAndProduct();
    }
  }, [productId, toast]);

  return { barcodes, product, isLoading };
};
