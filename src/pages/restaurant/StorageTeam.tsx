
import React, { useEffect, useState } from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { useStorageTeam } from '@/hooks/useStorageTeam';
import { StorageTeamMember } from '@/types';
import { useToast } from '@/hooks/use-toast';
import TeamHeader from '@/components/team/TeamHeader';
import TeamContent from '@/components/team/TeamContent';
import AddMemberDialog from '@/components/team/AddMemberDialog';
import EditMemberDialog from '@/components/team/EditMemberDialog';

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
        <TeamHeader onAddMember={() => setShowAddDialog(true)} />
        
        <TeamContent 
          teamMembers={teamMembers}
          isLoading={isLoading}
          onEditMember={handleEditMember}
          onDeleteMember={handleDeleteMember}
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
