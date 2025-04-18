
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import MobileLayout from '@/components/layout/MobileLayout';
import MobileHome from '@/pages/mobile/MobileHome';
import ProductScan from '@/pages/mobile/ProductScan';

const MobileApp = () => {
  useEffect(() => {
    const setupCapacitor = async () => {
      if (window.Capacitor) {
        // Listen for the hardware back button (Android)
        CapApp.addListener('backButton', ({ canGoBack }) => {
          if (canGoBack) {
            window.history.back();
          } else {
            // If we're at the root, ask if they want to exit the app
            // This could be replaced with a confirm dialog
            CapApp.exitApp();
          }
        });
      }
    };
    
    setupCapacitor();
    
    return () => {
      if (window.Capacitor) {
        // Clean up listeners when component unmounts
        CapApp.removeAllListeners();
      }
    };
  }, []);
  
  return (
    <MobileLayout>
      <Routes>
        <Route path="/" element={<MobileHome />} />
        <Route path="/scan" element={<ProductScan />} />
        {/* Add more routes for the mobile app here */}
        <Route path="*" element={<Navigate to="/mobile" replace />} />
      </Routes>
    </MobileLayout>
  );
};

export default MobileApp;
