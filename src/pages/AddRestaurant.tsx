
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Json } from '@/integrations/supabase/types';

// Define the form validation schema
const formSchema = z.object({
  name: z.string().min(3, { message: 'اسم المطعم يجب أن يكون أكثر من 3 أحرف' }),
  manager: z.string().min(3, { message: 'اسم المدير يجب أن يكون أكثر من 3 أحرف' }),
  address: z.string().min(5, { message: 'العنوان يجب أن يكون أكثر من 5 أحرف' }),
  phone: z.string().min(10, { message: 'رقم الهاتف يجب أن يكون على الأقل 10 أرقام' }),
  email: z.string().email({ message: 'البريد الإلكتروني غير صحيح' }),
});

type FormValues = z.infer<typeof formSchema>;

// Define the restaurant data response interface
interface RestaurantResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  logo_url?: string | null;
}

const AddRestaurant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      manager: '',
      address: '',
      phone: '',
      email: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      // Create the company (restaurant) in the database
      const { data: restaurantData, error: restaurantError } = await supabase.rpc('create_company_secure', {
        p_name: values.name,
        p_email: values.email,
        p_phone: values.phone,
        p_address: values.address,
      });

      if (restaurantError) {
        throw restaurantError;
      }

      if (restaurantData) {
        // Cast the response to the correct type
        const typedData = restaurantData as unknown as RestaurantResponse;
        
        toast({
          title: "تم إضافة المطعم بنجاح",
          description: "يمكنك الآن إضافة بيانات الدخول للمطعم",
        });
        
        // Navigate to the credentials page with the new restaurant ID
        navigate(`/restaurants/${typedData.id}/credentials`);
      }
    } catch (error) {
      console.error("Error adding restaurant:", error);
      toast({
        variant: "destructive",
        title: "خطأ في إضافة المطعم",
        description: "حدث خطأ أثناء محاولة إضافة المطعم. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="rtl space-y-6">
        <h1 className="text-3xl font-bold">إضافة مطعم جديد</h1>
        
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">بيانات المطعم الجديد</CardTitle>
            <CardDescription>أدخل معلومات المطعم بشكل صحيح لإضافته إلى النظام</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم المطعم</FormLabel>
                      <FormControl>
                        <Input placeholder="اسم المطعم" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="manager"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم المدير</FormLabel>
                      <FormControl>
                        <Input placeholder="اسم المدير" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>العنوان</FormLabel>
                      <FormControl>
                        <Input placeholder="عنوان المطعم" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الهاتف</FormLabel>
                      <FormControl>
                        <Input placeholder="رقم هاتف المطعم" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="البريد الإلكتروني للمطعم" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/restaurants')}
                    className="ml-2"
                  >
                    إلغاء
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-fvm-primary hover:bg-fvm-primary-light"
                    disabled={isLoading}
                  >
                    {isLoading ? "جاري الحفظ..." : "إضافة المطعم"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AddRestaurant;
