
import React from 'react';
import { useBackButtonHandler } from '@/hooks/mobile/useBackButtonHandler';
import { useNetworkConnectionHandler } from '@/hooks/mobile/useNetworkConnectionHandler';
import { AppRoutes } from './routes/AppRoutes';
import { AuthRoutes } from './routes/AuthRoutes';
import NetworkErrorView from './NetworkErrorView';

const MobileApp: React.FC = () => {
  // Use our custom hooks
  useBackButtonHandler();
  const { networkError, handleRetryConnection } = useNetworkConnectionHandler();
  
  // Check authentication state
  const isRestaurantLoggedIn = localStorage.getItem('isRestaurantLogin') === 'true';
  
  // If there's a network error, show network error view
  if (networkError.show) {
    return (
      <NetworkErrorView 
        onRetry={handleRetryConnection}
        errorCode={networkError.errorCode}
        additionalInfo={networkError.additionalInfo}
        url={networkError.url}
      />
    );
  }
  
  // Render authentication routes or main app routes based on login state
  return isRestaurantLoggedIn ? <AppRoutes /> : <AuthRoutes />;
};

export default MobileApp;
