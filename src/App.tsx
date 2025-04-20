
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";

// Website Pages
import WelcomePage from "./pages/WelcomePage";
import AboutPage from "./pages/website/AboutPage";
import ServicesPage from "./pages/website/ServicesPage";
import ContactPage from "./pages/website/ContactPage";
import WebsiteLayout from "./components/website/WebsiteLayout";

// Admin/Desktop routes
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

// Mobile App
import MobileApp from '@/components/mobile/MobileApp';

// Restaurant route guard
const RestaurantRoute = ({ children }: { children: React.ReactNode }) => {
  const isRestaurantLoggedIn = localStorage.getItem('isRestaurantLogin') === 'true';
  
  if (!isRestaurantLoggedIn) {
    return <Navigate to="/restaurant/login" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

function App() {
  const isMobile = useIsMobile();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {isMobile ? (
              <Routes>
                <Route path="/mobile/*" element={<MobileApp />} />
                <Route path="/*" element={<Navigate to="/mobile" replace />} />
                <Route path="/restaurant/login" element={<RestaurantLogin />} />
              </Routes>
            ) : (
              <Routes>
                {/* Website Routes */}
                <Route path="/" element={<WebsiteLayout><Outlet /></WebsiteLayout>}>
                  <Route index element={<WelcomePage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="services" element={<ServicesPage />} />
                  <Route path="contact" element={<ContactPage />} />
                </Route>

                {/* Super Admin Routes */}
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/restaurants/add" element={<AddRestaurant />} />
                <Route path="/restaurants/:id/credentials" element={<RestaurantCredentials />} />
                <Route path="/restaurants/:id/edit" element={<EditRestaurant />} />
                
                {/* Restaurant Setup Route */}
                <Route path="/restaurant/setup-password/:id" element={<RestaurantSetupPassword />} />
                
                {/* Old Restaurant Routes */}
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
                <Route path="/restaurant/products/:productId/edit" element={
                  <RestaurantRoute>
                    <EditProduct />
                  </RestaurantRoute>
                } />
                
                {/* Barcode routes */}
                <Route path="/products/:productId/barcodes" element={<ProductBarcodes />} />
                <Route path="/restaurant/products/:productId/barcodes" element={<ProductBarcodes />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
