
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import BarcodeButton from '@/components/mobile/BarcodeButton';
import { useBarcodeScanner } from '@/hooks/useBarcodeScanner';
import RestaurantLayout from '@/components/layout/RestaurantLayout';

const MobileRemoveProduct = () => {
  const { toast } = useToast();
  const [reason, setReason] = useState('');
  const { startScan, isScanning, scannedCode, setScannedCode } = useBarcodeScanner();
  const [productDetails, setProductDetails] = useState<any | null>(null);
  
  const handleScanBarcode = async () => {
    const code = await startScan();
    if (code) {
      setScannedCode(code);
      
      // Mock fetching product details - in a real app we would query the database
      // using the barcode to get product details
      setProductDetails({
        id: `prod-${Math.floor(Math.random() * 1000)}`,
        name: `منتج ${code.substring(0, 6)}`,
        category: 'خضروات',
        quantity: 5,
        unit: 'كيلوجرام',
        expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days from now
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!scannedCode || !productDetails) {
      toast({
        title: "خطأ في البيانات",
        description: "يجب مسح باركود المنتج أولاً",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would update the database to remove the product
    console.log('Removing product:', {
      productId: productDetails.id,
      barcode: scannedCode,
      reason
    });
    
    // Show success message
    toast({
      title: "تم إخراج المنتج بنجاح",
      description: `تم إخراج ${productDetails.name} من المخزون`,
    });
    
    // Reset form
    setReason('');
    setScannedCode(null);
    setProductDetails(null);
  };

  return (
    <RestaurantLayout>
      <div className="rtl space-y-6 px-4">
        <h1 className="text-2xl font-bold tracking-tight">إخراج منتج</h1>
        
        <Card className="mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">إخراج منتج من المخزون</CardTitle>
            <CardDescription>قم بمسح الباركود لإخراج المنتج</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="remove-product-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <BarcodeButton 
                  onClick={handleScanBarcode}
                  buttonText={scannedCode ? "إعادة مسح الباركود" : "مسح باركود المنتج"}
                  className="w-full"
                />
                
                {scannedCode && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md text-center">
                    <span className="text-green-800 text-sm">تم مسح الباركود: {scannedCode}</span>
                  </div>
                )}
              </div>
              
              {productDetails && (
                <div className="p-4 bg-secondary rounded-md">
                  <h3 className="font-medium mb-2">تفاصيل المنتج:</h3>
                  <p>اسم المنتج: {productDetails.name}</p>
                  <p>التصنيف: {productDetails.category}</p>
                  <p>الكمية: {productDetails.quantity} {productDetails.unit}</p>
                  <p>تاريخ انتهاء الصلاحية: {productDetails.expiryDate.toLocaleDateString('ar-SA')}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="reason">سبب الإخراج</Label>
                <Textarea 
                  id="reason" 
                  placeholder="أدخل سبب إخراج المنتج من المخزون" 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3} 
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">إلغاء</Button>
            <Button 
              type="submit" 
              form="remove-product-form" 
              className="bg-fvm-primary hover:bg-fvm-primary-light"
              disabled={!scannedCode || !productDetails}
            >
              إخراج المنتج
            </Button>
          </CardFooter>
        </Card>
      </div>
    </RestaurantLayout>
  );
};

export default MobileRemoveProduct;
