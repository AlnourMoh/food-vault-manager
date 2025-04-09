
import React, { useEffect, useState } from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { useStorageTeam } from '@/hooks/useStorageTeam';
import { StorageTeamMember } from '@/types';
import { TeamMemberFormData } from '@/types/team';
import { useToast } from '@/hooks/use-toast';
import TeamHeader from '@/components/team/TeamHeader';
import TeamContent from '@/components/team/TeamContent';
import AddMemberDialog from '@/components/team/AddMemberDialog';
import EditMemberDialog from '@/components/team/EditMemberDialog';
import DeleteMemberDialog from '@/components/team/DeleteMemberDialog';
import { generateWelcomeMessage } from '@/utils/welcomeMessageUtils';

const RestaurantStorageTeam = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<StorageTeamMember | null>(null);
  const restaurantId = localStorage.getItem('restaurantId');
  const { toast } = useToast();
  
  const {
    teamMembers,
    isLoading,
    fetchTeamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    lastAddedMember,
    copyWelcomeMessage,
    phoneError,
    emailError,
    resetErrors
  } = useStorageTeam(restaurantId || undefined);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleAddMember = async (data: TeamMemberFormData) => {
    return await addTeamMember(data);
  };
  
  const welcomeMessage = generateWelcomeMessage(lastAddedMember);

  const handleEditMember = (member: StorageTeamMember) => {
    setSelectedMember(member);
    setShowEditDialog(true);
  };

  const handleUpdateMember = async (id: string, data: TeamMemberFormData) => {
    return await updateTeamMember(id, data);
  };

  const handleDeleteMember = (member: StorageTeamMember) => {
    setSelectedMember(member);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = (id: string) => {
    return deleteTeamMember(id);
  };

  // مُعالج لنسخ رسالة الترحيب لعضو موجود
  const handleCopyWelcomeMessageForMember = (member: StorageTeamMember) => {
    // تحويل StorageTeamMember إلى الصيغة المتوقعة من قبل وظيفة copyWelcomeMessage
    const memberData: TeamMemberFormData = {
      name: member.name,
      email: member.email,
      // ترجمة دور قاعدة البيانات إلى دور واجهة المستخدم
      role: member.role === 'manager' ? 'إدارة النظام' : 'إدارة المخزن',
      phoneCountryCode: member.phone?.substring(1, 3) || '',
      phoneNumber: member.phone?.substring(3) || '',
    };
    
    copyWelcomeMessage(memberData);
  };

  // وظيفة مساعدة لإنشاء رسالة ترحيب لأي عضو في الفريق
  const generateWelcomeMessageForMember = (member: StorageTeamMember) => {
    if (!member) return '';
    
    // استخراج رمز الدولة ورقم الهاتف من الهاتف الكامل
    const phoneCountryCode = member.phone?.substring(1, 3) || '';
    const phoneNumber = member.phone?.substring(3) || '';
    
    // إنشاء كائن بيانات العضو
    const memberData: TeamMemberFormData = {
      name: member.name,
      email: member.email,
      // ترجمة دور قاعدة البيانات إلى دور واجهة المستخدم
      role: member.role === 'manager' ? 'إدارة النظام' : 'إدارة المخزن',
      phoneCountryCode,
      phoneNumber,
    };
    
    return generateWelcomeMessage(memberData);
  };

  return (
    <RestaurantLayout>
      <div className="space-y-6">
        <TeamHeader onAddMember={() => setShowAddDialog(true)} />
        
        <TeamContent 
          teamMembers={teamMembers}
          isLoading={isLoading}
          onEditMember={handleEditMember}
          onDeleteMember={handleDeleteMember}
          onCopyWelcomeMessage={handleCopyWelcomeMessageForMember}
          generateWelcomeMessage={generateWelcomeMessageForMember}
        />

        <AddMemberDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAddMember={handleAddMember}
          isLoading={isLoading}
          lastAddedMember={lastAddedMember}
          onCopyWelcomeMessage={copyWelcomeMessage}
          welcomeMessage={welcomeMessage}
          phoneError={phoneError}
          emailError={emailError}
          onResetErrors={resetErrors}
        />

        <EditMemberDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          member={selectedMember}
          onUpdateMember={handleUpdateMember}
          isLoading={isLoading}
          phoneError={phoneError}
          emailError={emailError}
          onResetErrors={resetErrors}
        />

        <DeleteMemberDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          member={selectedMember}
          onDeleteMember={handleConfirmDelete}
          isLoading={isLoading}
        />
      </div>
    </RestaurantLayout>
  );
};

export default RestaurantStorageTeam;
