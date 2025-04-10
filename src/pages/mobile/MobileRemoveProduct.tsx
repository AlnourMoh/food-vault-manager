
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import useDeviceDetection from '@/hooks/useDeviceDetection';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { db, mockFirestore } from '@/lib/firebase';

// Using destructuring to make the code cleaner
const { doc, getDoc, updateDoc, increment, Timestamp, collection, addDoc } = mockFirestore;

const MobileRemoveProduct = () => {
  const navigate = useNavigate();
  const { isMobile } = useDeviceDetection();
  const { toast } = useToast();
  const [barcode, setBarcode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  
  const restaurantId = localStorage.getItem('restaurantId');

  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(e.target.value);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleScanBarcode = async () => {
    if (!barcode) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال الباركود",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, this would connect to Firebase
      // This is a mock to simulate getting product data
      
      // Simulate product found
      if (barcode === '12345') {
        setProduct({
          name: 'منتج تجريبي',
          description: 'وصف للمنتج التجريبي',
          quantity: 10
        });
      } else {
        toast({
          title: "خطأ",
          description: "لم يتم العثور على المنتج",
          variant: "destructive",
        });
        setProduct(null);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء البحث عن المنتج",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveProduct = async () => {
    if (!product) return;
    
    if (product.quantity < quantity) {
      toast({
        title: "خطأ",
        description: "الكمية المطلوبة أكبر من الكمية المتوفرة",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // This is a simulated transaction
      // In a real implementation, this would update Firebase
      console.log("Removing product:", {
        productId: barcode,
        productName: product.name,
        quantity: quantity
      });
      
      toast({
        title: "تم بنجاح",
        description: `تم إخراج ${quantity} من ${product.name}`,
      });
      
      // إعادة تعيين الحقول
      setBarcode('');
      setQuantity(1);
      setProduct(null);
    } catch (error) {
      console.error("Error removing product:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إخراج المنتج",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RestaurantLayout hideSidebar={isMobile}>
      <div className="rtl space-y-6">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1" 
            onClick={() => navigate('/restaurant/mobile')}
          >
            <ArrowRight className="h-4 w-4" />
            <span>رجوع</span>
          </Button>
          <h1 className="text-xl font-bold tracking-tight flex-1 text-center">إخراج منتج</h1>
          <div className="w-20"></div> {/* للموازنة */}
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="barcode">الباركود</Label>
                <div className="flex gap-2">
                  <Input
                    id="barcode"
                    placeholder="أدخل الباركود"
                    value={barcode}
                    onChange={handleBarcodeChange}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleScanBarcode} 
                    disabled={isLoading || !barcode}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "بحث"}
                  </Button>
                </div>
              </div>
              
              {product && (
                <div className="space-y-4 pt-4">
                  <div className="grid gap-2">
                    <Label>اسم المنتج</Label>
                    <div className="rounded-md border p-2">{product.name}</div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>الكمية المتوفرة</Label>
                    <div className="rounded-md border p-2">{product.quantity}</div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">الكمية المراد إخراجها</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                    />
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleRemoveProduct}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    إخراج المنتج
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </RestaurantLayout>
  );
};

export default MobileRemoveProduct;
