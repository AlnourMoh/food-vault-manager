
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
    key="restaurant-dashboard"
    path="/restaurant/dashboard" 
    element={
      <RestaurantGuard>
        <RestaurantLayout>
          <Dashboard />
        </RestaurantLayout>
      </RestaurantGuard>
    }
  />,
  <Route 
    key="restaurant-inventory"
    path="/restaurant/inventory" 
    element={
      <RestaurantGuard>
        <RestaurantLayout>
          <Inventory />
        </RestaurantLayout>
      </RestaurantGuard>
    }
  />,
  <Route 
    key="restaurant-products-add"
    path="/restaurant/products/add" 
    element={
      <RestaurantGuard>
        <RestaurantLayout>
          <AddProducts />
        </RestaurantLayout>
      </RestaurantGuard>
    }
  />,
  <Route 
    key="restaurant-products-edit"
    path="/restaurant/products/:id/edit" 
    element={
      <RestaurantGuard>
        <RestaurantLayout>
          <EditProduct />
        </RestaurantLayout>
      </RestaurantGuard>
    }
  />,
  <Route 
    key="restaurant-products-remove"
    path="/restaurant/products/remove" 
    element={
      <RestaurantGuard>
        <RestaurantLayout>
          <RemoveProducts />
        </RestaurantLayout>
      </RestaurantGuard>
    }
  />,
  <Route 
    key="restaurant-products-barcodes"
    path="/restaurant/products/barcodes" 
    element={
      <RestaurantGuard>
        <RestaurantLayout>
          <ProductBarcodes />
        </RestaurantLayout>
      </RestaurantGuard>
    }
  />,
  <Route 
    key="restaurant-team"
    path="/restaurant/team" 
    element={
      <RestaurantGuard>
        <RestaurantLayout>
          <StorageTeam />
        </RestaurantLayout>
      </RestaurantGuard>
    }
  />,
  <Route 
    key="restaurant-reports"
    path="/restaurant/reports" 
    element={
      <RestaurantGuard>
        <RestaurantLayout>
          <Reports />
        </RestaurantLayout>
      </RestaurantGuard>
    }
  />,
  <Route 
    key="restaurant-expired"
    path="/restaurant/expired" 
    element={
      <RestaurantGuard>
        <RestaurantLayout>
          <Expired />
        </RestaurantLayout>
      </RestaurantGuard>
    }
  />,
  // Add a root redirect for /restaurant to /restaurant/dashboard
  <Route 
    key="restaurant-root"
    path="/restaurant" 
    element={
      <RestaurantGuard>
        <RestaurantLayout>
          <Dashboard />
        </RestaurantLayout>
      </RestaurantGuard>
    }
  />
];
