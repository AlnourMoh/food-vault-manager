
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { DesktopRoutes } from './routes/DesktopRoutes';
import { Toaster } from './components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import Tailwind CSS
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <DesktopRoutes />
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
