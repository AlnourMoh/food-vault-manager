import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BarcodeIcon, User, ArrowRight } from 'lucide-react';
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
        <h1 className="text-lg font-bold">مخزن الطعام</h1>
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
            className={`flex flex-col items-center justify-center p-3 rounded-full -mt-8 bg-primary hover:bg-primary/90 shadow-lg transition-all w-24 ${
              isActive('/mobile/scan') ? 'bg-primary/90 scale-95' : ''
            }`}
            onClick={() => navigate('/mobile/scan')}
          >
            <BarcodeIcon className="h-6 w-6 text-primary-foreground" />
            <span className="text-xs mt-1 text-primary-foreground font-medium">امسح لادخال المنتج</span>
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
