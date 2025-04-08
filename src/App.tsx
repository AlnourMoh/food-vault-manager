
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Restaurants from "./pages/Restaurants";
import StorageTeam from "./pages/StorageTeam";
import AddProducts from "./pages/AddProducts";
import RemoveProducts from "./pages/RemoveProducts";
import Inventory from "./pages/Inventory";
import Expired from "./pages/Expired";
import NotFound from "./pages/NotFound";
import RestaurantLogin from "./pages/RestaurantLogin";
import RestaurantCredentials from "./pages/RestaurantCredentials";
import RestaurantDashboard from "./pages/restaurant/Dashboard";
import RestaurantStorageTeam from "./pages/restaurant/StorageTeam";

// Restaurant route guard
const RestaurantRoute = ({ children }: { children: React.ReactNode }) => {
  const isRestaurantLoggedIn = localStorage.getItem('isRestaurantLogin') === 'true';
  
  if (!isRestaurantLoggedIn) {
    return <Navigate to="/restaurant/login" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Super Admin Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id/credentials" element={<RestaurantCredentials />} />
          
          {/* Old Restaurant Routes (To be removed later) */}
          <Route path="/storage-team" element={<StorageTeam />} />
          <Route path="/products/add" element={<AddProducts />} />
          <Route path="/products/remove" element={<RemoveProducts />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/expired" element={<Expired />} />
          
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
          {/* More restaurant routes would go here */}
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
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
