
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { getMockData } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Product } from '@/types';

const Inventory = () => {
  const { products, restaurants } = getMockData();
  const [activeProducts] = useState<Product[]>(products.filter(p => p.status === 'active'));
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(activeProducts);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleRestaurantChange = (value: string) => {
    setSelectedRestaurant(value);
    filterProducts(value, searchTerm);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterProducts(selectedRestaurant, value);
  };

  const filterProducts = (restaurantId: string, search: string) => {
    let filtered = activeProducts;
    
    if (restaurantId) {
      filtered = filtered.filter(p => p.restaurantId === restaurantId);
    }
    
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(lowerSearch) || 
        p.category.toLowerCase().includes(lowerSearch)
      );
    }
    
    setFilteredProducts(filtered);
  };

  const getDaysUntilExpiry = (expiryDate: Date) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <MainLayout>
      <div className="rtl space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">المخزون</h1>
        
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3">
            <Select 
              value={selectedRestaurant} 
              onValueChange={handleRestaurantChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="جميع المطاعم" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="all">جميع المطاعم</SelectItem>
                {restaurants.map((restaurant) => (
                  <SelectItem key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-2/3">
            <Input 
              placeholder="بحث عن منتج..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">قائمة المنتجات في المخزون</CardTitle>
            <CardDescription>عرض لجميع المنتجات المتوفرة حالياً في المخزون</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">اسم المنتج</TableHead>
                  <TableHead className="text-right">التصنيف</TableHead>
                  <TableHead className="text-right">المطعم</TableHead>
                  <TableHead className="text-right">الكمية</TableHead>
                  <TableHead className="text-right">تاريخ الإدخال</TableHead>
                  <TableHead className="text-right">تاريخ انتهاء الصلاحية</TableHead>
                  <TableHead className="text-right">حالة المنتج</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);
                    
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.restaurantName}</TableCell>
                        <TableCell>{product.quantity} {product.unit}</TableCell>
                        <TableCell>
                          {new Date(product.entryDate).toLocaleDateString('ar-SA')}
                        </TableCell>
                        <TableCell>
                          {new Date(product.expiryDate).toLocaleDateString('ar-SA')}
                        </TableCell>
                        <TableCell>
                          {daysUntilExpiry <= 0 ? (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                              منتهي الصلاحية
                            </span>
                          ) : daysUntilExpiry <= 30 ? (
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                              ينتهي قريباً ({daysUntilExpiry} يوم)
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              صالح ({daysUntilExpiry} يوم)
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      لا توجد منتجات متطابقة مع معايير البحث
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Inventory;
