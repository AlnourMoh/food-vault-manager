
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MobileSectionHeaderProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
}

const MobileSectionHeader: React.FC<MobileSectionHeaderProps> = ({
  icon: Icon,
  title,
  description
}) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon className="h-6 w-6 text-primary" />}
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
};

export default MobileSectionHeader;
