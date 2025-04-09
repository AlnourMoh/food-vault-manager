
import React from 'react';
import { StorageTeamMember } from '@/types';
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { Copy, Edit, MessageSquare, Trash2 } from 'lucide-react';

interface MemberContextMenuProps {
  member: StorageTeamMember;
  onCopyMemberInfo: (member: StorageTeamMember) => void;
  onCopyWelcomeMessage: (member: StorageTeamMember) => void;
  onEditMember: (member: StorageTeamMember) => void;
  onDeleteMember: (member: StorageTeamMember) => void;
}

const MemberContextMenu: React.FC<MemberContextMenuProps> = ({
  member,
  onCopyMemberInfo,
  onCopyWelcomeMessage,
  onEditMember,
  onDeleteMember
}) => {
  return (
    <ContextMenuContent className="w-64">
      <ContextMenuItem 
        onClick={() => onCopyMemberInfo(member)}
        className="flex items-center gap-2"
      >
        <Copy className="h-4 w-4" />
        <span>نسخ بيانات العضو</span>
      </ContextMenuItem>
      <ContextMenuItem 
        onClick={() => onCopyWelcomeMessage(member)}
        className="flex items-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        <span>نسخ رسالة الترحيب</span>
      </ContextMenuItem>
      <ContextMenuItem 
        onClick={() => onEditMember(member)}
        className="flex items-center gap-2"
      >
        <Edit className="h-4 w-4" />
        <span>تعديل بيانات العضو</span>
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem 
        onClick={() => onDeleteMember(member)}
        className="flex items-center gap-2 text-destructive focus:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
        <span>حذف العضو</span>
      </ContextMenuItem>
    </ContextMenuContent>
  );
};

export default MemberContextMenu;
