
import * as z from 'zod';

// Define the form validation schema
export const restaurantFormSchema = z.object({
  name: z.string().min(3, { message: 'اسم المطعم يجب أن يكون أكثر من 3 أحرف' }),
  manager: z.string().min(3, { message: 'اسم المدير يجب أن يكون أكثر من 3 أحرف' }),
  address: z.string().min(5, { message: 'العنوان يجب أن يكون أكثر من 5 أحرف' }),
  phoneCountryCode: z.string().min(1, { message: 'مفتاح الدولة مطلوب' }),
  phoneNumber: z.string().min(4, { message: 'رقم الهاتف يجب أن يكون صحيحاً' }),
  email: z.string().email({ message: 'البريد الإلكتروني غير صحيح' }),
});

export type RestaurantFormValues = z.infer<typeof restaurantFormSchema>;
