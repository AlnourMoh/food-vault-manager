
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard,
  Store,
  LogOut,
  User,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    { 
      name: 'لوحة التحكم', 
      path: '/admin', 
      icon: <LayoutDashboard className="ml-2 h-5 w-5" /> 
    },
    { 
      name: 'المطاعم', 
      path: '/admin/restaurants', 
      icon: <Store className="ml-2 h-5 w-5" /> 
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAdminLogin');
    navigate('/');
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const isAdminDashboard = location.pathname === '/admin';

  return (
    <div className="rtl flex h-screen overflow-hidden">
      <div className="flex h-screen w-64 flex-col bg-sidebar">
        <div className="flex h-14 items-center px-4 border-b border-sidebar-border">
          <h2 className="text-lg font-semibold text-sidebar-foreground text-center w-full">
            لوحة تحكم الإدارة
          </h2>
        </div>
        
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 gap-1">
            {menuItems.map((item, index) => (
              <Link 
                key={index}
                to={item.path}
                className={cn(
                  "flex items-center gap-1 rounded-md px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                  location.pathname === item.path && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        <Separator className="bg-sidebar-border" />
        <div className="p-4">
          <Button 
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>تسجيل الخروج</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="rtl sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-6">
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2">
              {!isAdminDashboard && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleBack}
                  className="flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>رجوع</span>
                </Button>
              )}
              <h3 className="text-xl font-semibold">لوحة تحكم الإدارة</h3>
            </div>
            <div className="text-sm">
              <User className="h-4 w-4 inline mr-1" />
              <span>مدير النظام</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
