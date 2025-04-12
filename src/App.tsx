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
import MobileLogin from '@/pages/mobile/MobileLogin';

const RestaurantRoute = ({ children }: { children: React.ReactNode }) => {
  const isRestaurantLoggedIn = localStorage.getItem('isRestaurantLogin') === 'true';
  
  if (!isRestaurantLoggedIn) {
    return <Navigate to="/restaurant/login" replace />;
  }
  
  return <>{children}</>;
};

// Mobile team member route guard
const TeamMemberRoute = ({ children }: { children: React.ReactNode }) => {
  const isTeamMemberLoggedIn = !!localStorage.getItem('teamMemberId');
  
  if (!isTeamMemberLoggedIn) {
    return <Navigate to="/restaurant/mobile/login" replace />;
  }
  
  return <>{children}</>;
};

// دالة للتحقق مما إذا كان الجهاز هو هاتف محمول
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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
              <Route path="/" element={
                isMobileDevice() && localStorage.getItem('teamMemberId')
                  ? <Navigate to="/restaurant/mobile" replace />
                  : isMobileDevice() && localStorage.getItem('isRestaurantLogin') === 'true'
                  ? <Navigate to="/restaurant/mobile" replace />
                  : <Index />
              } />
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
                  {isMobileDevice() ? <Navigate to="/restaurant/mobile" replace /> : <RestaurantDashboard />}
                </RestaurantRoute>
              } />
              <Route path="/restaurant/storage-team" element={
                <RestaurantRoute>
                  <RestaurantStorageTeam />
                </RestaurantRoute>
              } />
              
              {/* Mobile Login Route */}
              <Route path="/restaurant/mobile/login" element={<MobileLogin />} />
              
              {/* Mobile App Routes (Protected) */}
              <Route path="/restaurant/mobile" element={
                <TeamMemberRoute>
                  <MobileDashboard />
                </TeamMemberRoute>
              } />
              <Route path="/restaurant/mobile/add" element={
                <TeamMemberRoute>
                  <MobileAddProduct />
                </TeamMemberRoute>
              } />
              <Route path="/restaurant/mobile/remove" element={
                <TeamMemberRoute>
                  <MobileRemoveProduct />
                </TeamMemberRoute>
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
