
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TeamHeaderProps {
  onAddMember: () => void;
}

const TeamHeader: React.FC<TeamHeaderProps> = ({ onAddMember }) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">فريق المخزن</h1>
      <Button 
        className="bg-fvm-primary hover:bg-fvm-primary-light flex items-center gap-2"
        onClick={onAddMember}
      >
        <Plus className="h-4 w-4" />
        <span>إضافة عضو جديد</span>
      </Button>
    </div>
  );
};

export default TeamHeader;
