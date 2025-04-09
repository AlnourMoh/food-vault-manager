
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FormData, FormError } from '@/components/products/types';
import { useProductFormValidation } from '@/hooks/products/useProductFormValidation';
import { useProductFormHandlers } from '@/hooks/products/useProductFormHandlers';
import { useProductFormState } from '@/hooks/products/useProductFormState';

export const useEditProductForm = (productId: string | undefined, onSuccess: () => void) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use shared form state management
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    categories,
    setCategories,
    units,
    setUnits
  } = useProductFormState();

  // Use shared form validation
  const { validateForm } = useProductFormValidation();
  
  // Use shared form handlers
  const {
    handleInputChange,
    handleSelectChange,
    handleImageChange,
  } = useProductFormHandlers(formData, setFormData, errors, setErrors);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    const { isValid, errors: validationErrors } = validateForm(formData);
    
    if (!isValid) {
      setErrors(validationErrors);
      toast({
        title: "خطأ في البيانات المدخلة",
        description: "يرجى التحقق من صحة البيانات والمحاولة مرة أخرى",
        variant: "destructive",
      });
      return;
    }
    
    if (!productId) {
      toast({
        title: "خطأ في تحديث المنتج",
        description: "معرف المنتج غير موجود",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Format dates for database
      const expiryDate = new Date(formData.expiryDate);
      
      // Handle production date properly - use provided date or fallback to current
      const productionDate = formData.productionDate ? 
        new Date(formData.productionDate) : 
        new Date(); // Default to current date if not provided
      
      let imageUrl = formData.imageUrl;
      
      // Upload image if a new one was selected
      if (formData.image) {
        const restaurantId = localStorage.getItem('restaurantId');
        if (!restaurantId) {
          throw new Error('معرف المطعم غير موجود');
        }
        
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${restaurantId}/${fileName}`;
        
        console.log('Uploading image to path:', filePath);
        
        try {
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('product-images')
            .upload(filePath, formData.image);
            
          if (uploadError) {
            console.error('Image upload error:', uploadError);
            // Continue with product update but without changing the image
            toast({
              title: "تحذير: لم يتم تحديث الصورة",
              description: "تم تحديث بيانات المنتج ولكن حدث خطأ أثناء رفع الصورة",
              variant: "destructive", // Changed from "warning" to "destructive"
            });
          } else {
            console.log('Image uploaded successfully:', uploadData);
            
            // Get public URL for the uploaded image
            const { data: urlData } = supabase.storage
              .from('product-images')
              .getPublicUrl(filePath);
              
            imageUrl = urlData?.publicUrl || '';
            console.log('Image public URL:', imageUrl);
          }
        } catch (uploadErr) {
          console.error('Failed to upload image:', uploadErr);
          // Continue with product update but without changing the image
        }
      }
      
      const productData = {
        name: formData.name,
        category: formData.category,
        quantity: Number(formData.quantity),
        expiry_date: expiryDate.toISOString(),
        production_date: productionDate.toISOString(),
        unit: formData.unit || 'piece', // استخدام وحدة القياس المحددة أو القيمة الافتراضية
        image_url: imageUrl
      };
      
      console.log('Updating product with data:', productData);
      
      // Update product in Supabase
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId);
        
      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }
      
      toast({
        title: "تم تحديث المنتج",
        description: "تم تحديث بيانات المنتج بنجاح",
      });
      
      // Call the success callback (navigate back to inventory)
      onSuccess();
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

  return {
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
    handleSubmit
  };
};
