
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useIsMobile } from "@/hooks/use-mobile";
import NotFound from '@/pages/NotFound';
import ProductScan from '@/pages/mobile/ProductScan';
import MobileInventory from '@/pages/mobile/MobileInventory';
import MobileApp from '@/components/mobile/MobileApp';

// Import route groups
import WebsiteLayout from '@/components/website/WebsiteLayout';
import { WebsiteRoutes } from './website/WebsiteRoutes';
import { AdminRoutes } from './admin/AdminRoutes';
import { RestaurantRoutes } from './restaurant/RestaurantRoutes';

const AppRoutes: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Function to render nested website routes
  const renderWebsiteRoutes = () => {
    // Map through the WebsiteRoutes and extract the child routes
    // We must extract the Routes element children and reorganize them
    return WebsiteRoutes.map((routeElement, idx) => {
      // Get the children of each Route element (which is the Outlet wrapped content)
      if (!React.isValidElement(routeElement)) return null;
      
      // Extract the props and path from the route element
      const props = routeElement.props as { element: React.ReactNode, path: string, children?: React.ReactNode[] };
      
      // For the root path, special handling with nested routes
      if (props.path === '/') {
        return (
          <Route key={`website-root-${idx}`} path="/" element={<WebsiteLayout />}>
            <Route index element={props.element} />
            {/* Extract nested routes */}
            {React.Children.map(props.children, (child, childIdx) => {
              if (!React.isValidElement(child)) return null;
              const childProps = child.props as { path: string, element: React.ReactNode };
              return (
                <Route
                  key={`website-child-${childIdx}`}
                  path={childProps.path}
                  element={childProps.element}
                />
              );
            })}
          </Route>
        );
      }
      return null;
    }).filter(Boolean);
  };

  return (
    <Routes>
      {/* Website routes */}
      {renderWebsiteRoutes()}

      {/* Admin Routes */}
      {AdminRoutes.map((route, index) => (
        <React.Fragment key={`admin-route-${index}`}>{route}</React.Fragment>
      ))}
      
      {/* Restaurant Routes */}
      {RestaurantRoutes.map((route, index) => (
        <React.Fragment key={`restaurant-route-${index}`}>{route}</React.Fragment>
      ))}

      {/* Mobile routes based on device detection */}
      {isMobile ? (
        <>
          <Route path="/" element={<Navigate to="/mobile" replace />} />
          <Route path="/mobile/*" element={<MobileApp />} />
        </>
      ) : null}
      
      {/* Direct access routes for all devices */}
      <Route path="/inventory" element={<MobileInventory />} />
      <Route path="/scan" element={<ProductScan />} />
      <Route path="/scan-product" element={<Navigate to="/scan" replace />} />
      
      {/* Legacy redirects */}
      <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/restaurants" element={<Navigate to="/admin/restaurants" replace />} />
      <Route path="/restaurants/:id/credentials" element={<Navigate to="/admin/restaurants/:id/credentials" replace />} />
      <Route path="/restaurants/:id/edit" element={<Navigate to="/admin/restaurants/:id/edit" replace />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
