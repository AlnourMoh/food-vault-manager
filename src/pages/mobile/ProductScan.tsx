
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BarcodeScanner from '@/components/mobile/BarcodeScanner';
import { InitialScanCard } from '@/components/mobile/scanner/product/InitialScanCard';
import { ScannedProductCard } from '@/components/mobile/scanner/product/ScannedProductCard';
import { Product } from '@/types';

const ProductScan = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleOpenScanner = () => {
    console.log('Opening scanner');
    setIsScannerOpen(true);
  };

  const handleCloseScanner = () => {
    console.log('Closing scanner');
    setIsScannerOpen(false);
  };

  const handleScanResult = async (code: string) => {
    console.log('Scan result received:', code);
    setIsLoading(true);
    
    try {
      console.log('Fetching product data for code:', code);
      const { data: productCode, error: codeError } = await supabase
        .from('product_codes')
        .select('product_id')
        .eq('qr_code', code)
        .single();
      
      if (codeError) {
        console.error('Error fetching product code:', codeError);
        throw codeError;
      }
      
      if (!productCode?.product_id) {
        console.error('No product ID found for code:', code);
        toast({
          title: "خطأ في الباركود",
          description: "لم يتم العثور على معلومات المنتج لهذا الباركود",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      console.log('Found product ID:', productCode.product_id);
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productCode.product_id)
        .single();
      
      if (productError) {
        console.error('Error fetching product details:', productError);
        throw productError;
      }
      
      console.log('Retrieved product data:', product);
      
      // Convert database product to the Product interface format
      // Make sure we validate the status value to match the expected union type
      const normalizedStatus = ((): 'active' | 'expired' | 'removed' => {
        switch(product.status) {
          case 'active':
            return 'active';
          case 'expired':
            return 'expired';
          case 'removed':
            return 'removed';
          default:
            // Default to 'active' if status doesn't match any expected values
            console.warn(`Unexpected product status: ${product.status}, defaulting to 'active'`);
            return 'active';
        }
      })();
      
      const formattedProduct: Product = {
        id: product.id,
        name: product.name,
        category: product.category,
        unit: product.unit || '',
        quantity: product.quantity,
        expiryDate: new Date(product.expiry_date),
        entryDate: new Date(product.production_date),
        restaurantId: product.company_id,
        restaurantName: '', // This information is not available from the query
        addedBy: '', // This information is not available from the query
        status: normalizedStatus,
        imageUrl: product.image_url,
      };
      
      setScannedProduct(formattedProduct);
      console.log('Formatted product data:', formattedProduct);
      
      const restaurantId = localStorage.getItem('restaurantId');
      if (restaurantId) {
        console.log('Recording scan for restaurant:', restaurantId);
        await supabase
          .from('product_scans')
          .insert({
            product_id: product.id,
            qr_code: code,
            scan_type: 'check',
            scanned_by: restaurantId
          });
      }
      
      toast({
        title: "تم مسح المنتج بنجاح",
        description: `تم العثور على المنتج: ${product.name}`,
      });
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast({
        title: "خطأ في البحث",
        description: "حدث خطأ أثناء البحث عن معلومات المنتج",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanAnother = () => {
    setScannedProduct(null);
  };

  const viewProductDetails = () => {
    if (scannedProduct?.id) {
      navigate(`/restaurant/products/${scannedProduct.id}`);
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">مسح المنتجات</h1>
      
      {!scannedProduct ? (
        <InitialScanCard 
          onOpenScanner={handleOpenScanner}
          isLoading={isLoading}
        />
      ) : (
        <ScannedProductCard
          product={scannedProduct}
          onScanAnother={handleScanAnother}
          onViewDetails={viewProductDetails}
        />
      )}
      
      {isScannerOpen && (
        <BarcodeScanner
          onScan={handleScanResult}
          onClose={handleCloseScanner}
        />
      )}
    </div>
  );
};

export default ProductScan;
