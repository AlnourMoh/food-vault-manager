
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import RestaurantDashboard from '@/pages/restaurant/Dashboard';
import RestaurantStorageTeam from '@/pages/restaurant/StorageTeam';
import AddProducts from '@/pages/AddProducts';
import RemoveProducts from '@/pages/RemoveProducts';
import Inventory from '@/pages/Inventory';
import Expired from '@/pages/Expired';
import StorageTeam from '@/pages/StorageTeam';
import RestaurantLogin from '@/pages/RestaurantLogin';
import RestaurantSetupPassword from '@/pages/RestaurantSetupPassword';
import EditProduct from '@/pages/EditProduct';
import ProductBarcodes from '@/pages/ProductBarcodes';
import RestaurantReports from '@/pages/restaurant/Reports';
import { RestaurantRoute } from '@/routes/guards/RouteGuards';

export const RestaurantRoutes = () => {
  return (
    <>
      {/* Restaurant Setup Route */}
      <Route path="/restaurant/setup-password/:id" element={<RestaurantSetupPassword />} />
      
      {/* Old Restaurant Routes */}
      <Route path="/storage-team" element={<StorageTeam />} />
      <Route path="/products/add" element={<AddProducts />} />
      <Route path="/products/remove" element={<RemoveProducts />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/expired" element={<Expired />} />
      <Route path="/products/:productId/edit" element={<EditProduct />} />
      <Route path="/products/:productId/barcodes" element={<ProductBarcodes />} />
      
      {/* Restaurant Authentication */}
      <Route path="/restaurant/login" element={<RestaurantLogin />} />
      
      {/* Protected Restaurant Routes */}
      <Route path="/restaurant/dashboard" element={
        <RestaurantRoute>
          <RestaurantDashboard />
        </RestaurantRoute>
      } />
      <Route path="/restaurant/storage-team" element={
        <RestaurantRoute>
          <RestaurantStorageTeam />
        </RestaurantRoute>
      } />
      <Route path="/restaurant/products/add" element={
        <RestaurantRoute>
          <AddProducts />
        </RestaurantRoute>
      } />
      <Route path="/restaurant/products/remove" element={
        <RestaurantRoute>
          <RemoveProducts />
        </RestaurantRoute>
      } />
      <Route path="/restaurant/inventory" element={
        <RestaurantRoute>
          <Inventory />
        </RestaurantRoute>
      } />
      <Route path="/restaurant/expired" element={
        <RestaurantRoute>
          <Expired />
        </RestaurantRoute>
      } />
      <Route path="/restaurant/reports" element={
        <RestaurantRoute>
          <RestaurantReports />
        </RestaurantRoute>
      } />
      <Route path="/restaurant/products/:productId/edit" element={
        <RestaurantRoute>
          <EditProduct />
        </RestaurantRoute>
      } />
      <Route path="/restaurant/products/:productId/barcodes" element={
        <RestaurantRoute>
          <ProductBarcodes />
        </RestaurantRoute>
      } />
      
      {/* New route for scan-product redirecting to restaurant scan page */}
      <Route path="/scan-product" element={
        <RestaurantRoute>
          <Navigate to="/restaurant/scan" replace />
        </RestaurantRoute>
      } />
    </>
  );
};
