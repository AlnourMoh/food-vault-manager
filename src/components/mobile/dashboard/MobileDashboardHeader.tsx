
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface MobileDashboardHeaderProps {
  teamMemberName: string;
  onLogout: () => void;
}

const MobileDashboardHeader: React.FC<MobileDashboardHeaderProps> = ({ 
  teamMemberName, 
  onLogout 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-bold">مرحبًا، {teamMemberName}</h1>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1 text-red-500 border-red-200 hover:bg-red-50"
        onClick={onLogout}
      >
        <LogOut className="h-4 w-4" />
        <span>تسجيل الخروج</span>
      </Button>
    </div>
  );
};

export default MobileDashboardHeader;
