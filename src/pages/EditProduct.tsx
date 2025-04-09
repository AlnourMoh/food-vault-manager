
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const EditProduct = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    expiryDate: '',
    productionDate: ''
  });
  
  const isRestaurantRoute = window.location.pathname.startsWith('/restaurant/');
  const Layout = isRestaurantRoute ? RestaurantLayout : MainLayout;
  const inventoryPath = isRestaurantRoute ? '/restaurant/inventory' : '/inventory';

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
        
        setProductData(data);
        
        // Format dates for input fields
        const expiryDate = new Date(data.expiry_date);
        const productionDate = new Date(data.production_date);
        
        setFormData({
          name: data.name,
          category: data.category,
          quantity: data.quantity,
          expiryDate: expiryDate.toISOString().split('T')[0],
          productionDate: productionDate.toISOString().split('T')[0]
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
  }, [productId, toast, navigate, inventoryPath]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Format dates for database
      const expiryDate = new Date(formData.expiryDate);
      const productionDate = new Date(formData.productionDate);
      
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          category: formData.category,
          quantity: formData.quantity,
          expiry_date: expiryDate.toISOString(),
          production_date: productionDate.toISOString()
        })
        .eq('id', productId);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "تم تحديث المنتج",
        description: "تم تحديث بيانات المنتج بنجاح",
      });
      
      // Navigate back to inventory
      navigate(inventoryPath);
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: "خطأ في تحديث المنتج",
        description: error.message || "حدث خطأ أثناء محاولة تحديث بيانات المنتج",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  اسم المنتج
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  التصنيف
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                >
                  <option value="">اختر التصنيف</option>
                  <option value="خضروات">خضروات</option>
                  <option value="لحوم">لحوم</option>
                  <option value="بهارات">بهارات</option>
                  <option value="بقالة">بقالة</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  الكمية
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label htmlFor="productionDate" className="block text-sm font-medium text-gray-700 mb-1">
                  تاريخ الإنتاج
                </label>
                <input
                  type="date"
                  id="productionDate"
                  name="productionDate"
                  value={formData.productionDate}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  تاريخ الانتهاء
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div className="flex justify-end space-x-4 space-x-reverse pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  إلغاء
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري الحفظ...
                    </>
                  ) : (
                    "حفظ التعديلات"
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default EditProduct;
