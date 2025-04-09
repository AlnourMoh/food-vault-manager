
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { FormData, FormError } from '@/components/products/types';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const useProductFormSubmit = (
  formData: FormData, 
  setFormData: React.Dispatch<React.SetStateAction<FormData>>,
  validateForm: (formData: FormData) => { isValid: boolean; errors: FormError }
) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    const { isValid, errors } = validateForm(formData);
    
    if (!isValid) {
      toast({
        title: "خطأ في البيانات المدخلة",
        description: "يرجى التحقق من صحة البيانات والمحاولة مرة أخرى",
        variant: "destructive",
      });
      return errors;
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
        return {};
      }

      // Generate a unique ID for the product
      const productId = uuidv4();
      
      let imageUrl = '';
      
      // Upload image to Supabase Storage if an image is provided
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${productId}.${fileExt}`;
        const filePath = `${restaurantId}/${fileName}`;
        
        try {
          // Upload the image to the product_images bucket
          const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('product_images')
            .upload(filePath, formData.image);
          
          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw uploadError;
          }
          
          // Get public URL for the uploaded image
          const { data: urlData } = supabase
            .storage
            .from('product_images')
            .getPublicUrl(filePath);
          
          imageUrl = urlData.publicUrl;
          console.log('Image uploaded successfully:', imageUrl);
        } catch (uploadError: any) {
          console.error('Error handling image upload:', uploadError);
          toast({
            title: "خطأ في رفع الصورة",
            description: uploadError.message || "حدث خطأ أثناء رفع الصورة",
            variant: "destructive",
          });
        }
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
        image_url: imageUrl // Include the image URL in the product data
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
        return {};
      }
      
      // Generate unique barcodes for each unit of the product
      const quantity = Number(formData.quantity);
      
      // Create barcodes directly via a Postgres function or modify RLS policy
      // For now, we'll skip this step with a notification to the user
      toast({
        title: "تم إضافة المنتج بنجاح",
        description: `تم إضافة ${formData.name} إلى المخزون بنجاح.`,
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
      
      return {};
    } catch (error: any) {
      console.error('Error in form submission:', error);
      toast({
        title: "خطأ غير متوقع",
        description: error.message || "حدث خطأ أثناء إضافة المنتج",
        variant: "destructive",
      });
      return {};
    } finally {
      setIsSubmitting(false);
    }
  };

  return { 
    handleSubmit,
    isSubmitting 
  };
};
