import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, PackageCheck, ChevronLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { differenceInDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import ProductTabs from '@/components/products/management/ProductTabs';
import SearchBar from '@/components/products/management/SearchBar';

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
        const formattedProducts: Product[] = data.map(product => ({
          id: product.id,
          name: product.name,
          category: product.category || '',
          unit: product.unit || '',
          quantity: product.quantity || 0,
          expiryDate: new Date(product.expiry_date),
          entryDate: new Date(product.created_at),
          restaurantId: product.company_id,
          restaurantName: '', // Will be filled if needed
          addedBy: '', // Default empty string since added_by doesn't exist
          status: (product.status as "active" | "expired" | "removed") || "active",
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
      
      <SearchBar 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ProductTabs
        products={products}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        getExpiryStatus={getExpiryStatus}
        getExpiredCount={getExpiredCount}
        getExpiringCount={getExpiringCount}
        filteredProducts={filteredProducts}
      />
    </div>
  );
};

export default ProductManagement;
