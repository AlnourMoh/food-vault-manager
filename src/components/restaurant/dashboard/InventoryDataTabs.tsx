
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, List, ArrowDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit?: string;
  created_at: string;
}

const InventoryDataTabs: React.FC = () => {
  const [activeDataTab, setActiveDataTab] = useState('products');
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const restaurantId = localStorage.getItem('restaurantId');
  
  useEffect(() => {
    if (restaurantId) {
      fetchRecentProducts();
    }
  }, [restaurantId]);
  
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
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-row justify-between items-center">
          <CardTitle className="text-lg">بيانات المخزون</CardTitle>
          <TabsList className="h-9">
            <TabsTrigger 
              value="products" 
              onClick={() => setActiveDataTab('products')}
              className={activeDataTab === 'products' ? "bg-background text-foreground" : ""}
            >
              <LayoutDashboard className="h-4 w-4 ml-2" />
              آخر المنتجات المضافة
            </TabsTrigger>
            <TabsTrigger 
              value="movements" 
              onClick={() => setActiveDataTab('movements')}
              className={activeDataTab === 'movements' ? "bg-background text-foreground" : ""}
            >
              <List className="h-4 w-4 ml-2" />
              آخر الحركات
            </TabsTrigger>
          </TabsList>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {activeDataTab === 'products' ? (
          loading ? (
            <div className="flex justify-center items-center p-6">
              <div className="animate-spin h-6 w-6 border-2 border-gray-500 rounded-full border-t-transparent"></div>
            </div>
          ) : recentProducts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المنتج</TableHead>
                  <TableHead className="text-right">الفئة</TableHead>
                  <TableHead className="text-right">الكمية</TableHead>
                  <TableHead className="text-right">تاريخ الإضافة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        <ArrowDown className="h-3 w-3 ml-1" />
                        {product.quantity} {product.unit || 'قطعة'}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(product.created_at).toLocaleDateString('ar-SA')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">لا توجد منتجات مضافة حديثًا</p>
            </div>
          )
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">سيتم عرض آخر حركات المخزون قريبًا...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryDataTabs;
