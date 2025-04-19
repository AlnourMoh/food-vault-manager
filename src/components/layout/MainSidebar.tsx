
import React from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { BuildingIcon, Check, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface MainSidebarProps {
  className?: string;
}

const MainSidebar: React.FC<MainSidebarProps> = ({ className }) => {
  const location = useLocation();
  
  const adminMenuItems = [
    { 
      name: 'المطاعم', 
      path: '/restaurants', 
      icon: <BuildingIcon className="ml-2 h-5 w-5" /> 
    },
    { 
      name: 'التقارير', 
      path: '/reports', 
      icon: <Check className="ml-2 h-5 w-5" /> 
    },
  ];

  return (
    <div className={cn(
      "rtl flex h-screen flex-col bg-sidebar text-sidebar-foreground", 
      className
    )}>
      {/* Project Title - Elegant header */}
      <div className="flex h-20 items-center justify-center px-6 border-b border-sidebar-border bg-sidebar-accent/5">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-sidebar-foreground tracking-tight">
            هايجين تيك
          </h2>
          <span className="block text-sm text-sidebar-foreground/70 font-medium mt-1">
            لإدارة مخازن الأغذية
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-6">
        <nav className="space-y-1 px-3">
          {adminMenuItems.map((item, index) => (
            <Link 
              key={index}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all duration-200",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                location.pathname === item.path ? 
                  "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" : 
                  "text-sidebar-foreground"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Stats Section */}
        <div className="mt-8 px-4">
          <div className="rounded-lg bg-sidebar-accent/5 p-4 space-y-4">
            <h3 className="text-sm font-medium text-sidebar-foreground">إحصائيات سريعة</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-sidebar-foreground/70">عدد المطاعم النشطة</span>
                <span className="text-sm font-medium text-sidebar-foreground">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-sidebar-foreground/70">المنتجات المسجلة</span>
                <span className="text-sm font-medium text-sidebar-foreground">156</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-auto p-4">
        <Separator className="mb-4 bg-sidebar-border" />
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm text-sidebar-foreground/70">الإصدار</span>
            <span className="text-sm font-medium text-sidebar-foreground">1.0.0</span>
          </div>
          <Button 
            variant="destructive" 
            className="w-full flex items-center gap-2 justify-center"
          >
            <LogOut className="h-4 w-4" />
            <span>تسجيل الخروج</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainSidebar;
