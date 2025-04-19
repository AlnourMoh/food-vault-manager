
import React, { useState } from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { useTeamManagement } from '@/hooks/useTeamManagement';
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
  const restaurantId = localStorage.getItem('restaurantId');

  const {
    teamMembers,
    isLoading,
    selectedMember,
    setSelectedMember,
    lastAddedMember,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    phoneError,
    emailError,
    resetErrors
  } = useTeamManagement(restaurantId || undefined);

  const copyWelcomeMessage = (member: any) => {
    const message = generateWelcomeMessage(member);
    navigator.clipboard.writeText(message);
  };

  const handleEditMember = (member: any) => {
    setSelectedMember(member);
    setShowEditDialog(true);
  };

  const handleDeleteMember = (member: any) => {
    setSelectedMember(member);
    setShowDeleteDialog(true);
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

