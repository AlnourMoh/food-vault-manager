
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
  LogOut
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
  
  // استرجاع معرف المطعم من التخزين المحلي
  const restaurantId = localStorage.getItem('restaurantId');
  
  // استخدام hook لاسترجاع بيانات المطعم
  const { restaurantName, isLoading } = useRestaurantData(restaurantId);

  // Restaurant menu items
  const menuItems = [
    { 
      name: 'لوحة التحكم', 
      path: '/restaurant/dashboard', 
      icon: <Home className="ml-2 h-5 w-5" /> 
    },
    { 
      name: 'فريق المخزن', 
      path: '/restaurant/storage-team', 
      icon: <Users className="ml-2 h-5 w-5" /> 
    },
    { 
      name: 'إدخال المنتجات', 
      path: '/restaurant/products/add', 
      icon: <ArrowDown className="ml-2 h-5 w-5" /> 
    },
    { 
      name: 'إخراج المنتجات', 
      path: '/restaurant/products/remove', 
      icon: <ArrowUp className="ml-2 h-5 w-5" /> 
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
      icon: <Check className="ml-2 h-5 w-5" /> 
    },
  ];

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('restaurantId');
    localStorage.removeItem('isRestaurantLogin');
    // Redirect to login page
    navigate('/restaurant/login');
  };

  return (
    <div className="rtl flex h-screen overflow-hidden">
      <div className="flex h-screen w-64 flex-col bg-sidebar">
        <div className="flex h-14 items-center px-4 border-b border-sidebar-border">
          <h2 className="text-lg font-semibold text-sidebar-foreground text-center w-full">
            نظام إدارة المطعم
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
            <h3 className="text-xl font-semibold">إدارة المطعم</h3>
            <div className="text-sm">
              {/* عرض اسم المطعم من قاعدة البيانات */}
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
