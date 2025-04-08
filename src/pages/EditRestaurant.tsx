
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import RestaurantForm from '@/components/restaurant/RestaurantForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { updateRestaurant } from '@/services/restaurantService';

interface RestaurantData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const EditRestaurant = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) {
        toast({
          variant: 'destructive',
          title: 'خطأ',
          description: 'لم يتم تحديد معرف المطعم',
        });
        navigate('/restaurants');
        return;
      }

      console.log("Fetching restaurant with ID:", id);

      try {
        const { data, error } = await supabase
          .from('companies')
          .select('name, email, phone, address')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching restaurant data:', error);
          setFetchError(error.message);
          throw error;
        }

        console.log("Fetched restaurant data:", data);
        
        if (!data) {
          console.log("No restaurant data found");
          setFetchError("لم يتم العثور على بيانات المطعم");
          setRestaurantData(null);
        } else {
          setRestaurantData(data);
        }
      } catch (error: any) {
        console.error('Error fetching restaurant:', error);
        setFetchError(error.message || 'حدث خطأ أثناء محاولة جلب بيانات المطعم');
        toast({
          variant: 'destructive',
          title: 'خطأ في جلب بيانات المطعم',
          description: error.message || 'حدث خطأ أثناء محاولة جلب بيانات المطعم',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, navigate, toast]);

  const handleSubmit = async (data: RestaurantData) => {
    if (!id) {
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'لم يتم تحديد معرف المطعم',
      });
      return;
    }

    setUpdateError(null);
    
    try {
      setIsLoading(true);
      
      console.log("Updating restaurant with data:", data);
      
      // Use the updateRestaurant function from restaurantService.ts
      const updatedRestaurant = await updateRestaurant(
        id,
        data.name,
        data.phone,
        data.address
      );
      
      console.log("Update successful, response:", updatedRestaurant);

      toast({
        title: 'تم تحديث المطعم',
        description: 'تم تحديث بيانات المطعم بنجاح',
      });

      // تأخير قليل قبل التوجيه للتأكد من ظهور الإشعار
      setTimeout(() => {
        navigate('/restaurants');
      }, 500);
      
    } catch (error: any) {
      console.error('Error updating restaurant:', error);
      setUpdateError(error.message || 'حدث خطأ أثناء محاولة تحديث بيانات المطعم');
      toast({
        variant: 'destructive',
        title: 'خطأ في تحديث المطعم',
        description: error.message || 'حدث خطأ أثناء محاولة تحديث بيانات المطعم',
      });
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
            {fetchError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                خطأ: {fetchError}
              </div>
            )}
            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-fvm-primary"></div>
              </div>
            ) : restaurantData ? (
              <>
                {updateError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                    {updateError}
                  </div>
                )}
                <RestaurantForm
                  initialData={restaurantData}
                  onSubmit={handleSubmit}
                  isSubmitting={isLoading}
                  submitText="تحديث المطعم"
                />
              </>
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
