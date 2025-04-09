
import { supabase } from '@/integrations/supabase/client';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/hooks/use-toast';
import RestaurantForm from '@/components/restaurant/RestaurantForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { updateRestaurant } from '@/services/restaurantService';
import { RestaurantFormValues } from '@/validations/restaurantSchema';

interface RestaurantData {
  name: string;
  email: string;
  phone: string;
  address: string;
  manager?: string;
}

const EditRestaurant = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return;

      try {
        console.log('Fetching restaurant with ID:', id);
        
        // استخدام الاستعلام المباشر للحصول على بيانات المطعم
        const { data, error } = await supabase
          .from('companies')
          .select('name, email, phone, address')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching restaurant data:', error);
          throw error;
        }

        console.log('Fetched restaurant data:', data);
        
        if (data) {
          setRestaurantData({
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            manager: '' // Set a default empty value since manager doesn't exist in companies table
          });
        }
      } catch (error: any) {
        console.error('Error fetching restaurant:', error);
        toast({
          variant: 'destructive',
          title: 'خطأ في جلب بيانات المطعم',
          description: error.message || 'حدث خطأ أثناء محاولة جلب بيانات المطعم',
        });
        navigate('/restaurants');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, navigate, toast]);

  const handleSubmit = async (values: RestaurantFormValues) => {
    if (!id) return;

    try {
      setIsLoading(true);
      
      // Combine the phone number with country code for API call
      const fullPhoneNumber = `+${values.phoneCountryCode}${values.phoneNumber}`;
      
      // استخدام خدمة تحديث المطعم من restaurantService
      const updatedRestaurant = await updateRestaurant(
        id,
        values.name,
        fullPhoneNumber,
        values.address
      );

      console.log('Updated restaurant:', updatedRestaurant);

      toast({
        title: 'تم تحديث المطعم',
        description: 'تم تحديث بيانات المطعم بنجاح',
      });

      navigate('/restaurants');
    } catch (error: any) {
      console.error('Error updating restaurant:', error);
      toast({
        variant: 'destructive',
        title: 'خطأ في تحديث المطعم',
        description: error.message || 'حدث خطأ أثناء محاولة تحديث بيانات المطعم',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="rtl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">تعديل بيانات المطعم</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>معلومات المطعم</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-fvm-primary"></div>
              </div>
            ) : restaurantData ? (
              <RestaurantForm
                initialData={restaurantData}
                onSubmit={handleSubmit}
                isSubmitting={isLoading}
                submitText="تحديث المطعم"
                isEditMode={true}
              />
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                لم يتم العثور على المطعم. 
                <Button 
                  variant="link" 
                  onClick={() => navigate('/restaurants')}
                  className="mr-2"
                >
                  العودة إلى قائمة المطاعم
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default EditRestaurant;
