
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import AdminDashboard from '@/pages/admin/Dashboard';
import Restaurants from '@/pages/Restaurants';
import AddRestaurant from '@/pages/AddRestaurant';
import RestaurantCredentials from '@/pages/RestaurantCredentials';
import EditRestaurant from '@/pages/EditRestaurant';
import AdminLogin from '@/pages/AdminLogin';
import { AdminRoute } from '@/routes/guards/RouteGuards';

export const AdminRoutes = () => {
  return (
    <>
      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Protected Admin Routes */}
      <Route path="/admin/dashboard" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />
      <Route path="/restaurants" element={
        <AdminRoute>
          <Restaurants />
        </AdminRoute>
      } />
      <Route path="/restaurants/add" element={
        <AdminRoute>
          <AddRestaurant />
        </AdminRoute>
      } />
      <Route path="/restaurants/:id/credentials" element={
        <AdminRoute>
          <RestaurantCredentials />
        </AdminRoute>
      } />
      <Route path="/restaurants/:id/edit" element={
        <AdminRoute>
          <EditRestaurant />
        </AdminRoute>
      } />
    </>
  );
};
