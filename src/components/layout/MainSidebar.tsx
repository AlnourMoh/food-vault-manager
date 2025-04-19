
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
      icon: <BuildingIcon className="ml-2 h-4 w-4" /> 
    },
    { 
      name: 'التقارير', 
      path: '/reports', 
      icon: <Check className="ml-2 h-4 w-4" /> 
    },
  ];

  return (
    <div className={cn(
      "rtl flex h-screen w-48 flex-col bg-background border-l", 
      className
    )}>
      <div className="flex h-14 items-center justify-center px-3 border-b">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary">
            هايجين تيك
          </h2>
          <span className="block text-xs text-muted-foreground">
            لإدارة مخازن الأغذية
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          {adminMenuItems.map((item, index) => (
            <Link 
              key={index}
              to={item.path}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
                location.pathname === item.path && "bg-accent text-accent-foreground font-medium"
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

