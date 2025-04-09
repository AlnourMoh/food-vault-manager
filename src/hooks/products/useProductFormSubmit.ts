
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FormData } from '@/components/products/types';

export const useProductFormSubmit = (
  formData: FormData,
  setFormData: React.Dispatch<React.SetStateAction<FormData>>,
  validateForm: (data: FormData) => { isValid: boolean; errors: any }
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form data
    const { isValid, errors } = validateForm(formData);
    
    if (!isValid) {
      // Don't proceed if validation fails
      toast({
        title: "خطأ في البيانات المدخلة",
        description: "يرجى التحقق من البيانات المدخلة والمحاولة مرة أخرى.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get the restaurant ID from localStorage
      const restaurantId = localStorage.getItem('restaurantId');
      if (!restaurantId) {
        throw new Error('معرف المطعم غير موجود');
      }
      
      let imageUrl = '';
      
      // Upload image if selected
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${restaurantId}/${fileName}`;
        
        console.log('Uploading image to path:', filePath);
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('product-images')
          .upload(filePath, formData.image);
          
        if (uploadError) {
          console.error('Image upload error:', uploadError);
          throw uploadError;
        }
        
        console.log('Image uploaded successfully:', uploadData);
        
        // Get public URL for the uploaded image
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
          
        imageUrl = urlData?.publicUrl || '';
        console.log('Image public URL:', imageUrl);
      }
      
      // Prepare product data for Supabase
      const productData = {
        name: formData.name,
        category: formData.category,
        quantity: Number(formData.quantity),
        expiry_date: new Date(formData.expiryDate).toISOString(),
        production_date: formData.productionDate ? 
          new Date(formData.productionDate).toISOString() : 
          new Date().toISOString(),
        company_id: restaurantId,
        status: 'active',
        image_url: imageUrl, // Include the image URL in the product data
        unit: formData.unit
      };
      
      console.log('Inserting product with data:', productData);
      
      // Insert data into Supabase
      const { error, data } = await supabase
        .from('products')
        .insert([productData])
        .select();
        
      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }
      
      console.log('Product added successfully:', data);
      
      toast({
        title: "تمت الإضافة بنجاح",
        description: "تم إضافة المنتج بنجاح إلى المخزون",
      });
      
      // Generate default QR codes for the new product
      if (data && data[0]) {
        const productId = data[0].id;
        await generateProductCodes(productId);
      }
      
      // Reset form after successful submission
      setFormData({
        name: '',
        category: '',
        unit: '',
        quantity: '',
        expiryDate: '',
        productionDate: '',
        image: null,
        imageUrl: '',
      });
      
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({
        title: "خطأ في إضافة المنتج",
        description: error.message || "حدث خطأ أثناء محاولة إضافة المنتج",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper function to generate product codes
  const generateProductCodes = async (productId: string) => {
    try {
      // Generate a QR code for the product (for demonstration)
      const qrCode = `PROD-${productId.substring(0, 8)}`;
      
      // Insert the product code
      await supabase
        .from('product_codes')
        .insert([
          { product_id: productId, qr_code: qrCode, is_used: false }
        ]);
        
    } catch (error) {
      console.error('Error generating product codes:', error);
      // Don't throw the error, just log it to avoid stopping the main flow
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
};
