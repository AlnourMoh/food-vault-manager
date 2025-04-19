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
    setIsScannerOpen(true);
  };

  const handleCloseScanner = () => {
    setIsScannerOpen(false);
  };

  const handleScanResult = async (code: string) => {
    setIsLoading(true);
    
    try {
      const { data: productCode, error: codeError } = await supabase
        .from('product_codes')
        .select('product_id')
        .eq('qr_code', code)
        .single();
      
      if (codeError) {
        throw codeError;
      }
      
      if (!productCode?.product_id) {
        toast({
          title: "خطأ في الباركود",
          description: "لم يتم العثور على معلومات المنتج لهذا الباركود",
          variant: "destructive"
        });
        return;
      }
      
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productCode.product_id)
        .single();
      
      if (productError) {
        throw productError;
      }
      
      setScannedProduct(product as Product);
      
      const restaurantId = localStorage.getItem('restaurantId');
      if (restaurantId) {
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
