
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Printer, ArrowLeft } from 'lucide-react';

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

const ProductBarcodes = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [barcodes, setBarcodes] = useState<Barcode[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Determine current route type
  const isRestaurantRoute = window.location.pathname.startsWith('/restaurant/');
  const inventoryPath = isRestaurantRoute ? '/restaurant/inventory' : '/inventory';

  useEffect(() => {
    const fetchBarcodesAndProduct = async () => {
      setIsLoading(true);
      try {
        // Fetch the product
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (productError) {
          throw productError;
        }
        
        if (productData) {
          setProduct({
            id: productData.id,
            name: productData.name,
            imageUrl: (productData as any).imageUrl || ''
          });
        }
        
        // Fetch barcodes for this product
        const { data: barcodeData, error: barcodeError } = await supabase
          .from('product_codes')
          .select('*')
          .eq('product_id', productId)
          .order('created_at', { ascending: true });
        
        if (barcodeError) {
          throw barcodeError;
        }
        
        if (barcodeData) {
          setBarcodes(barcodeData);
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

  // Choose the appropriate layout based on the route
  const Layout = isRestaurantRoute ? RestaurantLayout : MainLayout;

  return (
    <Layout>
      <div className="rtl space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">باركود المنتج</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate(inventoryPath)}
            >
              <ArrowLeft className="h-4 w-4 ml-2" /> العودة للمخزون
            </Button>
            <Button 
              onClick={handlePrint}
              className="bg-fvm-primary hover:bg-fvm-primary-light print:hidden"
            >
              <Printer className="h-4 w-4 ml-2" /> طباعة الباركود
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fvm-primary"></div>
          </div>
        ) : (
          <>
            {product && (
              <div className="mb-6 pb-4 border-b print:hidden">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-600">عدد الباركود: {barcodes.length}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 print:grid-cols-3">
              {barcodes.map((barcode) => (
                <Card key={barcode.id} className="print:border-2 print:shadow-none">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="w-full text-center py-2 border-b mb-2">
                      {product?.name}
                    </div>
                    <div className="text-2xl font-mono my-2 text-center">
                      {barcode.qr_code}
                    </div>
                    {/* This is where we'd render an actual barcode or QR image */}
                    <div className="border-2 border-black w-full h-20 flex items-center justify-center my-2">
                      {barcode.qr_code}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      رقم المنتج: {barcode.product_id.substring(0, 8)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {barcodes.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium">لا توجد باركودات لهذا المنتج</h3>
                <p className="text-gray-500 mt-2">يرجى التحقق من معرف المنتج</p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default ProductBarcodes;
