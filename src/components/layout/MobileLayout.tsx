
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BarcodeIcon, User, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const isMobileHomePage = location.pathname === '/mobile';
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background p-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">المطعم</h1>
        {!isMobileHomePage && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="flex items-center gap-1 rtl:flex-row-reverse"
          >
            <ArrowRight className="h-4 w-4" />
            <span>رجوع</span>
          </Button>
        )}
      </header>
      
      <main className="flex-1 pb-16">
        {children}
      </main>
      
      <nav className="fixed bottom-0 inset-x-0 z-10 bg-background border-t">
        <div className="flex justify-around items-center h-16 relative">
          <button 
            className={`flex flex-col items-center justify-center p-2 ${isActive('/mobile') ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => navigate('/mobile')}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">الرئيسية</span>
          </button>
          
          <button 
            className={`flex flex-col items-center justify-center p-3 rounded-2xl -mt-8 
              bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70
              shadow-lg transition-all duration-300 w-28 group relative overflow-hidden
              ${isActive('/mobile/scan') ? 'scale-95 from-primary/90 to-primary/70' : ''}`}
            onClick={() => navigate('/mobile/scan')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex flex-col items-center">
              <div className="flex items-center gap-1">
                <BarcodeIcon className="h-6 w-6 text-primary-foreground" />
                <Sparkles className="h-4 w-4 text-primary-foreground animate-pulse" />
              </div>
              <span className="text-xs mt-1 text-primary-foreground font-medium whitespace-nowrap">امسح لادخال المنتج</span>
            </div>
          </button>
          
          <button 
            className={`flex flex-col items-center justify-center p-2 ${isActive('/mobile/account') ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => navigate('/mobile/account')}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">حسابي</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default MobileLayout;

