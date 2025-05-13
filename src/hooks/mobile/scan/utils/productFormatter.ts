
import { Product } from '@/types';

/**
 * تنسيق بيانات المنتج الخام من قاعدة البيانات إلى كائن المنتج المتوقع
 */
export const formatProductData = (rawProduct: any): Product => {
  return {
    id: rawProduct.id,
    name: rawProduct.name,
    category: rawProduct.category,
    quantity: rawProduct.quantity,
    expiryDate: new Date(rawProduct.expiry_date),
    entryDate: new Date(rawProduct.created_at || rawProduct.production_date),
    restaurantId: rawProduct.company_id || rawProduct.restaurant_id,
    status: rawProduct.status as "active" | "expired" | "removed",
    imageUrl: rawProduct.image_url || getPlaceholderImage(rawProduct.category),
    restaurantName: rawProduct.restaurant_name || '',
    addedBy: rawProduct.added_by || '',
    unit: rawProduct.unit || 'piece'
  };
};

/**
 * الحصول على صورة بديلة بناءً على فئة المنتج
 */
const getPlaceholderImage = (category: string): string => {
  switch (category) {
    case 'خضروات':
      return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200";
    case 'لحوم':
      return "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=200";
    case 'بهارات':
      return "https://images.unsplash.com/photo-1532336414046-2a0e3a1dd7e5?q=80&w=200";
    case 'بقالة':
      return "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?q=80&w=200";
    default:
      return "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=200";
  }
};
