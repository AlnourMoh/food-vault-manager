
import React, { useState } from 'react';

interface NetworkDetailsProps {
  url?: string;
  errorCode?: string;
  showDetails: boolean;
  onToggleDetails: () => void;
}

const NetworkDetails: React.FC<NetworkDetailsProps> = ({ 
  url, 
  errorCode, 
  showDetails, 
  onToggleDetails 
}) => {
  return (
    <div className="mt-8 text-xs text-muted-foreground">
      <button 
        className="text-primary hover:underline" 
        onClick={onToggleDetails}
      >
        {showDetails ? 'إخفاء التفاصيل التقنية' : 'عرض التفاصيل التقنية'}
      </button>
      
      {showDetails && (
        <div className="mt-2 bg-muted p-2 rounded text-left font-mono text-xs overflow-x-auto">
          <p>User Agent: {navigator.userAgent}</p>
          <p>App Version: FoodVaultManager/1.0.0</p>
          <p>URL: {url || window.location.href}</p>
          <p>Error Code: {errorCode || 'Unknown'}</p>
          <p>Connection Type: {navigator.onLine ? 'Online' : 'Offline'}</p>
        </div>
      )}
    </div>
  );
};

export default NetworkDetails;
