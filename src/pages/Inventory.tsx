
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { getMockData } from '@/services/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import { Product } from '@/types';

const Inventory = () => {
  const { products } = getMockData();
  const [activeProducts] = useState<Product[]>(products.filter(p => p.status === 'active'));
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(activeProducts);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterProducts(value);
  };

  const filterProducts = (search: string) => {
    let filtered = activeProducts;
    
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

  const handleAddProduct = () => {
    // توجيه المستخدم إلى صفحة إضافة المنتجات
    const isRestaurantRoute = window.location.pathname.startsWith('/restaurant/');
    const addProductPath = isRestaurantRoute ? '/restaurant/products/add' : '/products/add';
    navigate(addProductPath);
  };

  // Check current route and use appropriate layout
  const isRestaurantRoute = window.location.pathname.startsWith('/restaurant/');
  const Layout = isRestaurantRoute ? RestaurantLayout : MainLayout;

  return (
    <Layout>
      <div className="rtl space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">المخزون</h1>
          
          <Button 
            onClick={handleAddProduct}
            className="bg-fvm-primary hover:bg-fvm-primary-light flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة منتج</span>
          </Button>
        </div>
        
        <div className="w-full">
          <Input 
            placeholder="بحث عن منتج..." 
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full"
          />
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
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      لا توجد منتجات متطابقة مع معايير البحث
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Inventory;
