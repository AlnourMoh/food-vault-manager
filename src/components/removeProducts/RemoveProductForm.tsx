
import React from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
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
import ProductDetailsDisplay from './ProductDetailsDisplay';

interface RemoveProductFormProps {
  restaurants: any[];
  products: Product[];
  selectedRestaurant: string;
  selectedProduct: string;
  quantity: string;
  reason: string;
  filteredProducts: Product[];
  selectedProductDetails: Product | null;
  handleRestaurantChange: (value: string) => void;
  handleProductChange: (value: string) => void;
  setQuantity: (value: string) => void;
  setReason: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const RemoveProductForm: React.FC<RemoveProductFormProps> = ({
  restaurants,
  filteredProducts,
  selectedRestaurant,
  selectedProduct,
  quantity,
  reason,
  selectedProductDetails,
  handleRestaurantChange,
  handleProductChange,
  setQuantity,
  setReason,
  handleSubmit
}) => {
  return (
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
        
        <ProductDetailsDisplay selectedProductDetails={selectedProductDetails} />
        
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
      
      <div className="flex justify-between">
        <Button variant="outline">إلغاء</Button>
        <Button 
          type="submit" 
          className="bg-fvm-primary hover:bg-fvm-primary-light"
          disabled={!selectedProduct || !quantity}
        >
          إخراج المنتج
        </Button>
      </div>
    </form>
  );
};

export default RemoveProductForm;
