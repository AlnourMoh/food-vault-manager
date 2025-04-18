
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { getMockData } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';

const RemoveProducts = () => {
  const { restaurants, products } = getMockData();
  const { toast } = useToast();
  
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

  const handleRestaurantChange = (value: string) => {
    setSelectedRestaurant(value);
    const filtered = products.filter(
      p => p.restaurantId === value && p.status === 'active'
    );
    setFilteredProducts(filtered);
    setSelectedProduct('');
    setSelectedProductDetails(null);
  };

  const handleProductChange = (value: string) => {
    setSelectedProduct(value);
    const productDetails = products.find(p => p.id === value) || null;
    setSelectedProductDetails(productDetails);
    
    // Reset quantity
    setQuantity('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !quantity || Number(quantity) <= 0) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى التأكد من اختيار المنتج وإدخال كمية صحيحة",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedProductDetails && Number(quantity) > selectedProductDetails.quantity) {
      toast({
        title: "كمية غير صالحة",
        description: "الكمية المدخلة أكبر من الكمية المتوفرة في المخزون",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Form submitted:', {
      restaurantId: selectedRestaurant,
      productId: selectedProduct,
      quantity,
      reason
    });
    
    // Show success message
    toast({
      title: "تم إخراج المنتج بنجاح",
      description: `تم إخراج ${quantity} وحدة من ${selectedProductDetails?.name}`,
    });
    
    // Reset form
    setSelectedProduct('');
    setQuantity('');
    setReason('');
    setSelectedProductDetails(null);
  };

  return (
    <MainLayout>
      <div className="rtl space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">إخراج المنتجات</h1>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">إخراج منتج من المخزون</CardTitle>
            <CardDescription>اختر المنتج والكمية لإخراجها من المخزون</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="remove-product-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="restaurant">المطعم</Label>
                  <Select 
                    value={selectedRestaurant} 
                    onValueChange={handleRestaurantChange}
                  >
                    <SelectTrigger id="restaurant">
                      <SelectValue placeholder="اختر المطعم" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {restaurants.map((restaurant) => (
                        <SelectItem key={restaurant.id} value={restaurant.id}>
                          {restaurant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="product">المنتج</Label>
                  <Select 
                    value={selectedProduct} 
                    onValueChange={handleProductChange}
                    disabled={!selectedRestaurant}
                  >
                    <SelectTrigger id="product">
                      <SelectValue placeholder="اختر المنتج" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {filteredProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - {product.quantity} {product.unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedProductDetails && (
                  <div className="p-4 bg-secondary rounded-md">
                    <h3 className="font-medium mb-2">تفاصيل المنتج:</h3>
                    <p>اسم المنتج: {selectedProductDetails.name}</p>
                    <p>التصنيف: {selectedProductDetails.category}</p>
                    <p>الكمية المتاحة: {selectedProductDetails.quantity} {selectedProductDetails.unit}</p>
                    <p>تاريخ انتهاء الصلاحية: {new Date(selectedProductDetails.expiryDate).toLocaleDateString('ar-SA')}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">الكمية</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    min="1" 
                    max={selectedProductDetails?.quantity.toString()} 
                    placeholder="أدخل الكمية" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    disabled={!selectedProduct}
                    required 
                  />
                </div>
                
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
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">إلغاء</Button>
            <Button 
              type="submit" 
              form="remove-product-form" 
              className="bg-fvm-primary hover:bg-fvm-primary-light"
              disabled={!selectedProduct || !quantity}
            >
              إخراج المنتج
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default RemoveProducts;
