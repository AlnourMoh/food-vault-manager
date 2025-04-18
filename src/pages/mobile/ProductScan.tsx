
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { QrCode, BarcodeScan, Info, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BarcodeScanner from '@/components/mobile/BarcodeScanner';

const ProductScan = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<any>(null);
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
      // First, get the product code details
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
      
      // Then, get the product details
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productCode.product_id)
        .single();
      
      if (productError) {
        throw productError;
      }
      
      setScannedProduct(product);
      
      // Log the scan in the database
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <BarcodeScan className="h-5 w-5" />
              <span>مسح باركود المنتج</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <QrCode className="h-16 w-16 text-primary" />
              </div>
              <p className="text-center text-muted-foreground max-w-md">
                قم بمسح باركود المنتج للتحقق من معلوماته مثل تاريخ الإنتاج وتاريخ انتهاء الصلاحية والكمية المتوفرة
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button 
                size="lg" 
                onClick={handleOpenScanner}
                className="gap-2"
                disabled={isLoading}
              >
                <BarcodeScan className="h-4 w-4" />
                {isLoading ? 'جاري البحث...' : 'مسح باركود'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span>معلومات المنتج</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scannedProduct.image_url && (
              <div className="flex justify-center mb-4">
                <img 
                  src={scannedProduct.image_url} 
                  alt={scannedProduct.name} 
                  className="h-40 w-40 object-contain rounded-md border"
                />
              </div>
            )}
            
            <h2 className="text-2xl font-bold text-center">{scannedProduct.name}</h2>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">الفئة</p>
                <p className="font-medium">{scannedProduct.category}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">الكمية المتوفرة</p>
                <p className="font-medium">{scannedProduct.quantity} {scannedProduct.unit || 'قطعة'}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">تاريخ الإنتاج</p>
                <p className="font-medium">{formatDate(scannedProduct.production_date)}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">تاريخ انتهاء الصلاحية</p>
                <p className="font-medium">{formatDate(scannedProduct.expiry_date)}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setScannedProduct(null)}>
                مسح منتج آخر
              </Button>
              <Button onClick={viewProductDetails} className="gap-2">
                <Info className="h-4 w-4" />
                تفاصيل أكثر
              </Button>
            </div>
          </CardContent>
        </Card>
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
