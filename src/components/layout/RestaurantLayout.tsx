import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Archive, 
  ArrowDown, 
  ArrowUp, 
  TrashIcon, 
  Check,
  Users,
  Home,
  LogOut,
  ArrowRight,
  User,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useRestaurantData } from '@/hooks/useRestaurantData';

interface RestaurantLayoutProps {
  children: React.ReactNode;
}

const RestaurantLayout: React.FC<RestaurantLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const restaurantId = localStorage.getItem('restaurantId');
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');
  
  const { restaurantName, isLoading } = useRestaurantData(restaurantId);

  const menuItems = [
    { 
      name: 'لوحة التحكم', 
      path: '/restaurant/dashboard', 
      icon: <Home className="ml-2 h-5 w-5" /> 
    },
    { 
      name: 'فريق المخزن', 
      path: '/restaurant/team', 
      icon: <Users className="ml-2 h-5 w-5" /> 
    },
    { 
      name: 'المخزون', 
      path: '/restaurant/inventory', 
      icon: <Archive className="ml-2 h-5 w-5" /> 
    },
    { 
      name: 'المنتجات المنتهية', 
      path: '/restaurant/expired', 
      icon: <TrashIcon className="ml-2 h-5 w-5" /> 
    },
    { 
      name: 'التقارير', 
      path: '/restaurant/reports', 
      icon: <BarChart className="ml-2 h-5 w-5" /> 
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('restaurantId');
    localStorage.removeItem('isRestaurantLogin');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    
    // توجيه المستخدم إلى الصفحة الرئيسية بدلاً من صفحة تسجيل دخول المطعم
    navigate('/');
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const isRestaurantDashboard = location.pathname === '/restaurant/dashboard';

  return (
    <div className="rtl flex h-screen overflow-hidden">
      <div className="flex h-screen w-64 flex-col bg-sidebar">
        <div className="flex h-14 items-center px-4 border-b border-sidebar-border">
          <h2 className="text-lg font-semibold text-sidebar-foreground text-center w-full">
            نظام إدارة المطعم
          </h2>
        </div>
        
        {userName && (
          <div className="px-4 py-2 bg-sidebar-accent bg-opacity-20">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-sidebar-foreground" />
              <span className="text-sm font-medium text-sidebar-foreground">{userName}</span>
            </div>
            <div className="text-xs text-sidebar-foreground opacity-75 mt-1">
              {userRole === 'admin' ? 'مدير النظام' : userRole === 'staff' ? 'إدارة المخزن' : 'مستخدم'}
            </div>
          </div>
        )}
        
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
              {!isRestaurantDashboard && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleBack}
                  className="flex items-center gap-1"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>رجوع</span>
                </Button>
              )}
              <h3 className="text-xl font-semibold">إدارة المطعم</h3>
            </div>
            <div className="text-sm">
              {isLoading ? (
                <span className="text-muted-foreground">جاري تحميل بيانات المطعم...</span>
              ) : (
                restaurantName || 'المطعم'
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default RestaurantLayout;
