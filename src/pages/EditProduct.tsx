
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useEditProductForm } from '@/hooks/products/useEditProductForm';
import EditProductForm from '@/components/products/EditProductForm';
import { FormData } from '@/components/products/types';

// Define a type for the raw product data from Supabase
interface RawProductData {
  id: string;
  name: string;
  category: string;
  quantity: number;
  expiry_date: string;
  production_date: string;
  company_id: string;
  status: string;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
  unit?: string;
}

const EditProduct = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState<RawProductData | null>(null);
  
  const isRestaurantRoute = window.location.pathname.startsWith('/restaurant/');
  const Layout = isRestaurantRoute ? RestaurantLayout : MainLayout;
  const inventoryPath = isRestaurantRoute ? '/restaurant/inventory' : '/inventory';

  // Initialize the form hook with productId and navigation callback
  const {
    formData,
    setFormData,
    errors,
    isSubmitting,
    categories,
    setCategories,
    units,
    setUnits,
    handleInputChange,
    handleSelectChange,
    handleImageChange,
    handleSubmit: submitForm
  } = useEditProductForm(productId, () => navigate(inventoryPath));

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (!data) {
          throw new Error('المنتج غير موجود');
        }
        
        setProductData(data as RawProductData);
        
        // Format dates for input fields
        const expiryDate = new Date(data.expiry_date);
        const productionDate = data.production_date ? new Date(data.production_date) : new Date();
        
        setFormData({
          name: data.name,
          category: data.category,
          quantity: data.quantity.toString(),
          expiryDate: expiryDate.toISOString().split('T')[0],
          productionDate: productionDate.toISOString().split('T')[0],
          unit: (data as any).unit || 'piece',
          image: null,
          imageUrl: data.image_url || ''
        });
      } catch (error: any) {
        console.error('Error fetching product:', error);
        toast({
          title: "خطأ في تحميل بيانات المنتج",
          description: error.message || "حدث خطأ أثناء محاولة تحميل بيانات المنتج",
          variant: "destructive",
        });
        // Navigate back to inventory
        navigate(inventoryPath);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [productId, toast, navigate, inventoryPath, setFormData]);
  
  const handleCancel = () => {
    navigate(inventoryPath);
  };

  return (
    <Layout>
      <div className="rtl container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">تعديل المنتج</h1>
        
        {isLoading && !productData ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mr-2">جاري تحميل بيانات المنتج...</span>
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <EditProductForm
                formData={formData}
                errors={errors}
                isSubmitting={isSubmitting}
                categories={categories}
                setCategories={setCategories}
                units={units}
                setUnits={setUnits}
                handleInputChange={handleInputChange}
                handleSelectChange={handleSelectChange}
                handleImageChange={handleImageChange}
                handleSubmit={submitForm}
                handleCancel={handleCancel}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default EditProduct;
