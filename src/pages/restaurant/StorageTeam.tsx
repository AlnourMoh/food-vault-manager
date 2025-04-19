
import React, { useState } from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { useStorageTeamManager } from '@/hooks/team/useStorageTeamManager';
import TeamHeader from '@/components/team/TeamHeader';
import TeamContent from '@/components/team/TeamContent';
import AddMemberDialog from '@/components/team/AddMemberDialog';
import EditMemberDialog from '@/components/team/EditMemberDialog';
import DeleteMemberDialog from '@/components/team/DeleteMemberDialog';
import { generateWelcomeMessage } from '@/utils/welcomeMessageUtils';
import { StorageTeamMember } from '@/types';
import { TeamMemberFormData } from '@/types/team';

const RestaurantStorageTeam = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<StorageTeamMember | null>(null);
  const restaurantId = localStorage.getItem('restaurantId');

  const {
    teamMembers,
    isLoading,
    lastAddedMember,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    phoneError,
    emailError,
    resetErrors
  } = useStorageTeamManager(restaurantId || undefined);

  const copyWelcomeMessage = (member: StorageTeamMember) => {
    // Convert StorageTeamMember to TeamMemberFormData format
    const memberData: TeamMemberFormData = {
      name: member.name,
      role: member.role === 'manager' ? 'إدارة النظام' : 'إدارة المخزن',
      phoneCountryCode: member.phone.substring(1, 4),
      phoneNumber: member.phone.substring(4),
      email: member.email
    };
    const message = generateWelcomeMessage(memberData);
    navigator.clipboard.writeText(message);
  };

  const handleEditMember = (member: StorageTeamMember) => {
    setSelectedMember(member);
    setShowEditDialog(true);
  };

  const handleDeleteMember = (member: StorageTeamMember) => {
    setSelectedMember(member);
    setShowDeleteDialog(true);
  };

  const generateWelcomeMessageForTeamMember = (member: StorageTeamMember) => {
    const memberData: TeamMemberFormData = {
      name: member.name,
      role: member.role === 'manager' ? 'إدارة النظام' : 'إدارة المخزن',
      phoneCountryCode: member.phone.substring(1, 4),
      phoneNumber: member.phone.substring(4),
      email: member.email
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
          onCopyWelcomeMessage={copyWelcomeMessage}
          generateWelcomeMessage={generateWelcomeMessageForTeamMember}
        />

        <AddMemberDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAddMember={addTeamMember}
          isLoading={isLoading}
          lastAddedMember={lastAddedMember}
          phoneError={phoneError}
          emailError={emailError}
          onResetErrors={resetErrors}
          onCopyWelcomeMessage={copyWelcomeMessage}
          welcomeMessage={lastAddedMember ? generateWelcomeMessage(lastAddedMember) : ''}
        />

        <EditMemberDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          member={selectedMember}
          onUpdateMember={updateTeamMember}
          isLoading={isLoading}
          phoneError={phoneError}
          emailError={emailError}
          onResetErrors={resetErrors}
        />

        <DeleteMemberDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          member={selectedMember}
          onDeleteMember={deleteTeamMember}
          isLoading={isLoading}
        />
      </div>
    </RestaurantLayout>
  );
};

export default RestaurantStorageTeam;
