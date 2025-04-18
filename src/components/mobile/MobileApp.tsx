
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import MobileLayout from '@/components/layout/MobileLayout';
import MobileHome from '@/pages/mobile/MobileHome';
import ProductScan from '@/pages/mobile/ProductScan';

const MobileApp = () => {
  useEffect(() => {
    const setupCapacitor = async () => {
      if (window.Capacitor) {
        console.log('Capacitor is available, setting up listeners');
        // Listen for the hardware back button (Android)
        CapacitorApp.addListener('backButton', ({ canGoBack }) => {
          console.log('Back button pressed, canGoBack:', canGoBack);
          if (canGoBack) {
            window.history.back();
          } else {
            // If we're at the root, ask if they want to exit the app
            CapacitorApp.exitApp();
          }
        });
      } else {
        console.log('Capacitor is not available in this environment');
      }
    };
    
    setupCapacitor();
    
    return () => {
      if (window.Capacitor) {
        // Clean up listeners when component unmounts
        CapacitorApp.removeAllListeners();
      }
    };
  }, []);
  
  return (
    <BrowserRouter>
      <MobileLayout>
        <Routes>
          <Route path="/" element={<MobileHome />} />
          <Route path="/mobile" element={<Navigate to="/" replace />} />
          <Route path="/scan" element={<ProductScan />} />
          <Route path="/mobile/scan" element={<Navigate to="/scan" replace />} />
          {/* Add more routes for the mobile app here */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MobileLayout>
    </BrowserRouter>
  );
};

export default MobileApp;
