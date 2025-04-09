
import * as z from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const productFormSchema = z.object({
  name: z.string()
    .min(2, { message: 'اسم المنتج يجب أن يكون أكثر من حرفين' })
    .max(100, { message: 'اسم المنتج لا يمكن أن يتجاوز 100 حرف' }),
  
  category: z.string()
    .min(1, { message: 'يجب اختيار تصنيف المنتج' }),
  
  unit: z.string()
    .min(1, { message: 'يجب اختيار وحدة القياس' }),
  
  quantity: z.coerce.number()
    .min(0.01, { message: 'الكمية يجب أن تكون أكبر من صفر' })
    .max(1000000, { message: 'الكمية كبيرة جدًا' }),
  
  expiryDate: z.string()
    .min(1, { message: 'يجب تحديد تاريخ انتهاء الصلاحية' })
    .refine((date) => {
      const selectedDate = new Date(date);
      const currentDate = new Date();
      // تاريخ أكبر من اليوم
      return selectedDate >= currentDate;
    }, { message: 'تاريخ الانتهاء يجب أن يكون بعد اليوم الحالي' }),
  
  productionDate: z.string().optional(),
  
  image: z.instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, { message: 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت' })
    .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), { message: 'يجب أن تكون الصورة بصيغة JPEG أو PNG أو WebP' })
    .nullable()
    .optional(),
  
  imageUrl: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
