
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import useDeviceDetection from '@/hooks/useDeviceDetection';
import { Button } from '@/components/ui/button';
import { ArrowRight, Camera, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { db, collection, addDoc, serverTimestamp, doc, getDoc } from '@/lib/firebase';
import { BarcodeScanner } from '@/components/barcode/BarcodeScanner';

const MobileAddProduct = () => {
  const navigate = useNavigate();
  const { isMobile } = useDeviceDetection();
  const { toast } = useToast();
  const restaurantId = localStorage.getItem('restaurantId');

  const [scanning, setScanning] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [productInfo, setProductInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (barcode) {
      fetchProductInfo(barcode);
    }
  }, [barcode]);

  const fetchProductInfo = async (code: string) => {
    setLoading(true);
    try {
      // Check if the product exists in the restaurant's inventory
      const productRef = doc(db, `restaurants/${restaurantId}/products`, code);
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        setProductInfo(productSnap.data());
      } else {
        toast({
          title: "المنتج غير موجود",
          description: "هذا المنتج غير مسجل في قاعدة البيانات",
          variant: "destructive"
        });
        setProductInfo(null);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "خطأ في النظام",
        description: "حدث خطأ أثناء البحث عن المنتج",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScanResult = (result: string) => {
    setBarcode(result);
    setScanning(false);
  };

  const handleAddProduct = async () => {
    if (!barcode || !productInfo) {
      toast({
        title: "بيانات غير مكتملة",
        description: "يرجى مسح الباركود أولاً",
        variant: "destructive"
      });
      return;
    }

    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      toast({
        title: "كمية غير صالحة",
        description: "يرجى إدخال كمية صالحة",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Add transaction record
      await addDoc(collection(db, `restaurants/${restaurantId}/transactions`), {
        productId: barcode,
        productName: productInfo.name,
        quantity: Number(quantity),
        type: 'add',
        timestamp: serverTimestamp(),
        userId: localStorage.getItem('userId') || 'unknown',
        userName: localStorage.getItem('userName') || 'مستخدم غير معروف'
      });
      
      toast({
        title: "تمت العملية بنجاح",
        description: `تم إضافة ${quantity} ${productInfo.name} إلى المخزون`,
        variant: "default",
      });

      // Reset form
      setBarcode('');
      setQuantity('1');
      setProductInfo(null);
      
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "خطأ في النظام",
        description: "حدث خطأ أثناء إضافة المنتج",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
          <h1 className="text-xl font-bold tracking-tight flex-1 text-center">إدخال منتج</h1>
          <div className="w-20"></div> {/* للموازنة */}
        </div>
        
        {scanning ? (
          <div className="flex flex-col items-center">
            <BarcodeScanner onScan={handleScanResult} />
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => setScanning(false)}
            >
              <X className="mr-2 h-4 w-4" />
              إلغاء المسح
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="barcode">رمز الباركود</Label>
                    <div className="flex gap-2">
                      <Input
                        id="barcode"
                        placeholder="مسح أو إدخال الباركود"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setScanning(true)}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {productInfo && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <h3 className="font-medium">معلومات المنتج:</h3>
                        <p className="text-sm">الاسم: {productInfo.name}</p>
                        <p className="text-sm">الوصف: {productInfo.description || 'غير متوفر'}</p>
                        <p className="text-sm">
                          تاريخ الانتهاء: {productInfo.expiryDate ? 
                            format(new Date(productInfo.expiryDate.toDate()), 'PPP', { locale: ar }) : 
                            'غير محدد'
                          }
                        </p>
                      </div>
                      <Separator />
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="quantity">الكمية</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {productInfo && (
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleAddProduct}
                disabled={loading}
              >
                <Check className="mr-2 h-4 w-4" />
                تأكيد إدخال المنتج
              </Button>
            )}

            {!barcode && (
              <div className="text-center p-4">
                <p className="text-muted-foreground">قم بمسح الباركود لإدخال منتج للمخزون</p>
              </div>
            )}
          </div>
        )}
      </div>
    </RestaurantLayout>
  );
};

export default MobileAddProduct;
