
import React from 'react';
import { StorageTeamMember } from '@/types';
import { Button } from '@/components/ui/button';
import { Copy, Edit, MessageSquare, Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MemberActionButtonsProps {
  member: StorageTeamMember;
  onCopyMemberInfo: (member: StorageTeamMember) => void;
  onCopyWelcomeMessage: (member: StorageTeamMember) => void;
  onEditMember: (member: StorageTeamMember) => void;
  onDeleteMember: (member: StorageTeamMember) => void;
}

const MemberActionButtons: React.FC<MemberActionButtonsProps> = ({
  member,
  onCopyMemberInfo,
  onCopyWelcomeMessage,
  onEditMember,
  onDeleteMember
}) => {
  return (
    <div className="flex space-x-2 rtl:space-x-reverse">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onCopyMemberInfo(member)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>نسخ بيانات العضو</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onCopyWelcomeMessage(member)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>نسخ رسالة الترحيب</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onEditMember(member)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>تعديل بيانات العضو</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onDeleteMember(member)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>حذف العضو</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default MemberActionButtons;
