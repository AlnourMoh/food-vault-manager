
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

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
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
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

// Admin route guard
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdminLoggedIn = localStorage.getItem('isAdminLogin') === 'true';
  
  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

function App() {
  const isMobile = useIsMobile();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              {isMobile ? (
                <Routes>
                  <Route path="/" element={<Navigate to="/mobile/login" replace />} />
                  <Route path="/mobile/*" element={<MobileApp />} />
                  <Route path="/scan-product" element={<Navigate to="/mobile/scan" replace />} />
                  <Route path="*" element={<NotFound />} />
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

                  {/* Admin Authentication */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  
                  {/* Protected Admin Routes - Removed reports route */}
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
                  
                  {/* New route for scan-product redirecting to restaurant scan page */}
                  <Route path="/scan-product" element={
                    <RestaurantRoute>
                      <Navigate to="/restaurant/scan" replace />
                    </RestaurantRoute>
                  } />
                  
                  {/* Barcode routes */}
                  <Route path="/products/:productId/barcodes" element={<ProductBarcodes />} />
                  <Route path="/restaurant/products/:productId/barcodes" element={<ProductBarcodes />} />
                  
                  {/* Mobile route for desktop testing */}
                  <Route path="/mobile/*" element={<MobileApp />} />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              )}
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
