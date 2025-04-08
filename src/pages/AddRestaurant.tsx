
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import RestaurantForm from '@/components/restaurant/RestaurantForm';
import { useToast } from '@/hooks/use-toast';
import { createRestaurant } from '@/services/restaurantService';

const AddRestaurant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await createRestaurant(
        data.name,
        data.email,
        data.phone,
        data.address
      );

      toast({
        title: 'تم إضافة المطعم',
        description: 'تم إضافة المطعم بنجاح',
      });

      navigate('/restaurants');
    } catch (error: any) {
      console.error('Error creating restaurant:', error);
      throw error;
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
