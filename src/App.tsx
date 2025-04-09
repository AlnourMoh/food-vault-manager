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
import RestaurantSetupPassword from "./pages/RestaurantSetupPassword";
import RestaurantDashboard from "./pages/restaurant/Dashboard";
import RestaurantStorageTeam from "./pages/restaurant/StorageTeam";
import AddRestaurant from "./pages/AddRestaurant";
import EditRestaurant from "./pages/EditRestaurant";
import ProductBarcodes from '@/pages/ProductBarcodes';
import EditProduct from '@/pages/EditProduct';
import MobileDashboard from '@/pages/mobile/MobileDashboard';
import MobileAddProduct from '@/pages/mobile/MobileAddProduct';
import MobileRemoveProduct from '@/pages/mobile/MobileRemoveProduct';

const RestaurantRoute = ({ children }: { children: React.ReactNode }) => {
  const isRestaurantLoggedIn = localStorage.getItem('isRestaurantLogin') === 'true';
  
  if (!isRestaurantLoggedIn) {
    return <Navigate to="/restaurant/login" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Super Admin Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/restaurants/add" element={<AddRestaurant />} />
              <Route path="/restaurants/:id/credentials" element={<RestaurantCredentials />} />
              <Route path="/restaurants/:id/edit" element={<EditRestaurant />} />
              
              {/* Restaurant Setup Route */}
              <Route path="/restaurant/setup-password/:id" element={<RestaurantSetupPassword />} />
              
              {/* Old Restaurant Routes (To be removed later) */}
              <Route path="/storage-team" element={<StorageTeam />} />
              <Route path="/products/add" element={<AddProducts />} />
              <Route path="/products/remove" element={<RemoveProducts />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/expired" element={<Expired />} />
              <Route path="/products/:productId/edit" element={<EditProduct />} />
              
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
              
              {/* Mobile App Routes */}
              <Route path="/restaurant/mobile" element={
                <RestaurantRoute>
                  <MobileDashboard />
                </RestaurantRoute>
              } />
              <Route path="/restaurant/mobile/add" element={
                <RestaurantRoute>
                  <MobileAddProduct />
                </RestaurantRoute>
              } />
              <Route path="/restaurant/mobile/remove" element={
                <RestaurantRoute>
                  <MobileRemoveProduct />
                </RestaurantRoute>
              } />
              
              {/* Barcode routes */}
              <Route path="/products/:productId/barcodes" element={<ProductBarcodes />} />
              <Route path="/restaurant/products/:productId/barcodes" element={<ProductBarcodes />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
