
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

import { DesktopRoutes } from "./routes/DesktopRoutes";
import { MobileRoutes } from "./routes/MobileRoutes";
import MobileInventory from '@/pages/mobile/MobileInventory';

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
            <Routes>
              {/* صفحات مباشرة لتسهيل الوصول من الهاتف المحمول */}
              <Route path="/inventory" element={<MobileInventory />} />
              
              {/* المسارات الأخرى */}
              <Route path="/*" element={isMobile ? <MobileRoutes /> : <DesktopRoutes />} />
            </Routes>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
