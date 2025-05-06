
import { useState, useEffect } from 'react';

interface RetryState {
  retryCount: number;
  lastRetryTime: number;
  resetRetryCount: () => void;
  incrementRetryCount: () => void;
  updateRetryTime: () => void;
}

export const useRetryState = (): RetryState => {
  const [retryCount, setRetryCount] = useState(0);
  const [lastRetryTime, setLastRetryTime] = useState(0);

  const resetRetryCount = () => setRetryCount(0);
  const incrementRetryCount = () => setRetryCount(prev => prev + 1);
  const updateRetryTime = () => setLastRetryTime(Date.now());

  return {
    retryCount,
    lastRetryTime,
    resetRetryCount,
    incrementRetryCount,
    updateRetryTime
  };
};
