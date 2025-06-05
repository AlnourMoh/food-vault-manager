
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import Dashboard from '@/pages/restaurant/Dashboard';
import AddProducts from '@/pages/AddProducts';
import Inventory from '@/pages/Inventory';
import EditProduct from '@/pages/EditProduct';
import StorageTeam from '@/pages/restaurant/StorageTeam';
import Reports from '@/pages/restaurant/Reports';

export const RestaurantRoutes: React.FC = () => {
  return (
    <RestaurantLayout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-products" element={<AddProducts />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/storage-team" element={<StorageTeam />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </RestaurantLayout>
  );
};
