
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  AlertTriangle, 
  Archive,
  PackageCheck,
  ChevronLeft
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { format, differenceInDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const restaurantId = localStorage.getItem('restaurantId');
    
    if (!restaurantId) {
      toast({
        title: "خطأ",
        description: "لم يتم العثور على معرف المطعم",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('company_id', restaurantId);
        
      if (error) throw error;
      
      if (data) {
        const formattedProducts = data.map(product => ({
          ...product,
          id: product.id,
          name: product.name,
          category: product.category || '',
          unit: product.unit || '',
          quantity: product.quantity || 0,
          expiryDate: new Date(product.expiry_date),
          entryDate: new Date(product.created_at),
          restaurantId: product.company_id,
          restaurantName: '', // Will be filled if needed
          addedBy: product.added_by || '',
          status: product.status || 'active',
          imageUrl: product.image_url
        }));
        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "خطأ في جلب البيانات",
        description: "حدث خطأ أثناء جلب المنتجات",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    filterProducts();
  }, [searchTerm, activeTab, products]);

  const filterProducts = () => {
    let filtered = [...products];
    
    // Filter by tab type
    if (activeTab === 'expiring') {
      filtered = filtered.filter(product => {
        const daysUntilExpiry = differenceInDays(new Date(product.expiryDate), new Date());
        return daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
      });
    } else if (activeTab === 'expired') {
      filtered = filtered.filter(product => {
        const daysUntilExpiry = differenceInDays(new Date(product.expiryDate), new Date());
        return daysUntilExpiry < 0;
      });
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.category.toLowerCase().includes(term)
      );
    }
    
    setFilteredProducts(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getExpiryStatus = (expiryDate: Date) => {
    const today = new Date();
    const daysUntilExpiry = differenceInDays(expiryDate, today);
    
    if (daysUntilExpiry < 0) {
      return {
        label: `منتهي منذ ${Math.abs(daysUntilExpiry)} يوم`,
        variant: "destructive" as const,
        icon: <AlertTriangle className="h-3 w-3 ml-1" />
      };
    } else if (daysUntilExpiry <= 7) {
      return {
        label: `ينتهي خلال ${daysUntilExpiry} أيام`,
        variant: "destructive" as const,
        icon: <AlertTriangle className="h-3 w-3 ml-1" />
      };
    } else if (daysUntilExpiry <= 30) {
      return {
        label: `ينتهي خلال ${daysUntilExpiry} يوم`,
        variant: "warning" as const,
        icon: <AlertTriangle className="h-3 w-3 ml-1" />
      };
    } else {
      return {
        label: `صالح لمدة ${daysUntilExpiry} يوم`,
        variant: "default" as const,
        icon: <PackageCheck className="h-3 w-3 ml-1" />
      };
    }
  };

  const getExpiredCount = () => {
    return products.filter(product => {
      const daysUntilExpiry = differenceInDays(new Date(product.expiryDate), new Date());
      return daysUntilExpiry < 0;
    }).length;
  };

  const getExpiringCount = () => {
    return products.filter(product => {
      const daysUntilExpiry = differenceInDays(new Date(product.expiryDate), new Date());
      return daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
    }).length;
  };

  return (
    <div className="container py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">تتبع وإدارة المنتجات</h1>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pr-9"
          placeholder="بحث عن منتج..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">الكل ({products.length})</TabsTrigger>
          <TabsTrigger value="expiring">
            قاربت على الانتهاء ({getExpiringCount()})
          </TabsTrigger>
          <TabsTrigger value="expired">
            منتهية ({getExpiredCount()})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4 space-y-4">
          {renderProductsList(filteredProducts, getExpiryStatus)}
        </TabsContent>
        
        <TabsContent value="expiring" className="mt-4 space-y-4">
          {renderProductsList(filteredProducts, getExpiryStatus)}
        </TabsContent>
        
        <TabsContent value="expired" className="mt-4 space-y-4">
          {renderProductsList(filteredProducts, getExpiryStatus)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to render the products list
const renderProductsList = (
  products: Product[],
  getExpiryStatus: (expiryDate: Date) => { 
    label: string; 
    variant: "default" | "destructive" | "warning";
    icon: JSX.Element;
  }
) => {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Archive className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground">لا توجد منتجات متطابقة مع معايير البحث</p>
        </CardContent>
      </Card>
    );
  }

  return products.map(product => {
    const expiryStatus = getExpiryStatus(new Date(product.expiryDate));
    
    return (
      <Card key={product.id} className="overflow-hidden">
        <CardContent className="p-3">
          <div className="flex gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <Archive className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-base truncate">{product.name}</h3>
                <Badge variant={expiryStatus.variant} className="flex items-center mr-1">
                  {expiryStatus.icon}
                  <span>{expiryStatus.label}</span>
                </Badge>
              </div>
              
              <div className="mt-1 space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">الكمية:</span>
                  <span>{product.quantity} {product.unit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">التصنيف:</span>
                  <span>{product.category || "غير مصنف"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">تاريخ الانتهاء:</span>
                  <span className={differenceInDays(new Date(product.expiryDate), new Date()) < 0 ? "text-destructive" : ""}>
                    {format(new Date(product.expiryDate), 'dd/MM/yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  });
};

export default ProductManagement;
