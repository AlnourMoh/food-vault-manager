
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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { Copy, Edit, MessageSquare, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    const memberInfo = `الاسم: ${member.name}
الدور: ${member.role === 'manager' ? 'إدارة النظام' : 'إدارة المخزن'}
رقم الهاتف: ${member.phone}
البريد الإلكتروني: ${member.email}`;

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
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => copyMemberInfo(member)}
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
                            onClick={() => copyMemberWelcomeMessage(member)}
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
                  </TableCell>
                </TableRow>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-64">
                <ContextMenuItem 
                  onClick={() => copyMemberInfo(member)}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>نسخ بيانات العضو</span>
                </ContextMenuItem>
                <ContextMenuItem 
                  onClick={() => copyMemberWelcomeMessage(member)}
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
            </ContextMenu>
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
};

export default TeamMemberTable;
