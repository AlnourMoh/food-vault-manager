
import React from 'react';
import { Route } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import Restaurants from '@/pages/Restaurants';
import AddRestaurant from '@/pages/AddRestaurant';
import EditRestaurant from '@/pages/EditRestaurant';
import AdminLogin from '@/pages/AdminLogin';
import RestaurantCredentials from '@/pages/RestaurantCredentials';
import { AdminGuard, AdminLoginGuard } from '@/routes/guards/RouteGuards';

// Changed to export an array of routes instead of a component
export const AdminRoutes = [
  <Route 
    key="admin-login"
    path="/admin/login" 
    element={
      <AdminLoginGuard>
        <AdminLogin />
      </AdminLoginGuard>
    } 
  />,
  <Route 
    key="admin-root"
    path="/admin" 
    element={
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    }
  >
    <Route index element={<Dashboard />} />
    <Route path="restaurants" element={<Restaurants />} />
    <Route path="restaurants/add" element={<AddRestaurant />} />
    <Route path="restaurants/:id/edit" element={<EditRestaurant />} />
    <Route path="restaurants/:id/credentials" element={<RestaurantCredentials />} />
  </Route>
];
