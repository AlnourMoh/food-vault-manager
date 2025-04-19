
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
      "rtl flex h-screen w-64 flex-col bg-background border-l shadow-sm", 
      className
    )}>
      <div className="flex h-20 items-center justify-center px-6 border-b bg-primary/5">
        <div className="text-center">
          <h2 className="text-xl font-bold text-primary tracking-tight">
            هايجين تيك
          </h2>
          <span className="block text-sm text-muted-foreground font-medium mt-1">
            لإدارة مخازن الأغذية
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-8">
        <nav className="space-y-2 px-4">
          {adminMenuItems.map((item, index) => (
            <Link 
              key={index}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3.5 text-base font-medium text-foreground hover:bg-accent/80 hover:text-accent-foreground transition-all duration-200",
                location.pathname === item.path && "bg-accent text-accent-foreground shadow-sm"
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

