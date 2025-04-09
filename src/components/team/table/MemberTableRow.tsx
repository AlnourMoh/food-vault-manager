
import React from 'react';
import { StorageTeamMember } from '@/types';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import MemberContextMenu from './MemberContextMenu';
import MemberActionButtons from './MemberActionButtons';

interface MemberTableRowProps {
  member: StorageTeamMember;
  onCopyMemberInfo: (member: StorageTeamMember) => void;
  onCopyWelcomeMessage: (member: StorageTeamMember) => void;
  onEditMember: (member: StorageTeamMember) => void;
  onDeleteMember: (member: StorageTeamMember) => void;
}

const MemberTableRow: React.FC<MemberTableRowProps> = ({
  member,
  onCopyMemberInfo,
  onCopyWelcomeMessage,
  onEditMember,
  onDeleteMember
}) => {
  return (
    <ContextMenu key={member.id}>
      <ContextMenuTrigger asChild>
        <TableRow className="cursor-default">
          <TableCell className="font-medium">{member.name}</TableCell>
          <TableCell>
            {member.role === 'manager' ? 'إدارة النظام' : 'إدارة المخزن'}
          </TableCell>
          <TableCell dir="ltr" className="text-right">{member.phone}</TableCell>
          <TableCell>{member.email}</TableCell>
          <TableCell>
            <MemberActionButtons 
              member={member}
              onCopyMemberInfo={onCopyMemberInfo}
              onCopyWelcomeMessage={onCopyWelcomeMessage}
              onEditMember={onEditMember}
              onDeleteMember={onDeleteMember}
            />
          </TableCell>
        </TableRow>
      </ContextMenuTrigger>
      <MemberContextMenu 
        member={member}
        onCopyMemberInfo={onCopyMemberInfo}
        onCopyWelcomeMessage={onCopyWelcomeMessage}
        onEditMember={onEditMember}
        onDeleteMember={onDeleteMember}
      />
    </ContextMenu>
  );
};

export default MemberTableRow;
