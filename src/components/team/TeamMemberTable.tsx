
import React from 'react';
import { StorageTeamMember } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';
import MemberTableRow from './table/MemberTableRow';
import { formatMemberInfoForCopy } from './utils/memberUtils';

interface TeamMemberTableProps {
  teamMembers: StorageTeamMember[];
  isLoading: boolean;
  onEditMember: (member: StorageTeamMember) => void;
  onDeleteMember: (member: StorageTeamMember) => void;
  onCopyWelcomeMessage: (member: StorageTeamMember) => void;
  generateWelcomeMessage: (member: StorageTeamMember) => string;
}

const TeamMemberTable: React.FC<TeamMemberTableProps> = ({
  teamMembers,
  isLoading,
  onEditMember,
  onDeleteMember,
  onCopyWelcomeMessage,
  generateWelcomeMessage
}) => {
  const { toast } = useToast();

  const copyMemberInfo = (member: StorageTeamMember) => {
    const memberInfo = formatMemberInfoForCopy(member);
    navigator.clipboard.writeText(memberInfo);
    toast({
      title: 'تم النسخ',
      description: 'تم نسخ معلومات العضو إلى الحافظة',
    });
  };

  const copyMemberWelcomeMessage = (member: StorageTeamMember) => {
    onCopyWelcomeMessage(member);
  };

  if (isLoading) {
    return <div className="text-center py-4">جاري تحميل البيانات...</div>;
  }

  if (teamMembers.length === 0) {
    return <div className="text-center py-4">لا يوجد أعضاء في الفريق حالياً</div>;
  }

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">الاسم</TableHead>
            <TableHead className="text-right">الدور</TableHead>
            <TableHead className="text-right">رقم الهاتف</TableHead>
            <TableHead className="text-right">البريد الإلكتروني</TableHead>
            <TableHead className="text-right">خيارات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamMembers.map((member) => (
            <MemberTableRow
              key={member.id}
              member={member}
              onCopyMemberInfo={copyMemberInfo}
              onCopyWelcomeMessage={copyMemberWelcomeMessage}
              onEditMember={onEditMember}
              onDeleteMember={onDeleteMember}
            />
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
};

export default TeamMemberTable;
