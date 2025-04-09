
import React, { useEffect, useState } from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Plus, 
  Copy, 
  Edit, 
  Trash2,
  MoreVertical 
} from 'lucide-react';
import AddMemberDialog from '@/components/team/AddMemberDialog';
import EditMemberDialog from '@/components/team/EditMemberDialog';
import { useStorageTeam } from '@/hooks/useStorageTeam';
import { StorageTeamMember } from '@/types';
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
import { useToast } from '@/hooks/use-toast';

const RestaurantStorageTeam = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<StorageTeamMember | null>(null);
  const restaurantId = localStorage.getItem('restaurantId');
  const { toast } = useToast();
  
  const {
    teamMembers,
    isLoading,
    fetchTeamMembers,
    addTeamMember,
    updateTeamMember,
    lastAddedMember,
    generateWelcomeMessage,
    copyWelcomeMessage
  } = useStorageTeam(restaurantId || undefined);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleAddMember = (data: any) => {
    addTeamMember(data);
  };
  
  const welcomeMessage = generateWelcomeMessage(lastAddedMember);

  const copyMemberInfo = (member: StorageTeamMember) => {
    const memberInfo = `الاسم: ${member.name}
الدور: ${member.role === 'manager' ? 'مدير المخزن' : 'عضو فريق'}
رقم الهاتف: ${member.phone}
البريد الإلكتروني: ${member.email}`;

    navigator.clipboard.writeText(memberInfo);
    toast({
      title: 'تم النسخ',
      description: 'تم نسخ معلومات العضو إلى الحافظة',
    });
  };

  const handleEditMember = (member: StorageTeamMember) => {
    setSelectedMember(member);
    setShowEditDialog(true);
  };

  const handleUpdateMember = (id: string, data: any) => {
    return updateTeamMember(id, data);
  };

  const handleDeleteMember = (member: StorageTeamMember) => {
    // For future implementation
    toast({
      title: 'قريباً',
      description: 'سيتم إضافة خاصية حذف العضو قريباً',
    });
  };

  return (
    <RestaurantLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">فريق المخزن</h1>
          <Button 
            className="bg-fvm-primary hover:bg-fvm-primary-light flex items-center gap-2"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="h-4 w-4" />
            <span>إضافة عضو جديد</span>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>أعضاء فريق المخزن</CardTitle>
            <CardDescription>قائمة بجميع أعضاء فريق المخزن وأدوارهم</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">جاري تحميل البيانات...</div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center py-4">لا يوجد أعضاء في الفريق حالياً</div>
            ) : (
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
                              {member.role === 'manager' ? 'مدير المخزن' : 'عضو فريق'}
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
                                      onClick={() => handleEditMember(member)}
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
                                      onClick={() => handleDeleteMember(member)}
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
                        <ContextMenuContent className="w-48">
                          <ContextMenuItem 
                            onClick={() => copyMemberInfo(member)}
                            className="flex items-center gap-2"
                          >
                            <Copy className="h-4 w-4" />
                            <span>نسخ بيانات العضو</span>
                          </ContextMenuItem>
                          <ContextMenuItem 
                            onClick={() => handleEditMember(member)}
                            className="flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            <span>تعديل بيانات العضو</span>
                          </ContextMenuItem>
                          <ContextMenuSeparator />
                          <ContextMenuItem 
                            onClick={() => handleDeleteMember(member)}
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
            )}
          </CardContent>
        </Card>

        <AddMemberDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAddMember={handleAddMember}
          isLoading={isLoading}
          lastAddedMember={lastAddedMember}
          onCopyWelcomeMessage={copyWelcomeMessage}
          welcomeMessage={welcomeMessage}
        />

        <EditMemberDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          member={selectedMember}
          onUpdateMember={handleUpdateMember}
          isLoading={isLoading}
        />
      </div>
    </RestaurantLayout>
  );
};

export default RestaurantStorageTeam;
