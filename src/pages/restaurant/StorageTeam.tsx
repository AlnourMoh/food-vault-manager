
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
import { generateWelcomeMessage } from '@/utils/welcomeMessageUtils';

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
    copyWelcomeMessage
  } = useStorageTeam(restaurantId || undefined);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleAddMember = (data: TeamMemberFormData) => {
    addTeamMember(data);
  };
  
  const welcomeMessage = generateWelcomeMessage(lastAddedMember);

  const handleEditMember = (member: StorageTeamMember) => {
    setSelectedMember(member);
    setShowEditDialog(true);
  };

  const handleUpdateMember = (id: string, data: TeamMemberFormData) => {
    return updateTeamMember(id, data);
  };

  const handleDeleteMember = (member: StorageTeamMember) => {
    // For future implementation
    toast({
      title: 'قريباً',
      description: 'سيتم إضافة خاصية حذف العضو قريباً',
    });
  };

  // New handler for copying welcome message for an existing member
  const handleCopyWelcomeMessageForMember = (member: StorageTeamMember) => {
    // Convert StorageTeamMember to the format expected by the copyWelcomeMessage function
    const memberData: TeamMemberFormData = {
      name: member.name,
      email: member.email,
      role: member.role,
      phoneCountryCode: member.phone?.substring(1, 3) || '',
      phoneNumber: member.phone?.substring(3) || '',
    };
    
    copyWelcomeMessage(memberData);
  };

  // Helper function to generate welcome message for any team member
  const generateWelcomeMessageForMember = (member: StorageTeamMember) => {
    if (!member) return '';
    
    // Extract phone country code and number from full phone
    const phoneCountryCode = member.phone?.substring(1, 3) || '';
    const phoneNumber = member.phone?.substring(3) || '';
    
    return `مرحباً ${member.name}،

نرحب بك في فريق إدارة المخزن. لتتمكن من الوصول إلى تطبيق إدارة المخزن، يرجى اتباع الخطوات التالية:

1. قم بتحميل تطبيق إدارة المخزن من الرابط: https://storage-app.example.com/download
2. عند فتح التطبيق، قم بإدخال البريد الإلكتروني أو رقم الهاتف الذي تم تسجيلك به: ${member.email || member.phone}
3. قم بإنشاء كلمة مرور خاصة بك للدخول إلى النظام
4. بعد تسجيل الدخول، يمكنك البدء في استخدام النظام وإدارة المخزن

إذا كان لديك أي استفسار، لا تتردد في التواصل مع مدير النظام.

مع تحياتنا،
فريق إدارة المخزن`;
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
