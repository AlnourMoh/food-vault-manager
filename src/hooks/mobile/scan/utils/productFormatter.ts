
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

/**
 * Normalizes the product status from database value to the application's expected format
 * @param status The status string from the database
 * @returns The normalized status value conforming to our Product type
 */
export const normalizeProductStatus = (status: string): 'active' | 'expired' | 'removed' => {
  switch(status) {
    case 'active':
      return 'active';
    case 'expired':
      return 'expired';
    case 'removed':
      return 'removed';
    default:
      console.warn(`productFormatter: حالة منتج غير متوقعة: ${status}، استخدام 'active' كقيمة افتراضية`);
      return 'active';
  }
};

/**
 * Formats the raw product data from database into the application's Product type
 * @param product The raw product data from database
 * @returns Formatted product object
 */
export const formatProductData = (product: any): Product => {
  const normalizedStatus = normalizeProductStatus(product.status);
  
  const formattedProduct: Product = {
    id: product.id,
    name: product.name,
    category: product.category,
    unit: product.unit || '',
    quantity: product.quantity,
    expiryDate: new Date(product.expiry_date),
    entryDate: new Date(product.production_date),
    restaurantId: product.company_id,
    restaurantName: '', 
    addedBy: '', 
    status: normalizedStatus,
    imageUrl: product.image_url,
  };
  
  console.log('productFormatter: بيانات المنتج المنسقة:', formattedProduct);
  
  return formattedProduct;
};
