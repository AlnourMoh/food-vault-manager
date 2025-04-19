
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
      icon: <BuildingIcon className="ml-2 h-5 w-5 text-white" /> 
    },
    { 
      name: 'التقارير', 
      path: '/reports', 
      icon: <Check className="ml-2 h-5 w-5 text-white" /> 
    },
  ];

  return (
    <div className={cn(
      "flex h-16 w-full flex-row items-center justify-between bg-fvm-primary border-b border-fvm-secondary px-4 shadow-sm",
      className
    )}>
      {/* Project Title */}
      <div className="flex items-center">
        <h2 className="text-xl font-bold text-white tracking-tight">
          هايجين تيك
        </h2>
        <span className="text-sm text-white font-medium mr-2">
          لإدارة مخازن الأغذية
        </span>
      </div>

      {/* Main Navigation */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-white hover:text-white hover:bg-fvm-primary-light"
            >
              <span>القائمة</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-fvm-primary text-white">
            {adminMenuItems.map((item, index) => (
              <DropdownMenuItem key={index} asChild>
                <Link 
                  to={item.path}
                  className={cn(
                    "flex w-full items-center gap-3 px-2 py-2 text-white hover:bg-fvm-primary-light",
                    location.pathname === item.path && "bg-fvm-primary-light"
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </DropdownMenuItem>
            ))}
            <Separator className="my-2 bg-white/20" />
            {/* Quick Stats */}
            <div className="px-2 py-2 bg-fvm-primary-light/30">
              <h3 className="text-sm font-medium mb-2 text-white">إحصائيات سريعة</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">المطاعم النشطة</span>
                  <span className="text-sm font-medium text-white">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">المنتجات</span>
                  <span className="text-sm font-medium text-white">156</span>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Version and Logout */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/80">
            الإصدار 1.0.0
          </span>
          <Button 
            variant="destructive" 
            size="sm"
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
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
