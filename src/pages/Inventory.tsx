
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Inventory = () => {
  const [activeProducts, setActiveProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      
      // Get restaurant ID from localStorage (assuming it's stored there)
      const restaurantId = localStorage.getItem('restaurantId');
      
      if (!restaurantId) {
        console.error('No restaurant ID found in localStorage');
        return;
      }
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('restaurantId', restaurantId)
        .eq('status', 'active');
      
      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "خطأ في جلب بيانات المنتجات",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      // Convert data to match our Product type
      const formattedProducts = data ? data.map((product: any): Product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        unit: product.unit,
        quantity: product.quantity,
        expiryDate: new Date(product.expiryDate),
        entryDate: new Date(product.entryDate || new Date()),
        restaurantId: product.restaurantId,
        restaurantName: product.restaurantName || "",
        addedBy: product.addedBy || "",
        status: product.status,
        imageUrl: product.imageUrl || ""
      })) : [];
      
      setActiveProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
    } catch (error: any) {
      console.error('Error in fetchProducts:', error);
      toast({
        title: "خطأ غير متوقع",
        description: "حدث خطأ أثناء محاولة جلب بيانات المنتجات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                  <TableHead className="text-right">صورة المنتج</TableHead>
                  <TableHead className="text-right">اسم المنتج</TableHead>
                  <TableHead className="text-right">التصنيف</TableHead>
                  <TableHead className="text-right">الكمية</TableHead>
                  <TableHead className="text-right">تاريخ الإدخال</TableHead>
                  <TableHead className="text-right">تاريخ انتهاء الصلاحية</TableHead>
                  <TableHead className="text-right">حالة المنتج</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      جاري تحميل البيانات...
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);
                    
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          {product.imageUrl ? (
                            <div className="h-12 w-12 rounded-md overflow-hidden">
                              <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-500">لا توجد صورة</span>
                            </div>
                          )}
                        </TableCell>
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
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <p className="text-lg">لا توجد منتجات في المخزون</p>
                        <p className="text-sm text-muted-foreground mb-4">قم بإضافة منتجات جديدة لتظهر هنا</p>
                        <Button 
                          onClick={handleAddProduct}
                          className="bg-fvm-primary hover:bg-fvm-primary-light flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          <span>إضافة منتج جديد</span>
                        </Button>
                      </div>
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
