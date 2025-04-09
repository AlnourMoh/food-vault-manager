
import * as z from 'zod';
import { TeamMemberRole } from '@/types/team';

// تعريف مخطط التحقق من صحة البيانات
export const formSchema = z.object({
  name: z.string().min(3, { message: 'الاسم يجب أن يكون 3 أحرف على الأقل' }),
  role: z.string().min(2, { message: 'الدور يجب أن يكون محدداً' }),
  phoneCountryCode: z.string().min(1, { message: 'يجب تحديد مفتاح الدولة' }),
  phoneNumber: z
    .string()
    .min(4, { message: 'رقم الهاتف يجب أن يكون 4 أرقام على الأقل' })
    .max(15, { message: 'رقم الهاتف يجب أن لا يتجاوز 15 رقماً' })
    .regex(/^\d+$/, { message: 'يجب أن يحتوي رقم الهاتف على أرقام فقط' }),
  email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),
});

export type FormValues = z.infer<typeof formSchema>;
