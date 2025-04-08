
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import RestaurantForm from '@/components/restaurant/RestaurantForm';

const AddRestaurant = () => {
  return (
    <MainLayout>
      <div className="rtl space-y-6">
        <h1 className="text-3xl font-bold">إضافة مطعم جديد</h1>
        <RestaurantForm />
      </div>
    </MainLayout>
  );
};

export default AddRestaurant;
