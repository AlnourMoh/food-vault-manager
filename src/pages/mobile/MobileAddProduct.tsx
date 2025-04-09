
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import BarcodeButton from '@/components/mobile/BarcodeButton';
import { useBarcodeScanner } from '@/hooks/useBarcodeScanner';
import RestaurantLayout from '@/components/layout/RestaurantLayout';

const MobileAddProduct = () => {
  const { toast } = useToast();
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const { startScan, stopScan, isScanning, scannedCode, setScannedCode } = useBarcodeScanner();
  
  const restaurantId = localStorage.getItem('restaurantId');

  // Categories and units (sample data)
  const categories = ['خضروات', 'فواكه', 'لحوم', 'بهارات', 'بقالة', 'أخرى'];
  const units = ['كيلوجرام', 'جرام', 'لتر', 'قطعة', 'علبة', 'كرتون'];

  // إيقاف المسح عند الخروج من الصفحة
  useEffect(() => {
    return () => {
      if (isScanning) {
        stopScan();
      }
    };
  }, [isScanning, stopScan]);

  useEffect(() => {
    // When a barcode is scanned, we can either:
    // 1. Populate a form field with the barcode
    // 2. Fetch product info from the database based on the barcode
    if (scannedCode) {
      console.log("تم مسح الباركود:", scannedCode);
      toast({
        title: "تم مسح الباركود بنجاح",
        description: `الرمز المقروء: ${scannedCode}`,
      });
      
      // Here you would typically fetch product data based on the barcode
      // For now, we'll just set a placeholder name
      setProductName(`منتج ${scannedCode.substring(0, 6)}`);
    }
  }, [scannedCode, toast]);

  const handleScanBarcode = async () => {
    console.log("بدء مسح الباركود");
    const code = await startScan();
    console.log("نتيجة المسح:", code);
    if (code) {
      setScannedCode(code);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !category || !quantity || !unit) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would save the product to the database
    console.log('Form submitted:', {
      productName,
      category,
      quantity,
      unit,
      barcode: scannedCode,
      restaurantId
    });
    
    // Show success message
    toast({
      title: "تم إضافة المنتج بنجاح",
      description: `تمت إضافة ${productName} إلى المخزون`,
    });
    
    // Reset form
    setProductName('');
    setCategory('');
    setQuantity('');
    setUnit('');
    setScannedCode(null);
  };

  return (
    <RestaurantLayout>
      <div className="rtl space-y-6 px-4">
        <h1 className="text-2xl font-bold tracking-tight">إضافة منتج جديد</h1>
        
        <Card className="mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">إدخال منتج جديد للمخزون</CardTitle>
            <CardDescription>قم بمسح الباركود وإدخال بيانات المنتج</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="add-product-form" onSubmit={handleSubmit} className="space-y-4">
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
              
              <div className="space-y-2">
                <Label htmlFor="productName">اسم المنتج</Label>
                <Input 
                  id="productName" 
                  placeholder="أدخل اسم المنتج" 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">التصنيف</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="اختر تصنيف المنتج" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">الكمية</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    min="1" 
                    placeholder="أدخل الكمية" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unit">الوحدة</Label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger id="unit">
                      <SelectValue placeholder="اختر الوحدة" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {units.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">إلغاء</Button>
            <Button 
              type="submit" 
              form="add-product-form" 
              className="bg-fvm-primary hover:bg-fvm-primary-light"
            >
              إضافة المنتج
            </Button>
          </CardFooter>
        </Card>
      </div>
    </RestaurantLayout>
  );
};

export default MobileAddProduct;
