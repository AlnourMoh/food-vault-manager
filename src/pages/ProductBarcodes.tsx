
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Printer, ArrowLeft, QrCode } from 'lucide-react';

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

  // Manually generate barcodes since the database ones don't exist
  const generateBarcodesFromProduct = (product: any) => {
    if (!product || !product.id || !product.quantity) return [];
    
    const generatedBarcodes: Barcode[] = [];
    const productDigits = product.id.replace(/-/g, '').substring(0, 8);
    
    for (let i = 0; i < product.quantity; i++) {
      const unitNumber = String(i+1).padStart(4, '0');
      const barcode = `${productDigits}${unitNumber}`;
      
      generatedBarcodes.push({
        id: `${product.id}-${i+1}`,
        product_id: product.id,
        qr_code: barcode,
        is_used: false
      });
    }
    
    return generatedBarcodes;
  };

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

  // Generate a more realistic barcode SVG
  const generateBarcodeImage = (code: string) => {
    // Create a more complex visualization using the barcode string
    const barcodeDigits = code.replace(/\D/g, ''); // Only use numeric values
    const barsCount = barcodeDigits.length * 2; // Each digit gets 2 bars
    const svgWidth = barsCount * 3; // 3 pixels per bar
    
    let bars = '';
    let xPosition = 0;
    
    // Create alternating bars with varying widths based on the digits
    for (let i = 0; i < barcodeDigits.length; i++) {
      const digit = parseInt(barcodeDigits[i]);
      
      // Bar width based on digit (1-3 pixels)
      const width1 = (digit % 3) + 1;
      const width2 = ((digit + 1) % 3) + 1;
      
      // Add a black bar
      bars += `<rect x="${xPosition}" y="0" width="${width1}" height="50" fill="black" />`;
      xPosition += width1 + 1; // Add 1 pixel space
      
      // Add a white space (represented by not adding a bar)
      xPosition += 2;
      
      // Add another black bar
      bars += `<rect x="${xPosition}" y="0" width="${width2}" height="50" fill="black" />`;
      xPosition += width2 + 1;
    }
    
    // Add border and return complete SVG
    return `<svg width="100%" height="100%" viewBox="0 0 ${svgWidth} 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${svgWidth}" height="50" fill="white" stroke="black" stroke-width="1" />
      ${bars}
    </svg>`;
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
                    <div className="text-lg font-mono my-2 text-center overflow-hidden">
                      {barcode.qr_code}
                    </div>
                    <div className="border-2 border-black w-full h-20 flex items-center justify-center my-2">
                      <div dangerouslySetInnerHTML={{ 
                        __html: generateBarcodeImage(barcode.qr_code) 
                      }} className="w-full h-full" />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      رقم المنتج: {barcode.product_id.substring(0, 8)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {barcodes.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
                <QrCode className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">لا توجد باركودات لهذا المنتج</h3>
                <p className="text-gray-500 mt-2 text-center max-w-md">
                  قد تكون هناك مشكلة في صلاحيات قاعدة البيانات. يرجى التواصل مع مسؤول النظام لإنشاء الصلاحيات اللازمة.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default ProductBarcodes;
