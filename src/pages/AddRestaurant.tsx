
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import RestaurantForm from '@/components/restaurant/RestaurantForm';
import { useToast } from '@/hooks/use-toast';
import { RestaurantFormValues } from '@/validations/restaurantSchema';
import { createRestaurant } from '@/services/restaurantService';

const AddRestaurant = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (values: RestaurantFormValues) => {
    setIsSubmitting(true);
    try {
      // Combine the phone number with country code for API call
      const fullPhoneNumber = `+${values.phoneCountryCode}${values.phoneNumber}`;
      
      // Call the createRestaurant API
      const newRestaurant = await createRestaurant(
        values.name,
        values.email,
        fullPhoneNumber,
        values.address
      );
      
      console.log('Created restaurant:', newRestaurant);
      
      // Show success message
      toast({
        title: 'تم إضافة المطعم',
        description: 'تم إضافة المطعم بنجاح',
      });
      
      // Navigate back to restaurants list
      navigate('/restaurants');
    } catch (error: any) {
      console.error('Error creating restaurant:', error);
      
      // Show error message
      toast({
        variant: 'destructive',
        title: 'خطأ في إضافة المطعم',
        description: error.message || 'حدث خطأ أثناء محاولة إضافة المطعم',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="rtl space-y-6">
        <h1 className="text-3xl font-bold">إضافة مطعم جديد</h1>
        <RestaurantForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitText="إضافة المطعم"
        />
      </div>
    </MainLayout>
  );
};

export default AddRestaurant;
