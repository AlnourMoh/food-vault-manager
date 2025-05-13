
import { Product } from '@/types';

// دالة لتنسيق بيانات المنتج من قاعدة البيانات إلى نوع Product
export const formatProductData = (productData: any): Product => {
  // طباعة بيانات المنتج للتأكد من صحتها
  console.log('Raw product data:', productData);
  
  // تحويل النصوص إلى كائنات تاريخ
  const expiryDate = new Date(productData.expiry_date);
  const entryDate = new Date(productData.production_date);
  const createdAt = new Date(productData.created_at);
  const updatedAt = new Date(productData.updated_at);
  
  // تحويل البيانات من تنسيق قاعدة البيانات إلى تنسيق المنتج في التطبيق
  return {
    id: productData.id,
    name: productData.name,
    category: productData.category || '',
    unit: productData.unit || 'piece',
    quantity: productData.quantity || 0,
    imageUrl: productData.image_url || null,
    status: productData.status || 'active',
    // استخدام كائنات التاريخ
    expiryDate,
    entryDate,
    // معلومات إضافية
    restaurantId: productData.company_id || '',
    restaurantName: '', // يمكن إضافته لاحقاً من مصدر آخر
    addedBy: '', // يمكن إضافته لاحقاً من مصدر آخر
    createdAt,
    updatedAt
  };
};
