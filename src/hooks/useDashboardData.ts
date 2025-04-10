
import { useState, useEffect } from 'react';

export const useDashboardData = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showMobileApp, setShowMobileApp] = useState(false);
  
  useEffect(() => {
    // Check if the user is viewing from a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setShowMobileApp(isMobile);
  }, []);
  
  return {
    activeTab,
    setActiveTab,
    showMobileApp
  };
};
