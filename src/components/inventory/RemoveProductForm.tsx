
import React from 'react';
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
import ProductDetails from '@/components/inventory/ProductDetails';
import { useRemoveProductForm } from '@/hooks/inventory/useRemoveProductForm';

const RemoveProductForm: React.FC = () => {
  const {
    restaurants,
    selectedRestaurant,
    selectedProduct,
    quantity,
    setQuantity,
    reason,
    setReason,
    filteredProducts,
    selectedProductDetails,
    handleRestaurantChange,
    handleProductChange,
    handleSubmit
  } = useRemoveProductForm();

  return (
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
              <ProductDetails product={selectedProductDetails} />
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
  );
};

export default RemoveProductForm;
