
import React from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Archive, 
  Box, 
  Calendar, 
  Check, 
  Folder, 
  Plus, 
  TrashIcon, 
  ArrowUp, 
  ArrowDown 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface MainSidebarProps {
  className?: string;
}

const MainSidebar: React.FC<MainSidebarProps> = ({ className }) => {
  const location = useLocation();
  
  const menuItems = [
    { 
      name: 'لوحة التحكم', 
      path: '/', 
      icon: <Folder className="ml-2 h-5 w-5" /> 
    },
    { 
      name: 'المطاعم', 
      path: '/restaurants', 
      icon: <Box className="ml-2 h-5 w-5" /> 
    },
    { 
      name: 'فريق المخزن', 
      path: '/storage-team', 
      icon: <Calendar className="ml-2 h-5 w-5" /> 
    },
    { 
      name: 'إدخال المنتجات', 
      path: '/products/add', 
      icon: <ArrowDown className="ml-2 h-5 w-5" /> 
    },
    { 
      name: 'إخراج المنتجات', 
      path: '/products/remove', 
      icon: <ArrowUp className="ml-2 h-5 w-5" /> 
    },
    { 
      name: 'المخزون', 
      path: '/inventory', 
      icon: <Archive className="ml-2 h-5 w-5" /> 
    },
    { 
      name: 'المنتجات المنتهية', 
      path: '/expired', 
      icon: <TrashIcon className="ml-2 h-5 w-5" /> 
    },
    { 
      name: 'التقارير', 
      path: '/reports', 
      icon: <Check className="ml-2 h-5 w-5" /> 
    },
  ];

  return (
    <div className={cn("rtl flex h-screen w-64 flex-col bg-sidebar", className)}>
      <div className="flex h-14 items-center px-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground text-center w-full">
          نظام إدارة مخازن الأغذية
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
        <Button className="w-full bg-fvm-primary text-white hover:bg-fvm-primary-light flex items-center justify-center gap-2">
          <Plus className="h-4 w-4" />
          <span>إضافة مطعم جديد</span>
        </Button>
      </div>
    </div>
  );
};

export default MainSidebar;
