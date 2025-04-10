
import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product, Movement, PaginationState, SortState } from './types';

export const useInventoryData = (activeDataTab: string) => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentMovements, setRecentMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Store all fetched products
  const [allMovements, setAllMovements] = useState<Movement[]>([]); // Store all fetched movements
  const { toast } = useToast();
  
  // Pagination state
  const [productsPagination, setProductsPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 0
  });
  
  const [movementsPagination, setMovementsPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 0
  });
  
  // Sorting state
  const [productsSort, setProductsSort] = useState<SortState>({
    column: 'created_at',
    direction: 'desc'
  });
  
  const [movementsSort, setMovementsSort] = useState<SortState>({
    column: 'created_at',
    direction: 'desc'
  });
  
  // Get restaurantId only once per component instance
  const restaurantId = useMemo(() => localStorage.getItem('restaurantId'), []);
  
  // Memoize the fetch functions to prevent recreating them on each render
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      if (!restaurantId) {
        throw new Error('Restaurant ID not found');
      }
      
      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('company_id', restaurantId)
        .eq('status', 'active')
        .gt('quantity', 0)
        .order(productsSort.column, { ascending: productsSort.direction === 'asc' });

      if (error) {
        throw error;
      }

      setAllProducts(data || []);
      setProductsPagination(prev => ({
        ...prev,
        totalItems: count || 0
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "خطأ في جلب المنتجات",
        description: "حدث خطأ أثناء محاولة جلب المنتجات المضافة حديثًا",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [restaurantId, toast, productsSort]);
  
  const fetchMovements = useCallback(async () => {
    setLoading(true);
    try {
      if (!restaurantId) {
        throw new Error('Restaurant ID not found');
      }
      
      const { data: scans, error: scansError, count } = await supabase
        .from('product_scans')
        .select(`
          id,
          scan_type,
          created_at,
          product_id,
          scanned_by
        `, { count: 'exact' })
        .order(movementsSort.column, { ascending: movementsSort.direction === 'asc' });
      
      if (scansError) throw scansError;
      
      setMovementsPagination(prev => ({
        ...prev,
        totalItems: count || 0
      }));
      
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
        
        setAllMovements(movementsWithDetails);
      } else {
        setAllMovements([]);
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
  }, [restaurantId, toast, movementsSort]);
  
  // Apply pagination to products data
  const paginatedProducts = useMemo(() => {
    const { currentPage, itemsPerPage } = productsPagination;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [allProducts, productsPagination]);
  
  // Apply pagination to movements data
  const paginatedMovements = useMemo(() => {
    const { currentPage, itemsPerPage } = movementsPagination;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allMovements.slice(startIndex, startIndex + itemsPerPage);
  }, [allMovements, movementsPagination]);
  
  // Use useEffect with memoized dependencies to prevent unnecessary data fetching
  useEffect(() => {
    if (restaurantId) {
      if (activeDataTab === 'products') {
        fetchProducts();
      } else {
        fetchMovements();
      }
    }
  }, [restaurantId, activeDataTab, fetchProducts, fetchMovements]);
  
  // Callbacks for handling pagination changes
  const handleProductPageChange = useCallback((page: number) => {
    setProductsPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  }, []);
  
  const handleMovementPageChange = useCallback((page: number) => {
    setMovementsPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  }, []);
  
  // Callbacks for handling sort changes
  const handleProductsSort = useCallback((column: string) => {
    setProductsSort(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  }, []);
  
  const handleMovementsSort = useCallback((column: string) => {
    setMovementsSort(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  }, []);

  return {
    recentProducts: paginatedProducts,
    recentMovements: paginatedMovements,
    productsPagination,
    movementsPagination,
    productsSort,
    movementsSort,
    loading,
    handleProductPageChange,
    handleMovementPageChange,
    handleProductsSort,
    handleMovementsSort
  };
};
