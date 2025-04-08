
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import RemoveProductForm from '@/components/inventory/RemoveProductForm';

const RemoveProducts = () => {
  return (
    <MainLayout>
      <div className="rtl space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">إخراج المنتجات</h1>
        <RemoveProductForm />
      </div>
    </MainLayout>
  );
};

export default RemoveProducts;
