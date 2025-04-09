
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { FormData, FormError } from '@/components/products/types';
import { productFormSchema } from '@/validations/productFormSchema';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const useProductForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormError>({});
  
  // State for categories
  const [categories, setCategories] = useState([
    'بقالة',
    'لحوم',
    'ألبان',
    'خضروات',
    'فواكه',
    'بهارات',
    'زيوت',
    'مجمدات',
  ]);
  
  // State for units
  const [units, setUnits] = useState([
    { value: 'kg', label: 'كيلوغرام' },
    { value: 'g', label: 'غرام' },
    { value: 'l', label: 'لتر' },
    { value: 'ml', label: 'مليلتر' },
    { value: 'piece', label: 'قطعة' },
    { value: 'box', label: 'صندوق' },
    { value: 'pack', label: 'عبوة' },
  ]);
  
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    unit: '',
    quantity: '',
    expiryDate: '',
    image: null,
    imageUrl: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof FormError]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormError];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof FormError]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormError];
        return newErrors;
      });
    }
  };

  const handleImageChange = (file: File | null, url: string) => {
    setFormData(prev => ({ ...prev, image: file, imageUrl: url }));
    
    // Clear error when image is edited
    if (errors.image) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    try {
      productFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const formattedErrors: FormError = {};
      
      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            const fieldName = err.path[0];
            formattedErrors[fieldName as keyof FormError] = err.message;
          }
        });
      }
      
      setErrors(formattedErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast({
        title: "خطأ في البيانات المدخلة",
        description: "يرجى التحقق من صحة البيانات والمحاولة مرة أخرى",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get restaurant ID from localStorage
      const restaurantId = localStorage.getItem('restaurantId');
      
      if (!restaurantId) {
        toast({
          title: "خطأ في إضافة المنتج",
          description: "لم يتم العثور على معرف المطعم",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Generate a unique ID for the product
      const productId = uuidv4();
      
      // Process image if it exists
      let imageUrl = '';
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${productId}.${fileExt}`;
        const filePath = `products/${fileName}`;
        
        // Upload image to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, formData.image);
        
        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast({
            title: "خطأ في رفع الصورة",
            description: uploadError.message,
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        
        // Get public URL for the uploaded image
        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      // Create data object for insertion
      const product = {
        id: productId,
        name: formData.name,
        category: formData.category,
        quantity: Number(formData.quantity),
        expiry_date: new Date(formData.expiryDate).toISOString(),
        production_date: new Date().toISOString(),
        company_id: restaurantId,
        status: 'active',
        imageUrl // Include imageUrl in the insertion
      };
      
      // Insert data into Supabase
      const { error: insertError } = await supabase
        .from('products')
        .insert(product);
      
      if (insertError) {
        console.error('Error inserting product:', insertError);
        toast({
          title: "خطأ في إضافة المنتج",
          description: insertError.message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Show success message
      toast({
        title: "تم إضافة المنتج بنجاح",
        description: `تم إضافة ${formData.name} إلى المخزون`,
      });
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        unit: '',
        quantity: '',
        expiryDate: '',
        image: null,
        imageUrl: '',
      });
      
      // توجيه المستخدم إلى صفحة المخزون
      const isRestaurantRoute = window.location.pathname.startsWith('/restaurant/');
      const inventoryPath = isRestaurantRoute ? '/restaurant/inventory' : '/inventory';
      navigate(inventoryPath);
      
    } catch (error: any) {
      console.error('Error in form submission:', error);
      toast({
        title: "خطأ غير متوقع",
        description: error.message || "حدث خطأ أثناء إضافة المنتج",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    categories,
    setCategories,
    units,
    setUnits,
    handleInputChange,
    handleSelectChange,
    handleImageChange,
    handleSubmit
  };
};
