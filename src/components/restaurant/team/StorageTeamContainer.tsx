
import React from 'react';
import { useStorageTeamPage } from '@/hooks/restaurant/useStorageTeamPage';
import { generateWelcomeMessage } from '@/utils/welcomeMessageUtils';
import TeamHeader from '@/components/team/TeamHeader';
import TeamContent from '@/components/team/TeamContent';
import AddMemberDialog from '@/components/team/AddMemberDialog';
import EditMemberDialog from '@/components/team/EditMemberDialog';
import DeleteMemberDialog from '@/components/team/DeleteMemberDialog';

const StorageTeamContainer: React.FC = () => {
  const {
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    selectedMember,
    teamMembers,
    isLoading,
    lastAddedMember,
    phoneError,
    emailError,
    handleAddMember,
    handleEditMember,
    handleUpdateMember,
    handleDeleteMember,
    handleConfirmDelete,
    handleCopyWelcomeMessageForMember,
    generateWelcomeMessageForMember,
    resetErrors,
    copyWelcomeMessage
  } = useStorageTeamPage();
  
  const welcomeMessage = generateWelcomeMessage(lastAddedMember);

  return (
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
  );
};

export default StorageTeamContainer;
