
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
      
      // Log the image upload attempt even though we don't have storage yet
      if (formData.image) {
        console.log('Image upload skipped due to missing storage bucket');
        
        toast({
          title: "تنبيه",
          description: "تم تخطي رفع الصورة - يرجى التواصل مع مسؤول النظام لإنشاء بكت التخزين",
          variant: "default",
        });
      }

      // Create data object for insertion - removing fields that don't exist in the database
      const product = {
        id: productId,
        name: formData.name,
        category: formData.category,
        quantity: Number(formData.quantity),
        expiry_date: new Date(formData.expiryDate).toISOString(),
        production_date: new Date().toISOString(),
        company_id: restaurantId,
        status: 'active'
        // Note: unit and imageUrl fields are omitted since they don't exist in the database schema
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
      const barcodeInserts = [];
      
      for (let i = 0; i < quantity; i++) {
        // Generate a unique barcode for each product unit
        const barcode = `${productId.substring(0, 8)}-${i+1}`;
        barcodeInserts.push({
          product_id: productId,
          qr_code: barcode,
          is_used: false
        });
      }
      
      // Insert all generated barcodes into product_codes table
      if (barcodeInserts.length > 0) {
        const { error: barcodeError } = await supabase
          .from('product_codes')
          .insert(barcodeInserts);
          
        if (barcodeError) {
          console.error('Error inserting barcodes:', barcodeError);
          // Continue despite barcode error, product is already created
          toast({
            title: "تحذير",
            description: "تم إضافة المنتج ولكن فشل في إنشاء الباركود",
            variant: "default",
          });
        }
      }
      
      // Show success message
      toast({
        title: "تم إضافة المنتج بنجاح",
        description: `تم إضافة ${formData.name} إلى المخزون مع ${quantity} باركود`,
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
