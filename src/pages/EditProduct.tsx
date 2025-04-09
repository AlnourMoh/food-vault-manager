
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUploader from '@/components/products/ImageUploader';
import { Card, CardContent } from '@/components/ui/card';

const EditProduct = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productData, setProductData] = useState<any>(null);
  const [image, setImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    expiryDate: '',
    productionDate: '',
    unit: '',
    imageUrl: ''
  });
  
  // Default categories
  const [categories, setCategories] = useState([
    'بقالة',
    'لحوم',
    'ألبان',
    'خضروات',
    'فواكه',
    'بهارات',
    'زيوت',
    'مجمدات',
    'أخرى'
  ]);
  
  // Default units
  const [units, setUnits] = useState([
    { value: 'kg', label: 'كيلوغرام' },
    { value: 'g', label: 'غرام' },
    { value: 'l', label: 'لتر' },
    { value: 'ml', label: 'مليلتر' },
    { value: 'piece', label: 'قطعة' },
    { value: 'box', label: 'صندوق' },
    { value: 'pack', label: 'عبوة' },
  ]);
  
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
          productionDate: productionDate.toISOString().split('T')[0],
          unit: data.unit || 'piece', // Default to 'piece' if unit is not available
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
  }, [productId, toast, navigate, inventoryPath]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageChange = (file: File | null, url: string) => {
    setImage(file);
    setFormData(prev => ({
      ...prev,
      imageUrl: url
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Format dates for database
      const expiryDate = new Date(formData.expiryDate);
      const productionDate = new Date(formData.productionDate);
      
      let imageUrl = formData.imageUrl;
      
      // Upload image if a new one was selected
      if (image) {
        const restaurantId = localStorage.getItem('restaurantId');
        if (!restaurantId) {
          throw new Error('معرف المطعم غير موجود');
        }
        
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${restaurantId}/${fileName}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('product-images')
          .upload(filePath, image);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL for the uploaded image
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
          
        imageUrl = urlData?.publicUrl || '';
      }
      
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          category: formData.category,
          quantity: formData.quantity,
          expiry_date: expiryDate.toISOString(),
          production_date: productionDate.toISOString(),
          unit: formData.unit,
          image_url: imageUrl
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
      setIsSubmitting(false);
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
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسم المنتج</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">التصنيف</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="اختر التصنيف" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category, index) => (
                          <SelectItem key={index} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quantity">الكمية</Label>
                    <Input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unit">وحدة القياس</Label>
                    <Select
                      value={formData.unit}
                      onValueChange={(value) => handleSelectChange('unit', value)}
                    >
                      <SelectTrigger id="unit">
                        <SelectValue placeholder="اختر وحدة القياس" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit, index) => (
                          <SelectItem key={index} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="productionDate">تاريخ الإنتاج</Label>
                    <Input
                      type="date"
                      id="productionDate"
                      name="productionDate"
                      value={formData.productionDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">تاريخ الانتهاء</Label>
                    <Input
                      type="date"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <ImageUploader 
                      imageUrl={formData.imageUrl}
                      onImageChange={handleImageChange}
                      error=""
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 space-x-reverse pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    إلغاء
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري الحفظ...
                      </>
                    ) : (
                      "حفظ التعديلات"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default EditProduct;
