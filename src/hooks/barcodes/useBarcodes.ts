
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { generateBarcodesFromProduct, generateBarcodeImage } from '@/utils/barcodeUtils';

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
  const printFrameRef = useRef<HTMLIFrameElement | null>(null);

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

  // وظيفة لطباعة جميع الباركودات
  const handlePrint = () => {
    window.print();
  };

  // وظيفة لطباعة باركود محدد
  const handlePrintSingle = (barcodeId: string) => {
    // البحث عن الباركود المحدد
    const barcodeToPrint = barcodes.find(b => b.id === barcodeId);
    if (!barcodeToPrint) return;

    // إنشاء نافذة طباعة جديدة
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "خطأ في الطباعة",
        description: "فشلت عملية فتح نافذة الطباعة. الرجاء التأكد من السماح بالنوافذ المنبثقة.",
        variant: "destructive",
      });
      return;
    }

    // إنشاء محتوى HTML للطباعة
    const barcodeHtml = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <title>طباعة الباركود - ${product?.name}</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            background-color: white;
            font-family: Arial, sans-serif;
          }
          .barcode-container {
            width: 100%;
            max-width: 300px;
            margin: 0 auto;
            padding: 15px;
            border: 1px solid black;
            background-color: white;
            box-sizing: border-box;
          }
          .product-name {
            text-align: center;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #ccc;
          }
          .barcode-number {
            text-align: center;
            font-family: monospace;
            font-size: 16px;
            margin: 10px 0;
          }
          .barcode-image {
            border: 2px solid black;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 10px 0;
          }
          .product-id {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 10px;
          }
          @media print {
            @page {
              size: 80mm 50mm;
              margin: 0;
            }
            .barcode-container {
              border: none;
              width: 100%;
              height: 100%;
              padding: 5mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="barcode-container">
          <div class="product-name">${product?.name || 'منتج غير معروف'}</div>
          <div class="barcode-number">${barcodeToPrint.qr_code}</div>
          <div class="barcode-image">
            ${generateBarcodeImage(barcodeToPrint.qr_code)}
          </div>
          <div class="product-id">رقم المنتج: ${barcodeToPrint.product_id.substring(0, 8)}</div>
        </div>
        <script>
          // طباعة الصفحة تلقائياً بعد التحميل
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    // كتابة المحتوى في النافذة الجديدة
    printWindow.document.write(barcodeHtml);
    printWindow.document.close();
  };

  return {
    barcodes,
    product,
    isLoading,
    handlePrint,
    handlePrintSingle
  };
};
