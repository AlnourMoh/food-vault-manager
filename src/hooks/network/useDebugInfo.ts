
import { useState } from 'react';

export const useDebugInfo = () => {
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  return {
    showDebugInfo,
    setShowDebugInfo
  };
};
