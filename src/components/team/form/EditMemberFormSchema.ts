import { z } from "zod";

// Define the schema for editing a team member
export const formSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يكون على الأقل حرفين" }),
  role: z.string().min(1, { message: "يرجى اختيار الدور" }),
  phoneCountryCode: z.string().min(1, { message: "يرجى اختيار رمز الدولة" }),
  phoneNumber: z.string().min(8, { message: "رقم الهاتف يجب أن يكون على الأقل 8 أرقام" }),
  email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صحيح" }),
});

// Export the type for form values
export type FormValues = z.infer<typeof formSchema>;

// Keep the original export for backward compatibility
export const editMemberFormSchema = formSchema;
export type EditMemberFormValues = FormValues;
