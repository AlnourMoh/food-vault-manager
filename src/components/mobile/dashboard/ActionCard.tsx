
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  iconColor: string;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ 
  icon: Icon, 
  title, 
  iconColor, 
  onClick 
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <Button 
          variant="ghost" 
          className="w-full h-full flex items-center justify-center gap-2 p-6" 
          onClick={onClick}
        >
          <Icon className={`h-6 w-6 ${iconColor}`} />
          <span className="text-lg">{title}</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActionCard;
