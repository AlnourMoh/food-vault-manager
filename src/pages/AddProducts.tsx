
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import AddProductContainer from '@/components/products/AddProductContainer';

const AddProducts = () => {
  // Check current route and use appropriate layout
  const isRestaurantRoute = window.location.pathname.startsWith('/restaurant/');
  const Layout = isRestaurantRoute ? RestaurantLayout : MainLayout;

  return (
    <Layout>
      <AddProductContainer />
    </Layout>
  );
};

export default AddProducts;
