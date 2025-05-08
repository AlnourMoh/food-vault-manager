
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { AddProductHeader } from '@/components/products/add/AddProductHeader';
import { AddProductContent } from '@/components/products/add/AddProductContent';

const AddProducts = () => {
  const isRestaurantRoute = window.location.pathname.startsWith('/restaurant/');
  const Layout = isRestaurantRoute ? RestaurantLayout : MainLayout;

  return (
    <Layout>
      <div className="container py-6">
        <AddProductHeader />
        <AddProductContent isRestaurantRoute={isRestaurantRoute} />
      </div>
    </Layout>
  );
};

export default AddProducts;
