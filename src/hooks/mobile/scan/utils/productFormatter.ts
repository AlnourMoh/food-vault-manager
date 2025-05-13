
import { Product } from '@/types';

// دالة لتنسيق بيانات المنتج من قاعدة البيانات إلى نوع Product
export const formatProductData = (productData: any): Product => {
  // طباعة بيانات المنتج للتأكد من صحتها
  console.log('Raw product data:', productData);
  
  // تحويل البيانات من تنسيق قاعدة البيانات إلى تنسيق المنتج في التطبيق
  return {
    id: productData.id,
    name: productData.name,
    category: productData.category || '',
    unit: productData.unit || 'piece',
    quantity: productData.quantity || 0,
    imageUrl: productData.image_url || null,
    status: productData.status || 'active',
    // تحويل حقول التاريخ
    expiryDate: new Date(productData.expiry_date).toISOString(),
    entryDate: new Date(productData.production_date).toISOString(),
    // معلومات إضافية
    restaurantId: productData.company_id || '',
    restaurantName: '', // يمكن إضافته لاحقاً من مصدر آخر
    addedBy: '', // يمكن إضافته لاحقاً من مصدر آخر
    createdAt: new Date(productData.created_at).toISOString(),
    updatedAt: new Date(productData.updated_at).toISOString()
  };
};
