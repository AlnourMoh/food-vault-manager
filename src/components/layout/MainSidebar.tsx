
import React from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { BuildingIcon, Check, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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
      "flex h-16 w-full flex-row items-center justify-between bg-sidebar px-4 text-sidebar-foreground border-b border-sidebar-border",
      className
    )}>
      {/* Project Title */}
      <div className="flex items-center">
        <h2 className="text-xl font-bold text-sidebar-foreground tracking-tight">
          هايجين تيك
        </h2>
        <span className="text-sm text-sidebar-foreground/70 font-medium mr-2">
          لإدارة مخازن الأغذية
        </span>
      </div>

      {/* Main Navigation - Now Horizontal with Dropdown */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <span>القائمة</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {adminMenuItems.map((item, index) => (
              <DropdownMenuItem key={index} asChild>
                <Link 
                  to={item.path}
                  className={cn(
                    "flex w-full items-center gap-3 px-2 py-2",
                    location.pathname === item.path && "bg-sidebar-accent/50"
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </DropdownMenuItem>
            ))}
            <Separator className="my-2" />
            {/* Quick Stats in Dropdown */}
            <div className="px-2 py-2">
              <h3 className="text-sm font-medium mb-2">إحصائيات سريعة</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">المطاعم النشطة</span>
                  <span className="text-sm font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">المنتجات</span>
                  <span className="text-sm font-medium">156</span>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Version and Logout */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-sidebar-foreground/70">
            الإصدار 1.0.0
          </span>
          <Button 
            variant="destructive" 
            size="sm"
            className="flex items-center gap-2"
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
