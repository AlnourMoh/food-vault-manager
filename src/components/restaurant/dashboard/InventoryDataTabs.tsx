
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, List, ArrowDown, ArrowUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Avatar } from '@/components/ui/avatar';

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit?: string;
  created_at: string;
  image_url?: string;
}

interface Movement {
  id: string;
  product_id: string;
  product_name: string;
  scan_type: 'in' | 'out' | 'check';
  created_at: string;
  scanned_by: string;
}

const InventoryDataTabs: React.FC = () => {
  const [activeDataTab, setActiveDataTab] = useState('products');
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentMovements, setRecentMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const restaurantId = localStorage.getItem('restaurantId');
  
  useEffect(() => {
    if (restaurantId) {
      if (activeDataTab === 'products') {
        fetchRecentProducts();
      } else {
        fetchRecentMovements();
      }
    }
  }, [restaurantId, activeDataTab]);
  
  const fetchRecentProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('company_id', restaurantId)
        .eq('status', 'active')
        .gt('quantity', 0)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        throw error;
      }

      setRecentProducts(data || []);
    } catch (error) {
      console.error('Error fetching recent products:', error);
      toast({
        title: "خطأ في جلب المنتجات",
        description: "حدث خطأ أثناء محاولة جلب المنتجات المضافة حديثًا",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchRecentMovements = async () => {
    setLoading(true);
    try {
      const { data: scans, error: scansError } = await supabase
        .from('product_scans')
        .select(`
          id,
          scan_type,
          created_at,
          product_id,
          scanned_by
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (scansError) throw scansError;
      
      // Get product details for each scan
      if (scans && scans.length > 0) {
        const productIds = scans.map(scan => scan.product_id);
        
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('id, name')
          .in('id', productIds);
          
        if (productsError) throw productsError;
        
        // Map product names to scans
        const movementsWithDetails = scans.map(scan => {
          const product = products?.find(p => p.id === scan.product_id);
          return {
            ...scan,
            product_name: product?.name || 'منتج غير معروف'
          };
        });
        
        setRecentMovements(movementsWithDetails);
      } else {
        setRecentMovements([]);
      }
    } catch (error) {
      console.error('Error fetching movement history:', error);
      toast({
        title: "خطأ في جلب حركات المخزون",
        description: "حدث خطأ أثناء محاولة جلب حركات المخزون الأخيرة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (tab: string) => {
    setActiveDataTab(tab);
  };

  // Format date to Gregorian format
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };
  
  // Get product initials for avatar fallback
  const getProductInitials = (productName: string): string => {
    return productName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-row justify-between items-center">
          <CardTitle className="text-lg">بيانات المخزون</CardTitle>
          <TabsList className="h-9">
            <TabsTrigger 
              value="products" 
              onClick={() => handleTabChange('products')}
              className={activeDataTab === 'products' ? "bg-background text-foreground" : ""}
            >
              <LayoutDashboard className="h-4 w-4 ml-2" />
              آخر المنتجات المضافة
            </TabsTrigger>
            <TabsTrigger 
              value="movements" 
              onClick={() => handleTabChange('movements')}
              className={activeDataTab === 'movements' ? "bg-background text-foreground" : ""}
            >
              <List className="h-4 w-4 ml-2" />
              آخر الحركات
            </TabsTrigger>
          </TabsList>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-4">
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/5" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {activeDataTab === 'products' ? (
              recentProducts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">المنتج</TableHead>
                      <TableHead className="text-right">الصورة</TableHead>
                      <TableHead className="text-right">الفئة</TableHead>
                      <TableHead className="text-right">الكمية</TableHead>
                      <TableHead className="text-right">تاريخ الإضافة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentProducts.map((product) => (
                      <TableRow key={product.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <Avatar className="h-10 w-10">
                            {product.image_url ? (
                              <img 
                                src={product.image_url} 
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-primary text-white flex items-center justify-center">
                                {getProductInitials(product.name)}
                              </div>
                            )}
                          </Avatar>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            <ArrowDown className="h-3 w-3 ml-1" />
                            {product.quantity} {product.unit || 'قطعة'}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(product.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">لا توجد منتجات مضافة حديثًا</p>
                </div>
              )
            ) : recentMovements.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">المنتج</TableHead>
                    <TableHead className="text-right">نوع الحركة</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentMovements.map((movement) => (
                    <TableRow key={movement.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{movement.product_name}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          movement.scan_type === 'in' 
                            ? 'bg-green-100 text-green-800' 
                            : movement.scan_type === 'out'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {movement.scan_type === 'in' ? (
                            <>
                              <ArrowDown className="h-3 w-3 ml-1" />
                              دخول
                            </>
                          ) : movement.scan_type === 'out' ? (
                            <>
                              <ArrowUp className="h-3 w-3 ml-1" />
                              خروج
                            </>
                          ) : (
                            'فحص'
                          )}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(movement.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">لا توجد حركات مخزون حديثة</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryDataTabs;
