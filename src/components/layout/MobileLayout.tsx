
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BarcodeIcon, ShoppingCart, Menu, User } from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background p-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">مخزن الطعام</h1>
      </header>
      
      {/* Main content */}
      <main className="flex-1 pb-16">
        {children}
      </main>
      
      {/* Bottom navigation */}
      <nav className="fixed bottom-0 inset-x-0 z-10 bg-background border-t">
        <div className="flex justify-around items-center h-16">
          <button 
            className={`flex flex-col items-center justify-center p-2 ${isActive('/mobile') ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => navigate('/mobile')}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">الرئيسية</span>
          </button>
          
          <button 
            className={`flex flex-col items-center justify-center p-2 ${isActive('/mobile/scan') ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => navigate('/mobile/scan')}
          >
            <BarcodeIcon className="h-5 w-5" />
            <span className="text-xs mt-1">المسح</span>
          </button>
          
          <button 
            className={`flex flex-col items-center justify-center p-2 ${isActive('/mobile/inventory') ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => navigate('/mobile/inventory')}
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="text-xs mt-1">المخزون</span>
          </button>
          
          <button 
            className={`flex flex-col items-center justify-center p-2 ${isActive('/mobile/menu') ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => navigate('/mobile/menu')}
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs mt-1">القائمة</span>
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
