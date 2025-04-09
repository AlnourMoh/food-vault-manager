
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import BarcodePageHeader from '@/components/barcodes/BarcodePageHeader';
import BarcodeGrid from '@/components/barcodes/BarcodeGrid';
import { useBarcodes } from '@/hooks/barcodes/useBarcodes';

const ProductBarcodes = () => {
  const { productId } = useParams<{ productId: string }>();
  const { barcodes, product, isLoading, handlePrint, handlePrintSingle } = useBarcodes(productId);
  
  // Determine current route type
  const isRestaurantRoute = window.location.pathname.startsWith('/restaurant/');
  
  // Choose the appropriate layout based on the route
  const Layout = isRestaurantRoute ? RestaurantLayout : MainLayout;

  return (
    <Layout>
      <div className="rtl space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fvm-primary"></div>
          </div>
        ) : (
          <>
            {product && (
              <BarcodePageHeader 
                productName={product.name} 
                barcodeCount={barcodes.length}
                handlePrint={handlePrint}
              />
            )}
            
            <BarcodeGrid 
              barcodes={barcodes} 
              productName={product?.name || 'منتج غير معروف'} 
              onPrintSingle={handlePrintSingle}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default ProductBarcodes;
