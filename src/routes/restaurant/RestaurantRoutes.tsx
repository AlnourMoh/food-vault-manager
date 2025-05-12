
import React from 'react';
import { Route } from 'react-router-dom';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import Dashboard from '@/pages/restaurant/Dashboard';
import RestaurantLogin from '@/pages/RestaurantLogin';
import StorageTeam from '@/pages/restaurant/StorageTeam';
import Inventory from '@/pages/Inventory';
import AddProducts from '@/pages/AddProducts';
import EditProduct from '@/pages/EditProduct';
import RemoveProducts from '@/pages/RemoveProducts';
import ProductBarcodes from '@/pages/ProductBarcodes';
import RestaurantSetupPassword from '@/pages/RestaurantSetupPassword';
import Reports from '@/pages/restaurant/Reports';
import { RestaurantGuard, RestaurantLoginGuard, RestaurantSetupGuard } from '@/routes/guards/RouteGuards';
import Expired from '@/pages/Expired';

// Changed to export an array of routes instead of a component
export const RestaurantRoutes = [
  <Route 
    key="restaurant-login"
    path="/restaurant/login" 
    element={
      <RestaurantLoginGuard>
        <RestaurantLogin />
      </RestaurantLoginGuard>
    } 
  />,
  <Route 
    key="restaurant-setup"
    path="/restaurant/setup/:token" 
    element={
      <RestaurantSetupGuard>
        <RestaurantSetupPassword />
      </RestaurantSetupGuard>
    } 
  />,
  <Route 
    key="restaurant-root"
    path="/restaurant" 
    element={
      <RestaurantGuard>
        <RestaurantLayout>
          <></>
        </RestaurantLayout>
      </RestaurantGuard>
    }
  >
    <Route index element={<Dashboard />} />
    <Route path="inventory" element={<Inventory />} />
    <Route path="products/add" element={<AddProducts />} />
    <Route path="products/:id/edit" element={<EditProduct />} />
    <Route path="products/remove" element={<RemoveProducts />} />
    <Route path="products/barcodes" element={<ProductBarcodes />} />
    <Route path="team" element={<StorageTeam />} />
    <Route path="reports" element={<Reports />} />
    <Route path="expired" element={<Expired />} />
  </Route>
];
