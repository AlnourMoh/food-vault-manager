
import React from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { BuildingIcon, Check } from 'lucide-react';

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
      "rtl flex h-screen w-64 flex-col bg-background border-l", 
      className
    )}>
      <div className="flex h-16 items-center px-4 border-b">
        <h2 className="text-lg font-semibold text-foreground text-center w-full">
          هايجين تيك
          <span className="block text-sm text-muted-foreground mt-0.5">
            لإدارة مخازن الأغذية
          </span>
        </h2>
      </div>
      <div className="flex-1 overflow-auto py-6">
        <nav className="space-y-2 px-2">
          {adminMenuItems.map((item, index) => (
            <Link 
              key={index}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-md px-4 py-3 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
                location.pathname === item.path && "bg-accent text-accent-foreground font-medium shadow-sm"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MainSidebar;
